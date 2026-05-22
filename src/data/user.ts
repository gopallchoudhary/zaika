import { User } from "./types";


const user: User = {
  id: "usr_001",
  name: "Gopal Chaudhary",
  email: "gopalchaudhary@example.com",
  phone: "+91 9876543210",
  avatarUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  addresses: [
    {
      id: "addr_001",
      label: "Home",
      line1: "House No. 45, Shanti Nagar",
      line2: "Near City Mall",
      city: "Raipur",
      pincode: "492001",
      isDefault: true,
    },
    {
      id: "addr_002",
      label: "Work",
      line1: "Tech Park, Ring Road",
      city: "Bilaspur",
      pincode: "495001",
      isDefault: false,
    },
  ],
  savedRestaurantIds: [
    "rest_101",
    "rest_205",
    "rest_309",
    "rest_412",
  ],
  joinedAt: "2026-05-22T08:30:00Z",
};