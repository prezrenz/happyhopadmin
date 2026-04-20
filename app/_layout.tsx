import { Octicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Index from './index';
import ReportsScreen from './reports';
import UsersScreen from './users';

export default function RootLayout() {

  const Drawer = createDrawerNavigator();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          title: 'BunnyCare Admin',
          drawerActiveTintColor: 'gray',
          drawerActiveBackgroundColor: 'lightgray',
          drawerLabelStyle: {
            color: 'black',
          },
        }}>
        <Drawer.Screen name="Dashboard" component={Index} options={{
          title: 'Dashboard',
          drawerIcon: ({ focused, size, color }) => {
            <Octicons name="home" size={size} color={color} />
          }
        }} />
        <Drawer.Screen name="Users" component={UsersScreen} options={{
          title: 'Users',
          drawerIcon: ({ focused, size, color }) => {
            <Octicons name="person" size={size} color={color} />
          }
        }} />
        <Drawer.Screen name="Reports" component={ReportsScreen} options={{
          title: 'Reports',
          drawerIcon: ({ focused, size, color }) => {
            <Octicons name="report" size={size} color={color} />
          }
        }} />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}
