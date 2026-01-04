import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { Habit, Todo, PomodoroSession, DayActivity, WeatherData } from '../constants/types';
import { storage } from '../utils/storage';
import { SAMPLE_HABITS } from '../constants/sampleData';
import { format, subDays } from 'date-fns';

interface AppContextType {
    habits: Habit[];
    todos: Todo[];
    pomodoroSessions: PomodoroSession[];
    dayActivities: DayActivity[];
    weather: WeatherData | null;
    isLoading: boolean;

    // Habit actions
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'completedDates'>) => Promise<void>;
    toggleHabit: (habitId: string) => Promise<void>;
    deleteHabit: (habitId: string) => Promise<void>;

    // Todo actions
    addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
    toggleTodo: (todoId: string) => Promise<void>;
    deleteTodo: (todoId: string) => Promise<void>;

    // Pomodoro actions
    addPomodoroSession: (session: Omit<PomodoroSession, 'id'>) => Promise<void>;

    // Weather
    fetchWeather: () => Promise<void>;

    // Day activities
    getDayActivity: (date: string) => DayActivity | undefined;
    getActiveDates: () => string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
    const [dayActivities, setDayActivities] = useState<DayActivity[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize app data
    useEffect(() => {
        loadAppData();
    }, []);

    const loadAppData = async () => {
        try {
            const savedHabits = await storage.get(storage.keys.HABITS);
            const savedTodos = await storage.get(storage.keys.TODOS);
            const savedPomodoro = await storage.get('POMODORO_SESSIONS');
            const savedActivities = await storage.get('DAY_ACTIVITIES');

            if (savedHabits) {
                setHabits(savedHabits);
            } else {
                // Initialize with sample data and generate dummy history
                const habitsWithHistory = SAMPLE_HABITS.map(habit => ({
                    ...habit,
                    completedDates: generateRandomCompletedDates(),
                }));
                setHabits(habitsWithHistory);
                await storage.set(storage.keys.HABITS, habitsWithHistory);
            }

            if (savedTodos) {
                setTodos(savedTodos);
            } else {
                const initialTodos = generateSampleTodos();
                setTodos(initialTodos);
                await storage.set(storage.keys.TODOS, initialTodos);
            }

            if (savedPomodoro) {
                setPomodoroSessions(savedPomodoro);
            } else {
                const initialSessions = generateSamplePomodoroSessions();
                setPomodoroSessions(initialSessions);
                await storage.set('POMODORO_SESSIONS', initialSessions);
            }

            if (savedActivities) {
                setDayActivities(savedActivities);
            } else {
                const activities = generateDayActivities();
                setDayActivities(activities);
                await storage.set('DAY_ACTIVITIES', activities);
            }

            await fetchWeather();
        } catch (error) {
            console.error('Error loading app data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate random completed dates for the past 30 days
    const generateRandomCompletedDates = (): string[] => {
        const dates: string[] = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = subDays(today, i);
            // 70% chance of completion
            if (Math.random() > 0.3) {
                dates.push(format(date, 'yyyy-MM-dd'));
            }
        }

        return dates;
    };

    const generateSampleTodos = (): Todo[] => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return [
            { id: '1', title: 'Team Meeting', time: '10:00 AM', place: 'Office', icon: '💼', completed: false, date: today },
            { id: '2', title: 'Grocery Shopping', time: '02:00 PM', place: 'Supermarket', icon: '🛒', completed: false, date: today },
            { id: '3', title: 'Gym Session', time: '06:00 PM', place: 'Fitness Center', icon: '🏋️', completed: true, date: today },
        ];
    };

    const generateSamplePomodoroSessions = (): PomodoroSession[] => {
        const sessions: PomodoroSession[] = [];
        const today = new Date();

        for (let i = 0; i < 15; i++) {
            const date = format(subDays(today, i), 'yyyy-MM-dd');
            const sessionCount = Math.floor(Math.random() * 5) + 1;

            for (let j = 0; j < sessionCount; j++) {
                sessions.push({
                    id: `${date}-${j}`,
                    date,
                    duration: 25,
                    type: 'focus',
                    completed: true,
                    startTime: `${9 + j}:00`,
                });
            }
        }

        return sessions;
    };

    const generateDayActivities = (): DayActivity[] => {
        const activities: DayActivity[] = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = format(subDays(today, i), 'yyyy-MM-dd');
            const habitCount = Math.floor(Math.random() * 8) + 2;
            const todoCount = Math.floor(Math.random() * 5) + 1;
            const pomodoroCount = Math.floor(Math.random() * 6) + 1;

            activities.push({
                date,
                habits: Array.from({ length: habitCount }, (_, idx) => `habit-${idx}`),
                todos: Array.from({ length: todoCount }, (_, idx) => `todo-${idx}`),
                pomodoroSessions: pomodoroCount,
                totalFocusTime: pomodoroCount * 25,
            });
        }

        return activities;
    };

    // Habit actions
    const addHabit = async (habitData: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'completedDates'>) => {
        const newHabit: Habit = {
            ...habitData,
            id: Date.now().toString(),
            streak: 0,
            completedToday: false,
            completedDates: [],
        };

        const updatedHabits = [...habits, newHabit];
        setHabits(updatedHabits);
        await storage.set(storage.keys.HABITS, updatedHabits);
    };

    const toggleHabit = async (habitId: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const updatedHabits = habits.map(habit => {
            if (habit.id === habitId) {
                const isCompleted = !habit.completedToday;
                const completedDates = isCompleted
                    ? [...habit.completedDates, today]
                    : habit.completedDates.filter(d => d !== today);

                return {
                    ...habit,
                    completedToday: isCompleted,
                    streak: isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
                    completedDates,
                };
            }
            return habit;
        });

        setHabits(updatedHabits);
        await storage.set(storage.keys.HABITS, updatedHabits);
    };

    const deleteHabit = async (habitId: string) => {
        const updatedHabits = habits.filter(h => h.id !== habitId);
        setHabits(updatedHabits);
        await storage.set(storage.keys.HABITS, updatedHabits);
    };

    // Todo actions
    const addTodo = async (todoData: Omit<Todo, 'id'>) => {
        const newTodo: Todo = {
            ...todoData,
            id: Date.now().toString(),
        };

        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        await storage.set(storage.keys.TODOS, updatedTodos);
    };

    const toggleTodo = async (todoId: string) => {
        const updatedTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        );

        setTodos(updatedTodos);
        await storage.set(storage.keys.TODOS, updatedTodos);
    };

    const deleteTodo = async (todoId: string) => {
        const updatedTodos = todos.filter(t => t.id !== todoId);
        setTodos(updatedTodos);
        await storage.set(storage.keys.TODOS, updatedTodos);
    };

    // Pomodoro actions
    const addPomodoroSession = async (sessionData: Omit<PomodoroSession, 'id'>) => {
        const newSession: PomodoroSession = {
            ...sessionData,
            id: Date.now().toString(),
        };

        const updatedSessions = [...pomodoroSessions, newSession];
        setPomodoroSessions(updatedSessions);
        await storage.set('POMODORO_SESSIONS', updatedSessions);
    };

    // Weather
    const fetchWeather = async () => {
        try {
            // Using a free weather API - OpenWeatherMap
            // For demo, using mock data. In production, get user location and fetch real data
            const mockWeather: WeatherData = {
                temp: 22,
                condition: 'Partly Cloudy',
                icon: '⛅',
                humidity: 65,
                windSpeed: 12,
                location: 'Your City',
                feelsLike: 24,
            };

            setWeather(mockWeather);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    // Day activities
    const getDayActivity = (date: string): DayActivity | undefined => {
        return dayActivities.find(activity => activity.date === date);
    };

    const getActiveDates = (): string[] => {
        return dayActivities.map(activity => activity.date);
    };

    const value: AppContextType = {
        habits,
        todos,
        pomodoroSessions,
        dayActivities,
        weather,
        isLoading,
        addHabit,
        toggleHabit,
        deleteHabit,
        addTodo,
        toggleTodo,
        deleteTodo,
        addPomodoroSession,
        fetchWeather,
        getDayActivity,
        getActiveDates,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
