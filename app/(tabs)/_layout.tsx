import * as React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, CheckSquare, Timer, Calendar, BarChart2, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.primary,
                tabBarInactiveTintColor: Colors.light.textSecondary,
                tabBarStyle: {
                    backgroundColor: Colors.light.card,
                    borderTopWidth: 1,
                    borderTopColor: Colors.light.border,
                    elevation: 8,
                    height: Platform.OS === 'ios' ? 88 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                    marginBottom: insets.bottom,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="habits"
                options={{
                    title: 'Habits',
                    tabBarIcon: ({ color }) => <CheckSquare size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="todos"
                options={{
                    title: 'Todos',
                    tabBarIcon: ({ color }) => <CheckCircle2 size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="pomodoro"
                options={{
                    title: 'Timer',
                    tabBarIcon: ({ color }) => <Timer size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
