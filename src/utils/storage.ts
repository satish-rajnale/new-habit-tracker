import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
    async set(key: string, value: any) {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error('Error saving data', e);
        }
    },

    async get(key: string) {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error reading data', e);
            return null;
        }
    },

    async remove(key: string) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing data', e);
        }
    },

    keys: {
        HABITS: 'habits',
        TODOS: 'todos',
        POMODORO: 'pomodoro_settings',
        STATS: 'stats',
        DAY_ACTIVITIES: 'day_activities',
        POMODORO_SESSIONS: 'pomodoro_sessions',
        ONBOARDING_COMPLETE: 'onboarding_complete',
    }
};
