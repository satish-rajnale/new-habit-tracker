import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Award, Flame, Target } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Shared/Card';
import { useApp } from '../../contexts/AppContext';
import { format, subDays } from 'date-fns';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
    const { habits, todos, pomodoroSessions, dayActivities } = useApp();

    // Calculate stats
    const totalHabitsCompleted = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
    const currentStreak = Math.max(...habits.map(h => h.streak), 0);
    const todayCompleted = habits.filter(h => h.completedToday).length;
    const completionRate = habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0;

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayTodos = todos.filter(t => t.date === today);
    const completedTodos = todayTodos.filter(t => t.completed).length;

    const todaySessions = pomodoroSessions.filter(s => s.date === today && s.completed);
    const totalFocusTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    // Last 7 days data for chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
        const activity = dayActivities.find(a => a.date === date);
        return {
            day: format(subDays(new Date(), 6 - i), 'EEE'),
            value: activity ? activity.habits.length : 0,
            date,
        };
    });

    const maxValue = Math.max(...last7Days.map(d => d.value), 1);
    const chartHeight = 150;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Analytics</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Overview Cards */}
                <View style={styles.statOverviews}>
                    <Card style={styles.overviewCard}>
                        <View style={[styles.iconContainer, { backgroundColor: Colors.light.primary + '20' }]}>
                            <TrendingUp size={24} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.overviewValue}>{completionRate}%</Text>
                        <Text style={styles.overviewLabel}>Completion Rate</Text>
                        <Text style={styles.increaseText}>Today's Progress</Text>
                    </Card>
                    <Card style={styles.overviewCard}>
                        <View style={[styles.iconContainer, { backgroundColor: Colors.light.success + '20' }]}>
                            <Flame size={24} color={Colors.light.success} />
                        </View>
                        <Text style={styles.overviewValue}>{currentStreak}</Text>
                        <Text style={styles.overviewLabel}>Current Streak</Text>
                        <Text style={styles.increaseText}>Keep it up!</Text>
                    </Card>
                </View>

                {/* Activity Chart */}
                <Card style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Weekly Activity</Text>
                        <Text style={styles.dateRange}>Last 7 Days</Text>
                    </View>

                    <View style={styles.chartContainer}>
                        {last7Days.map((item, i) => {
                            const barHeight = (item.value / maxValue) * chartHeight;
                            const isToday = item.date === today;

                            return (
                                <View key={i} style={styles.barContainer}>
                                    <View style={styles.barWrapper}>
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    height: barHeight || 4,
                                                    backgroundColor: isToday ? Colors.light.primary : '#E5E7EB',
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                                        {item.day}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {/* Performance Metrics */}
                <Text style={styles.sectionTitle}>Performance</Text>

                <Card style={styles.metricCard}>
                    <View style={styles.metricRow}>
                        <View style={[styles.metricIcon, { backgroundColor: Colors.light.primary + '20' }]}>
                            <Target size={20} color={Colors.light.primary} />
                        </View>
                        <View style={styles.metricInfo}>
                            <Text style={styles.metricLabel}>Total Habits Completed</Text>
                            <Text style={styles.metricValue}>{totalHabitsCompleted} times</Text>
                        </View>
                    </View>
                </Card>

                <Card style={styles.metricCard}>
                    <View style={styles.metricRow}>
                        <View style={[styles.metricIcon, { backgroundColor: Colors.light.success + '20' }]}>
                            <Award size={20} color={Colors.light.success} />
                        </View>
                        <View style={styles.metricInfo}>
                            <Text style={styles.metricLabel}>Tasks Completed Today</Text>
                            <Text style={styles.metricValue}>{completedTodos} / {todayTodos.length}</Text>
                        </View>
                    </View>
                </Card>

                <Card style={styles.metricCard}>
                    <View style={styles.metricRow}>
                        <View style={[styles.metricIcon, { backgroundColor: '#F59E0B20' }]}>
                            <Flame size={20} color="#F59E0B" />
                        </View>
                        <View style={styles.metricInfo}>
                            <Text style={styles.metricLabel}>Focus Time Today</Text>
                            <Text style={styles.metricValue}>{totalFocusTime} minutes</Text>
                        </View>
                    </View>
                </Card>

                {/* Habit Performance */}
                <Text style={styles.sectionTitle}>Top Habits</Text>
                {habits
                    .sort((a, b) => b.streak - a.streak)
                    .slice(0, 5)
                    .map((habit, i) => (
                        <Card key={habit.id} style={styles.habitRow}>
                            <View style={styles.habitRank}>
                                <Text style={styles.rankText}>#{i + 1}</Text>
                            </View>
                            <View style={[styles.habitIconSmall, { backgroundColor: habit.color + '20' }]}>
                                <Text style={styles.habitEmojiSmall}>{habit.icon}</Text>
                            </View>
                            <View style={styles.habitDetails}>
                                <Text style={styles.habitName}>{habit.name}</Text>
                                <Text style={styles.habitStat}>🔥 {habit.streak} day streak</Text>
                            </View>
                            <View style={styles.scoreContainer}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${Math.min((habit.streak / 30) * 100, 100)}%`,
                                                backgroundColor: habit.color,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.scoreText}>{habit.completedDates.length}</Text>
                            </View>
                        </Card>
                    ))}

                {habits.length === 0 && (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>Start tracking habits to see your stats here!</Text>
                    </Card>
                )}
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
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 0,
    },
    statOverviews: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    overviewCard: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    overviewValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 4,
    },
    overviewLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginBottom: 8,
        textAlign: 'center',
    },
    increaseText: {
        fontSize: 10,
        color: Colors.light.success,
        fontWeight: '600',
    },
    chartCard: {
        padding: 24,
        marginBottom: 32,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateRange: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        backgroundColor: '#F1F5F9',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    barWrapper: {
        width: '70%',
        height: 150,
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    bar: {
        width: '100%',
        borderRadius: 8,
        minHeight: 4,
    },
    dayLabel: {
        fontSize: 11,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    todayLabel: {
        color: Colors.light.primary,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: Colors.light.text,
    },
    metricCard: {
        padding: 16,
        marginBottom: 12,
    },
    metricRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metricIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    metricInfo: {
        flex: 1,
    },
    metricLabel: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    habitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    habitRank: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.light.textSecondary,
    },
    habitIconSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    habitEmojiSmall: {
        fontSize: 20,
    },
    habitDetails: {
        flex: 1,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    habitStat: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    scoreContainer: {
        alignItems: 'flex-end',
        minWidth: 60,
    },
    progressBar: {
        width: 60,
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    scoreText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.textSecondary,
    },
    emptyCard: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
});
