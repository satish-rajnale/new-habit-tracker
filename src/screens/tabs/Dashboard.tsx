import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ChevronRight, Search, Menu, X, CloudRain, Wind, Droplets, Thermometer, Clock, CheckCircle2, Trophy, TrendingUp, Zap, Target } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Shared/Card';
import { Button } from '../../components/Shared/Button';
import { useApp } from '../../contexts/AppContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { router } from 'expo-router';

export default function DashboardScreen() {
    const { habits, todos, pomodoroSessions, weather, toggleHabit, toggleTodo, getActiveDates } = useApp();
    const [searchVisible, setSearchVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    // Calculate stats
    const todayHabits = habits.filter(h => h.completedToday);
    const totalHabits = habits.length;
    const habitCompletionRate = totalHabits > 0 ? Math.round((todayHabits.length / totalHabits) * 100) : 0;

    const todayTodos = todos.filter(t => t.date === todayStr);
    const completedTodos = todayTodos.filter(t => t.completed);
    const todoCompletionRate = todayTodos.length > 0 ? Math.round((completedTodos.length / todayTodos.length) * 100) : 0;

    const todaySessions = pomodoroSessions.filter(s => s.date === todayStr && s.completed);
    const totalFocusTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    const currentStreak = Math.max(...habits.map(h => h.streak), 0);

    // Calendar data
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const activeDates = getActiveDates();

    // Search filter
    const searchResults = searchQuery.trim() ? [
        ...habits.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())),
        ...todos.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
    ] : [];

    const handleNavigateToHabits = () => {
        router.push('/(tabs)/habits');
    };

    const handleNavigateToCalendar = () => {
        router.push('/(tabs)/calendar');
    };

    const handleNavigateToTodos = () => {
        router.push('/(tabs)/todos');
    };

    const handleNavigateToPomodoro = () => {
        router.push('/(tabs)/pomodoro');
    };

    const handleNavigateToStats = () => {
        router.push('/(tabs)/stats');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Happy {format(today, 'EEEE')} 👋</Text>
                        <Text style={styles.date}>{format(today, 'dd MMM yyyy')}</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => setSearchVisible(true)} style={styles.iconButton}>
                            <Search size={22} color={Colors.light.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.iconButton}>
                            <Menu size={22} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Stats Overview */}
                <View style={styles.quickStats}>
                    <TouchableOpacity style={styles.statBox} onPress={handleNavigateToHabits}>
                        <View style={[styles.statIcon, { backgroundColor: Colors.light.primary + '20' }]}>
                            <CheckCircle2 size={20} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.statValue}>{todayHabits.length}/{totalHabits}</Text>
                        <Text style={styles.statLabel}>Habits</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.statBox} onPress={handleNavigateToTodos}>
                        <View style={[styles.statIcon, { backgroundColor: Colors.light.success + '20' }]}>
                            <Target size={20} color={Colors.light.success} />
                        </View>
                        <Text style={styles.statValue}>{completedTodos.length}/{todayTodos.length}</Text>
                        <Text style={styles.statLabel}>Tasks</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.statBox} onPress={handleNavigateToPomodoro}>
                        <View style={[styles.statIcon, { backgroundColor: '#F59E0B20' }]}>
                            <Zap size={20} color="#F59E0B" />
                        </View>
                        <Text style={styles.statValue}>{todaySessions.length}</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.statBox} onPress={handleNavigateToStats}>
                        <View style={[styles.statIcon, { backgroundColor: '#EF444420' }]}>
                            <Trophy size={20} color="#EF4444" />
                        </View>
                        <Text style={styles.statValue}>{currentStreak}</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </TouchableOpacity>
                </View>

                {/* Weather Card */}
                {weather && (
                    <Card style={styles.weatherCard}>
                        <View style={styles.weatherHeader}>
                            <Text style={styles.cardTitle}>Weather</Text>
                            <Text style={styles.location}>📍 {weather.location}</Text>
                        </View>
                        <View style={styles.weatherMain}>
                            <Text style={styles.weatherIcon}>{weather.icon}</Text>
                            <View>
                                <Text style={styles.temp}>{weather.temp}°C</Text>
                                <Text style={styles.condition}>{weather.condition}</Text>
                            </View>
                        </View>
                        <View style={styles.weatherMetrics}>
                            <View style={styles.metric}>
                                <Wind size={16} color={Colors.light.textSecondary} />
                                <Text style={styles.metricText}>{weather.windSpeed} km/h</Text>
                            </View>
                            <View style={styles.metric}>
                                <Thermometer size={16} color={Colors.light.textSecondary} />
                                <Text style={styles.metricText}>Feels {weather.feelsLike}°C</Text>
                            </View>
                            <View style={styles.metric}>
                                <Droplets size={16} color={Colors.light.textSecondary} />
                                <Text style={styles.metricText}>{weather.humidity}%</Text>
                            </View>
                        </View>
                    </Card>
                )}

                {/* Today's Habits */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's Habits</Text>
                    <TouchableOpacity onPress={handleNavigateToHabits}>
                        <Text style={styles.seeAll}>See All →</Text>
                    </TouchableOpacity>
                </View>

                {habits.slice(0, 4).map(habit => (
                    <Card key={habit.id} style={styles.habitCard}>
                        <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                            <Text style={styles.habitEmoji}>{habit.icon}</Text>
                        </View>
                        <View style={styles.habitInfo}>
                            <Text style={styles.habitName}>{habit.name}</Text>
                            <Text style={styles.habitStreak}>🔥 {habit.streak} day streak</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.checkButton, habit.completedToday && styles.checkedButton]}
                            onPress={() => toggleHabit(habit.id)}
                        >
                            <CheckCircle2
                                size={24}
                                color={habit.completedToday ? 'white' : Colors.light.primary}
                            />
                        </TouchableOpacity>
                    </Card>
                ))}

                {/* Mini Calendar */}
                <TouchableOpacity onPress={handleNavigateToCalendar}>
                    <Card style={styles.calendarCard}>
                        <View style={styles.calendarHeader}>
                            <Text style={styles.cardTitle}>{format(today, 'MMMM yyyy')}</Text>
                            <ChevronRight size={20} color={Colors.light.primary} />
                        </View>
                        <View style={styles.calendarGrid}>
                            {days.slice(0, 21).map((day, i) => {
                                const isToday = isSameDay(day, today);
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const hasActivity = activeDates.includes(dateStr);

                                return (
                                    <View key={i} style={[styles.calendarDay, isToday && styles.activeDay]}>
                                        <Text style={[styles.dayText, isToday && styles.activeDayText]}>
                                            {format(day, 'd')}
                                        </Text>
                                        {hasActivity && <View style={styles.activityDot} />}
                                    </View>
                                );
                            })}
                        </View>
                        <Text style={styles.calendarHint}>Tap to view full calendar</Text>
                    </Card>
                </TouchableOpacity>

                {/* Today's Tasks */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's Tasks</Text>
                    <TouchableOpacity onPress={handleNavigateToTodos}>
                        <Text style={styles.seeAll}>See All →</Text>
                    </TouchableOpacity>
                </View>

                {todayTodos.slice(0, 3).map(todo => (
                    <Card key={todo.id} style={styles.todoCard}>
                        <TouchableOpacity
                            style={styles.todoContent}
                            onPress={() => toggleTodo(todo.id)}
                        >
                            <Text style={styles.todoIcon}>{todo.icon}</Text>
                            <View style={styles.todoInfo}>
                                <Text style={[styles.todoTitle, todo.completed && styles.todoCompleted]}>
                                    {todo.title}
                                </Text>
                                <View style={styles.todoMeta}>
                                    <Clock size={12} color={Colors.light.textSecondary} />
                                    <Text style={styles.todoTime}> {todo.time}</Text>
                                </View>
                            </View>
                            <View style={[styles.todoCheck, todo.completed && styles.todoCheckCompleted]}>
                                {todo.completed && <CheckCircle2 size={20} color="white" />}
                            </View>
                        </TouchableOpacity>
                    </Card>
                ))}

                {todayTodos.length === 0 && (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No tasks for today. Enjoy your day! 🎉</Text>
                    </Card>
                )}

                {/* Performance Card */}
                <Card style={styles.performanceCard}>
                    <Text style={styles.cardTitle}>Today's Performance</Text>
                    <View style={styles.performanceGrid}>
                        <View style={styles.performanceItem}>
                            <Text style={styles.performanceValue}>{habitCompletionRate}%</Text>
                            <Text style={styles.performanceLabel}>Habits</Text>
                            <View style={styles.performanceBar}>
                                <View style={[styles.performanceBarFill, { width: `${habitCompletionRate}%`, backgroundColor: Colors.light.primary }]} />
                            </View>
                        </View>
                        <View style={styles.performanceItem}>
                            <Text style={styles.performanceValue}>{todoCompletionRate}%</Text>
                            <Text style={styles.performanceLabel}>Tasks</Text>
                            <View style={styles.performanceBar}>
                                <View style={[styles.performanceBarFill, { width: `${todoCompletionRate}%`, backgroundColor: Colors.light.success }]} />
                            </View>
                        </View>
                        <View style={styles.performanceItem}>
                            <Text style={styles.performanceValue}>{totalFocusTime}m</Text>
                            <Text style={styles.performanceLabel}>Focus</Text>
                            <View style={styles.performanceBar}>
                                <View style={[styles.performanceBarFill, { width: `${Math.min((totalFocusTime / 120) * 100, 100)}%`, backgroundColor: '#F59E0B' }]} />
                            </View>
                        </View>
                    </View>
                </Card>
            </ScrollView>

            {/* Search Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={searchVisible}
                onRequestClose={() => setSearchVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.searchModal}>
                        <View style={styles.searchHeader}>
                            <Text style={styles.modalTitle}>Search</Text>
                            <TouchableOpacity onPress={() => setSearchVisible(false)}>
                                <X size={24} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.searchInputContainer}>
                            <Search size={20} color={Colors.light.textSecondary} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search habits, tasks..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                                placeholderTextColor={Colors.light.textSecondary}
                            />
                        </View>
                        <ScrollView style={styles.searchResults}>
                            {searchResults.length > 0 ? (
                                searchResults.map((item: any) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.searchResultItem}
                                        onPress={() => {
                                            setSearchVisible(false);
                                            setSearchQuery('');
                                            if ('streak' in item) {
                                                handleNavigateToHabits();
                                            } else {
                                                handleNavigateToTodos();
                                            }
                                        }}
                                    >
                                        <Text style={styles.searchResultIcon}>{item.icon}</Text>
                                        <Text style={styles.searchResultText}>
                                            {'streak' in item ? item.name : item.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            ) : searchQuery.trim() ? (
                                <Text style={styles.noResults}>No results found</Text>
                            ) : (
                                <Text style={styles.searchHint}>Start typing to search...</Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Menu Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.menuModal}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.modalTitle}>Menu</Text>
                            <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                <X size={24} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleNavigateToHabits(); }}>
                            <CheckCircle2 size={20} color={Colors.light.primary} />
                            <Text style={styles.menuText}>Habits</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleNavigateToTodos(); }}>
                            <Target size={20} color={Colors.light.success} />
                            <Text style={styles.menuText}>Tasks</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleNavigateToPomodoro(); }}>
                            <Zap size={20} color="#F59E0B" />
                            <Text style={styles.menuText}>Pomodoro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleNavigateToCalendar(); }}>
                            <Clock size={20} color="#6366F1" />
                            <Text style={styles.menuText}>Calendar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleNavigateToStats(); }}>
                            <TrendingUp size={20} color="#EF4444" />
                            <Text style={styles.menuText}>Analytics</Text>
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('https://github.com')}>
                            <Text style={styles.menuText}>About</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    date: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 8,
    },
    statBox: {
        flex: 1,
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: Colors.light.textSecondary,
    },
    weatherCard: {
        padding: 20,
        marginBottom: 24,
    },
    weatherHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    location: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    weatherMain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 16,
    },
    weatherIcon: {
        fontSize: 48,
    },
    temp: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    condition: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    weatherMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    metric: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricText: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    seeAll: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '600',
    },
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    habitIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    habitEmoji: {
        fontSize: 24,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    habitStreak: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    checkButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedButton: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    calendarCard: {
        padding: 20,
        marginBottom: 24,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    calendarDay: {
        width: '12%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        position: 'relative',
    },
    activeDay: {
        backgroundColor: Colors.light.primary,
    },
    dayText: {
        fontSize: 12,
        color: Colors.light.text,
    },
    activeDayText: {
        color: 'white',
        fontWeight: 'bold',
    },
    activityDot: {
        position: 'absolute',
        bottom: 2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.light.success,
    },
    calendarHint: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginTop: 12,
    },
    todoCard: {
        padding: 16,
        marginBottom: 12,
    },
    todoContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    todoInfo: {
        flex: 1,
    },
    todoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    todoCompleted: {
        textDecorationLine: 'line-through',
        color: Colors.light.textSecondary,
    },
    todoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoTime: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    todoCheck: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.light.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todoCheckCompleted: {
        backgroundColor: Colors.light.success,
        borderColor: Colors.light.success,
    },
    emptyCard: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
    performanceCard: {
        padding: 20,
        marginBottom: 24,
    },
    performanceGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    performanceItem: {
        flex: 1,
        alignItems: 'center',
    },
    performanceValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    performanceLabel: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        marginBottom: 8,
    },
    performanceBar: {
        width: '100%',
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    performanceBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    searchModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '80%',
    },
    searchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
    },
    searchResults: {
        maxHeight: 400,
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
        gap: 12,
    },
    searchResultIcon: {
        fontSize: 24,
    },
    searchResultText: {
        fontSize: 16,
        color: Colors.light.text,
    },
    noResults: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        padding: 32,
    },
    searchHint: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        padding: 32,
    },
    menuModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    menuText: {
        fontSize: 16,
        color: Colors.light.text,
        fontWeight: '500',
    },
    menuDivider: {
        height: 1,
        backgroundColor: Colors.light.border,
        marginVertical: 8,
    },
});
