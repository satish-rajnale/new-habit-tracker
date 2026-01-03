export interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    streak: number;
    completedToday: boolean;
    category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'learning';
    description?: string;
    completedDates: string[]; // ISO date strings
}

export interface Todo {
    id: string;
    title: string;
    time: string;
    place: string;
    completed: boolean;
    icon: string;
    date: string; // ISO date string
}

export interface PomodoroSession {
    id: string;
    date: string; // ISO date string
    duration: number; // in minutes
    type: 'focus' | 'break';
    completed: boolean;
    startTime: string;
    endTime?: string;
}

export interface DayActivity {
    date: string; // ISO date string
    habits: string[]; // habit IDs completed
    todos: string[]; // todo IDs completed
    pomodoroSessions: number;
    totalFocusTime: number; // in minutes
}

export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    location: string;
    feelsLike: number;
}

export interface UserStats {
    totalHabitsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    totalPomodoroSessions: number;
    totalFocusTime: number;
    completionRate: number;
}
