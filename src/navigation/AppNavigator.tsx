import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutDashboard, CheckSquare, Timer, Calendar as CalendarIcon, BarChart2 } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

// Screens
import DashboardScreen from '../screens/tabs/Dashboard';
import HabitsScreen from '../screens/tabs/Habits';
import TodosScreen from '../screens/tabs/Todos';
import PomodoroScreen from '../screens/tabs/Pomodoro';
import CalendarScreen from '../screens/tabs/Calendar';
import StatsScreen from '../screens/tabs/Stats';
import DayDetailScreen from '../screens/DayDetail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.light.primary,
                tabBarInactiveTintColor: Colors.light.textSecondary,
                tabBarStyle: {
                    backgroundColor: Colors.light.card,
                    borderTopColor: Colors.light.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Habits"
                component={HabitsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Pomodoro"
                component={PomodoroScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Timer size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <CalendarIcon size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Stats"
                component={StatsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="DayDetail" component={DayDetailScreen} />
            <Stack.Screen name="Todos" component={TodosScreen} />
        </Stack.Navigator>
    );
}
