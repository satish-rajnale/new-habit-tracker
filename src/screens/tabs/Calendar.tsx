import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Shared/Card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { useApp } from '../../contexts/AppContext';
import { router } from 'expo-router';

export default function CalendarScreen() {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const { getActiveDates, getDayActivity } = useApp();

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activeDates = getActiveDates();
    const today = new Date();

    const handlePreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleDayPress = (day: Date) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const activity = getDayActivity(dateStr);

        if (activity) {
            router.push({
                pathname: '/day-detail',
                params: { date: dateStr }
            });
        }
    };

    const hasActivity = (day: Date): boolean => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return activeDates.includes(dateStr);
    };

    const getActivityLevel = (day: Date): 'low' | 'medium' | 'high' | null => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const activity = getDayActivity(dateStr);

        if (!activity) return null;

        const totalActivities = activity.habits.length + activity.todos.length + activity.pomodoroSessions;

        if (totalActivities >= 15) return 'high';
        if (totalActivities >= 8) return 'medium';
        return 'low';
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Calendar</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={styles.calendarCard}>
                    <View style={styles.monthHeader}>
                        <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
                        <View style={styles.navRow}>
                            <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
                                <ChevronLeft size={20} color={Colors.light.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                                <ChevronRight size={20} color={Colors.light.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.weekDaysRow}>
                        {weekDays.map((day, i) => (
                            <Text key={i} style={styles.weekDayText}>{day}</Text>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {days.map((day, i) => {
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, today);
                            const hasData = hasActivity(day);
                            const activityLevel = getActivityLevel(day);

                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.dayCell,
                                        isToday && styles.todayCell,
                                        hasData && styles.activeDayCell
                                    ]}
                                    onPress={() => handleDayPress(day)}
                                    disabled={!hasData}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        !isCurrentMonth && styles.otherMonthText,
                                        isToday && styles.todayText
                                    ]}>
                                        {format(day, 'd')}
                                    </Text>
                                    {hasData && (
                                        <View style={[
                                            styles.activityIndicator,
                                            activityLevel === 'high' && styles.activityHigh,
                                            activityLevel === 'medium' && styles.activityMedium,
                                            activityLevel === 'low' && styles.activityLow,
                                        ]} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.activityHigh]} />
                            <Text style={styles.legendText}>High Activity</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.activityMedium]} />
                            <Text style={styles.legendText}>Medium</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, styles.activityLow]} />
                            <Text style={styles.legendText}>Low</Text>
                        </View>
                    </View>
                </Card>

                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                <Card style={styles.eventCard}>
                    <View style={styles.eventTimeBox}>
                        <Text style={styles.eventDate}>31</Text>
                        <Text style={styles.eventMonth}>DEC</Text>
                    </View>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>New Year's Eve Marathon</Text>
                        <Text style={styles.eventSub}>09:00 PM • Central Park</Text>
                    </View>
                </Card>

                <Card style={styles.eventCard}>
                    <View style={[styles.eventTimeBox, { backgroundColor: '#F0F9FF' }]}>
                        <Text style={[styles.eventDate, { color: '#0EA5E9' }]}>01</Text>
                        <Text style={[styles.eventMonth, { color: '#0EA5E9' }]}>JAN</Text>
                    </View>
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>New Year Strategy Session</Text>
                        <Text style={styles.eventSub}>10:00 AM • Online</Text>
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
    calendarCard: {
        padding: 20,
        marginBottom: 32,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    monthTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    navButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    weekDayText: {
        width: '14%',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.light.textSecondary,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        position: 'relative',
    },
    dayText: {
        fontSize: 16,
        color: Colors.light.text,
    },
    otherMonthText: {
        color: '#CBD5E1',
    },
    todayCell: {
        backgroundColor: Colors.light.primary,
        borderRadius: 12,
    },
    todayText: {
        color: 'white',
        fontWeight: 'bold',
    },
    activeDayCell: {
        borderWidth: 2,
        borderColor: Colors.light.primary + '40',
        borderRadius: 12,
    },
    activityIndicator: {
        position: 'absolute',
        bottom: 4,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    activityHigh: {
        backgroundColor: '#10B981',
    },
    activityMedium: {
        backgroundColor: '#F59E0B',
    },
    activityLow: {
        backgroundColor: '#6366F1',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 11,
        color: Colors.light.textSecondary,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 16,
    },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    eventTimeBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#FFF9F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    eventDate: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    eventMonth: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    eventSub: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
});
