import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homescreen from "../screens/home/Homescreen";
import RestaurantDetailScreen from "../screens/home/RestaurantDetailScreen";

const HomeStacks = createNativeStackNavigator();

export default function HomeStack() {
	return (
		<HomeStacks.Navigator>
			<HomeStacks.Screen name="Home" component={Homescreen}/>
            <HomeStacks.Screen name="RestaurantDetail" component={RestaurantDetailScreen}/>
		</HomeStacks.Navigator>
	);
}
