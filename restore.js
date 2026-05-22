const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = `C:\\Users\\GOPAL CHOUDHARY\\.gemini\\antigravity-ide\\brain\\fdcdad0d-4ade-4221-b2b7-62ed17d2e83c\\.system_generated\\logs\\transcript.jsonl`;
const workspaceDir = `e:\\Codes\\PROJECTS\\zaika`;

const filesToRestore = {};

function cleanArg(val) {
  if (typeof val !== 'string') return val;
  val = val.trim();
  if (val.startsWith('"') && val.endsWith('"')) {
    try {
      return JSON.parse(val);
    } catch (e) {}
  }
  return val;
}

async function run() {
  if (!fs.existsSync(logPath)) {
    console.error(`Log path does not exist: ${logPath}`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      const toolCalls = data.tool_calls || [];
      
      for (const tc of toolCalls) {
        if (tc.name === 'write_to_file') {
          let args = tc.args || {};
          if (typeof args === 'string') {
            try {
              args = JSON.parse(args);
            } catch (e) {
              continue;
            }
          }
          
          const target = cleanArg(args.TargetFile || '');
          const content = cleanArg(args.CodeContent || '');
          
          if (target && content) {
            const normalized = path.normalize(target).toLowerCase();
            filesToRestore[normalized] = {
              originalPath: target,
              content: content
            };
            console.log(`Found write_to_file for: ${target} (length: ${content.length})`);
          }
        }
      }
    } catch (e) {
      console.error(`Error parsing line ${lineNum}:`, e.message);
    }
  }

  console.log('\n--- Summary of Files Found ---');
  for (const normPath of Object.keys(filesToRestore)) {
    const info = filesToRestore[normPath];
    console.log(`${info.originalPath}: ${info.content.length} chars`);
  }

  console.log('\n--- Restoring 0-byte or Empty Files ---');
  for (const normPath of Object.keys(filesToRestore)) {
    const info = filesToRestore[normPath];
    const filePath = info.originalPath;

    // Check if within workspace
    if (!filePath.toLowerCase().startsWith(workspaceDir.toLowerCase())) {
      console.log(`Skipping file outside workspace: ${filePath}`);
      continue;
    }

    const currentExists = fs.existsSync(filePath);
    let currentSize = 0;
    if (currentExists) {
      currentSize = fs.statSync(filePath).size;
    }

    let isPlaceholder = false;
    if (currentExists && currentSize < 300) {
      try {
        const checkContent = fs.readFileSync(filePath, 'utf8').trim();
        if (checkContent.includes('This is') || checkContent.length < 50) {
          isPlaceholder = true;
        }
      } catch (e) {
        isPlaceholder = true;
      }
    }

    if (!currentExists || currentSize === 0 || isPlaceholder) {
      console.log(`Restoring: ${filePath}`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, info.content, 'utf8');
      console.log(`Successfully restored ${filePath} (${info.content.length} chars)`);
    } else {
      console.log(`Skipping already populated file: ${filePath} (size: ${currentSize} bytes)`);
    }
  }

  console.log('\nRestore operation complete!');
}

run().catch(console.error);
