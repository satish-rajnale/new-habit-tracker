import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Shared/Card';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width - 100;

export default function PomodoroScreen() {
    const { addPomodoroSession, pomodoroSessions } = useApp();
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressAnim = useRef(new Animated.Value(0)).current;

    const FOCUS_TIME = 25 * 60;
    const BREAK_TIME = 5 * 60;

    useEffect(() => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const todaySessions = pomodoroSessions.filter(s => s.date === today && s.completed);
        setSessionsCompleted(todaySessions.length);
    }, [pomodoroSessions]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleSessionComplete();
                        return sessionType === 'focus' ? FOCUS_TIME : BREAK_TIME;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, sessionType]);

    useEffect(() => {
        const totalTime = sessionType === 'focus' ? FOCUS_TIME : BREAK_TIME;
        const progress = 1 - (timeLeft / totalTime);

        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [timeLeft, sessionType]);

    const handleSessionComplete = async () => {
        setIsRunning(false);

        if (sessionType === 'focus') {
            await addPomodoroSession({
                date: format(new Date(), 'yyyy-MM-dd'),
                duration: 25,
                type: 'focus',
                completed: true,
                startTime: format(new Date(), 'HH:mm'),
            });
            setSessionsCompleted(prev => prev + 1);
            setSessionType('break');
        } else {
            setSessionType('focus');
        }
    };

    const handlePlayPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(sessionType === 'focus' ? FOCUS_TIME : BREAK_TIME);
        progressAnim.setValue(0);
    };

    const handleSwitchMode = (type: 'focus' | 'break') => {
        setIsRunning(false);
        setSessionType(type);
        setTimeLeft(type === 'focus' ? FOCUS_TIME : BREAK_TIME);
        progressAnim.setValue(0);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const circumference = CIRCLE_SIZE * Math.PI;
    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pomodoro Timer</Text>
                <View style={styles.sessionBadge}>
                    <Zap size={16} color={Colors.light.primary} />
                    <Text style={styles.sessionText}>{sessionsCompleted} sessions today</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Mode Switcher */}
                <View style={styles.modeSwitcher}>
                    <TouchableOpacity
                        style={[styles.modeButton, sessionType === 'focus' && styles.modeButtonActive]}
                        onPress={() => handleSwitchMode('focus')}
                    >
                        <Zap size={20} color={sessionType === 'focus' ? 'white' : Colors.light.primary} />
                        <Text style={[styles.modeText, sessionType === 'focus' && styles.modeTextActive]}>
                            Focus
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, sessionType === 'break' && styles.modeButtonActive]}
                        onPress={() => handleSwitchMode('break')}
                    >
                        <Coffee size={20} color={sessionType === 'break' ? 'white' : Colors.light.primary} />
                        <Text style={[styles.modeText, sessionType === 'break' && styles.modeTextActive]}>
                            Break
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Timer Circle */}
                <View style={styles.timerContainer}>
                    <View style={styles.circleContainer}>
                        <Animated.View
                            style={[
                                styles.progressCircle,
                                {
                                    transform: [{ rotate: '-90deg' }],
                                },
                            ]}
                        >
                            <Animated.View
                                style={{
                                    width: CIRCLE_SIZE,
                                    height: CIRCLE_SIZE,
                                    borderRadius: CIRCLE_SIZE / 2,
                                    borderWidth: 12,
                                    borderColor: sessionType === 'focus' ? Colors.light.primary : Colors.light.success,
                                    borderStyle: 'solid',
                                    borderTopColor: 'transparent',
                                    borderRightColor: 'transparent',
                                    transform: [
                                        {
                                            rotate: strokeDashoffset.interpolate({
                                                inputRange: [0, circumference],
                                                outputRange: ['0deg', '360deg'],
                                            }),
                                        },
                                    ],
                                }}
                            />
                        </Animated.View>
                        <View style={styles.timerContent}>
                            <Text style={styles.timerText}>
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </Text>
                            <Text style={styles.timerLabel}>
                                {sessionType === 'focus' ? 'Stay Focused' : 'Take a Break'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <RotateCcw size={24} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                        {isRunning ? (
                            <Pause size={32} color="white" />
                        ) : (
                            <Play size={32} color="white" style={{ marginLeft: 4 }} />
                        )}
                    </TouchableOpacity>
                    <View style={styles.resetButton} />
                </View>

                {/* Stats */}
                <Card style={styles.statsCard}>
                    <View style={styles.statRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{sessionsCompleted}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{sessionsCompleted * 25}m</Text>
                            <Text style={styles.statLabel}>Focus Time</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{Math.floor(sessionsCompleted / 4)}</Text>
                            <Text style={styles.statLabel}>Cycles</Text>
                        </View>
                    </View>
                </Card>

                {/* Tips */}
                <Card style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>💡 Pomodoro Tips</Text>
                    <Text style={styles.tipsText}>
                        • Work for 25 minutes without distractions{'\n'}
                        • Take a 5-minute break after each session{'\n'}
                        • After 4 sessions, take a longer 15-30 minute break
                    </Text>
                </Card>
            </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    sessionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.primary + '20',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    sessionText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    modeSwitcher: {
        flexDirection: 'row',
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        padding: 4,
        marginBottom: 32,
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    modeButtonActive: {
        backgroundColor: Colors.light.primary,
    },
    modeText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    modeTextActive: {
        color: 'white',
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    circleContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    progressCircle: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
    },
    timerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: Colors.light.text,
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        fontSize: 18,
        color: Colors.light.textSecondary,
        marginTop: 8,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    resetButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.light.card,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsCard: {
        padding: 20,
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.light.border,
    },
    tipsCard: {
        padding: 20,
        backgroundColor: Colors.light.primary + '10',
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 12,
    },
    tipsText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        lineHeight: 22,
    },
});
