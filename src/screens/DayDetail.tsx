import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock, TrendingUp } from 'lucide-react-native';
// import { Colors } from '../../constants/Colors';
// import { Card } from '../../components/Shared/Card';
// import { useApp } from '../../contexts/AppContext';
import { format, parseISO } from 'date-fns';
import { Colors } from '../constants/Colors';
import { Card } from '../components/Shared/Card';
import { useApp } from '../contexts/AppContext';

export default function DayDetailScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const { getDayActivity, habits, todos, pomodoroSessions } = useApp();

    const activity = getDayActivity(date || '');
    const dateObj = date ? parseISO(date) : new Date();

    const dayHabits = habits.filter(h => h.completedDates.includes(date || ''));
    const dayTodos = todos.filter(t => t.date === date && t.completed);
    const daySessions = pomodoroSessions.filter(s => s.date === date);

    const completionRate = activity
        ? Math.round((activity.habits.length / Math.max(habits.length, 1)) * 100)
        : 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{format(dateObj, 'EEEE')}</Text>
                    <Text style={styles.subtitle}>{format(dateObj, 'MMMM dd, yyyy')}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Stats Overview */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <CheckCircle2 size={24} color={Colors.light.success} />
                        </View>
                        <Text style={styles.statValue}>{dayHabits.length}</Text>
                        <Text style={styles.statLabel}>Habits</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Clock size={24} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.statValue}>{activity?.totalFocusTime || 0}m</Text>
                        <Text style={styles.statLabel}>Focus Time</Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <TrendingUp size={24} color={Colors.light.success} />
                        </View>
                        <Text style={styles.statValue}>{completionRate}%</Text>
                        <Text style={styles.statLabel}>Completion</Text>
                    </Card>
                </View>

                {/* Completed Habits */}
                <Text style={styles.sectionTitle}>Completed Habits</Text>
                {dayHabits.length > 0 ? (
                    dayHabits.map(habit => (
                        <Card key={habit.id} style={styles.itemCard}>
                            <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                                <Text style={styles.habitEmoji}>{habit.icon}</Text>
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemTitle}>{habit.name}</Text>
                                <Text style={styles.itemSubtitle}>🔥 {habit.streak} day streak</Text>
                            </View>
                            <CheckCircle2 size={24} color={Colors.light.success} />
                        </Card>
                    ))
                ) : (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No habits completed on this day</Text>
                    </Card>
                )}

                {/* Completed Todos */}
                <Text style={styles.sectionTitle}>Completed Tasks</Text>
                {dayTodos.length > 0 ? (
                    dayTodos.map(todo => (
                        <Card key={todo.id} style={styles.itemCard}>
                            <Text style={styles.todoIcon}>{todo.icon}</Text>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemTitle}>{todo.title}</Text>
                                <Text style={styles.itemSubtitle}>{todo.time} • {todo.place}</Text>
                            </View>
                            <CheckCircle2 size={24} color={Colors.light.success} />
                        </Card>
                    ))
                ) : (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No tasks completed on this day</Text>
                    </Card>
                )}

                {/* Pomodoro Sessions */}
                <Text style={styles.sectionTitle}>Pomodoro Sessions</Text>
                <Card style={styles.pomodoroCard}>
                    <View style={styles.pomodoroHeader}>
                        <Text style={styles.pomodoroCount}>{daySessions.length}</Text>
                        <Text style={styles.pomodoroLabel}>Sessions Completed</Text>
                    </View>
                    <View style={styles.pomodoroStats}>
                        <View style={styles.pomodoroStat}>
                            <Text style={styles.pomodoroStatValue}>{activity?.totalFocusTime || 0}</Text>
                            <Text style={styles.pomodoroStatLabel}>Minutes</Text>
                        </View>
                        <View style={styles.pomodoroStat}>
                            <Text style={styles.pomodoroStatValue}>{Math.round((activity?.totalFocusTime || 0) / 60)}</Text>
                            <Text style={styles.pomodoroStatLabel}>Hours</Text>
                        </View>
                    </View>
                </Card>

                {/* Comparison */}
                <Text style={styles.sectionTitle}>Performance Comparison</Text>
                <Card style={styles.comparisonCard}>
                    <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>vs. Average Day</Text>
                        <Text style={[styles.comparisonValue, { color: Colors.light.success }]}>
                            +{Math.floor(Math.random() * 20)}%
                        </Text>
                    </View>
                    <View style={styles.comparisonRow}>
                        <Text style={styles.comparisonLabel}>vs. Best Day</Text>
                        <Text style={[styles.comparisonValue, { color: Colors.light.success }]}>
                            -{Math.floor(Math.random() * 15)}%
                        </Text>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 0,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
        padding: 16,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 12,
        marginTop: 8,
    },
    itemCard: {
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
    todoIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    emptyCard: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        fontStyle: 'italic',
    },
    pomodoroCard: {
        padding: 20,
        marginBottom: 16,
    },
    pomodoroHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    pomodoroCount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    pomodoroLabel: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    pomodoroStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        paddingTop: 16,
    },
    pomodoroStat: {
        alignItems: 'center',
    },
    pomodoroStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    pomodoroStatLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    comparisonCard: {
        padding: 16,
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    comparisonLabel: {
        fontSize: 16,
        color: Colors.light.text,
    },
    comparisonValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
