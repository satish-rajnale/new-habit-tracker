import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CheckCircle2, Circle, Trash2, X, Clock, MapPin, Calendar } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Shared/Card';
import { Button } from '../../components/Shared/Button';
import { useApp } from '../../contexts/AppContext';
import { format } from 'date-fns';

export default function TodosScreen() {
    const { todos, toggleTodo, addTodo, deleteTodo } = useApp();
    const [modalVisible, setModalVisible] = useState(false);
    const [newTodo, setNewTodo] = useState({
        title: '',
        time: '',
        place: '',
        icon: '📝',
        date: format(new Date(), 'yyyy-MM-dd'),
        completed: false,
    });

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayTodos = todos.filter(t => t.date === today);
    const completedCount = todayTodos.filter(t => t.completed).length;
    const completionRate = todayTodos.length > 0 ? Math.round((completedCount / todayTodos.length) * 100) : 0;

    const handleAddTodo = async () => {
        if (newTodo.title.trim() === '') return;

        await addTodo(newTodo);
        setNewTodo({
            title: '',
            time: '',
            place: '',
            icon: '📝',
            date: today,
            completed: false,
        });
        setModalVisible(false);
    };

    const pendingTodos = todayTodos.filter(t => !t.completed);
    const completedTodos = todayTodos.filter(t => t.completed);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Today's Tasks</Text>
                    <Text style={styles.subtitle}>{completedCount}/{todayTodos.length} completed • {completionRate}%</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Plus color="white" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Progress Card */}
                <Card style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Daily Progress</Text>
                        <Text style={styles.progressPercentage}>{completionRate}%</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${completionRate}%` }]} />
                    </View>
                    <View style={styles.progressStats}>
                        <View style={styles.progressStat}>
                            <Text style={styles.progressStatValue}>{pendingTodos.length}</Text>
                            <Text style={styles.progressStatLabel}>Pending</Text>
                        </View>
                        <View style={styles.progressStat}>
                            <Text style={[styles.progressStatValue, { color: Colors.light.success }]}>{completedCount}</Text>
                            <Text style={styles.progressStatLabel}>Completed</Text>
                        </View>
                    </View>
                </Card>

                {/* Pending Tasks */}
                {pendingTodos.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Pending Tasks</Text>
                        {pendingTodos.map((todo) => (
                            <Card key={todo.id} style={styles.todoCard}>
                                <TouchableOpacity style={styles.todoPressable} onPress={() => toggleTodo(todo.id)}>
                                    <Text style={styles.todoIcon}>{todo.icon}</Text>
                                    <View style={styles.todoInfo}>
                                        <Text style={styles.todoTitle}>{todo.title}</Text>
                                        <View style={styles.todoMeta}>
                                            {todo.time && (
                                                <>
                                                    <Clock size={12} color={Colors.light.textSecondary} />
                                                    <Text style={styles.todoSub}> {todo.time}</Text>
                                                </>
                                            )}
                                            {todo.place && (
                                                <>
                                                    <Text style={styles.todoSub}>  •  </Text>
                                                    <MapPin size={12} color={Colors.light.textSecondary} />
                                                    <Text style={styles.todoSub}> {todo.place}</Text>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                    <View style={styles.checkbox}>
                                        <Circle size={24} color={Colors.light.primary} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTodo(todo.id)}>
                                    <Trash2 size={18} color={Colors.light.error} />
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </>
                )}

                {/* Completed Tasks */}
                {completedTodos.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Completed Tasks</Text>
                        {completedTodos.map((todo) => (
                            <Card key={todo.id} style={[styles.todoCard, styles.completedCard]}>
                                <TouchableOpacity style={styles.todoPressable} onPress={() => toggleTodo(todo.id)}>
                                    <Text style={styles.todoIcon}>{todo.icon}</Text>
                                    <View style={styles.todoInfo}>
                                        <Text style={[styles.todoTitle, styles.todoTitleCompleted]}>{todo.title}</Text>
                                        <View style={styles.todoMeta}>
                                            {todo.time && (
                                                <>
                                                    <Clock size={12} color={Colors.light.textSecondary} />
                                                    <Text style={styles.todoSub}> {todo.time}</Text>
                                                </>
                                            )}
                                            {todo.place && (
                                                <>
                                                    <Text style={styles.todoSub}>  •  </Text>
                                                    <MapPin size={12} color={Colors.light.textSecondary} />
                                                    <Text style={styles.todoSub}> {todo.place}</Text>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                    <View style={[styles.checkbox, styles.checked]}>
                                        <CheckCircle2 size={24} color="white" />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTodo(todo.id)}>
                                    <Trash2 size={18} color={Colors.light.error} />
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </>
                )}

                {todayTodos.length === 0 && (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyTitle}>No tasks for today</Text>
                        <Text style={styles.emptyText}>Tap the + button to add your first task</Text>
                    </Card>
                )}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add New Task</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color={Colors.light.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Task Title"
                            value={newTodo.title}
                            onChangeText={(text) => setNewTodo({ ...newTodo, title: text })}
                            autoFocus
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Time (e.g. 10:00 AM)"
                            value={newTodo.time}
                            onChangeText={(text) => setNewTodo({ ...newTodo, time: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Location"
                            value={newTodo.place}
                            onChangeText={(text) => setNewTodo({ ...newTodo, place: text })}
                        />

                        <Text style={styles.inputLabel}>Choose Icon</Text>
                        <View style={styles.iconGrid}>
                            {['📝', '💼', '🛒', '🏋️', '📚', '🍽️', '🚗', '✈️', '🏥', '🎯', '💡', '🎨'].map(icon => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.iconOption,
                                        newTodo.icon === icon && styles.iconOptionActive
                                    ]}
                                    onPress={() => setNewTodo({ ...newTodo, icon })}
                                >
                                    <Text style={styles.iconOptionText}>{icon}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Button title="Add Task" onPress={handleAddTodo} />
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
    subtitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    scrollContent: {
        padding: 20,
    },
    progressCard: {
        padding: 20,
        marginBottom: 24,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    progressPercentage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.light.primary,
        borderRadius: 4,
    },
    progressStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    progressStat: {
        alignItems: 'center',
    },
    progressStatValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    progressStatLabel: {
        fontSize: 12,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 12,
        marginTop: 8,
    },
    todoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    completedCard: {
        opacity: 0.7,
    },
    todoPressable: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoIcon: {
        fontSize: 32,
        marginRight: 16,
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
    todoTitleCompleted: {
        textDecorationLine: 'line-through',
        color: Colors.light.textSecondary,
    },
    todoMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoSub: {
        fontSize: 12,
        color: Colors.light.textSecondary,
    },
    checkbox: {
        marginRight: 8,
    },
    checked: {
        backgroundColor: Colors.light.success,
        borderRadius: 12,
        padding: 2,
    },
    deleteBtn: {
        padding: 8,
        marginLeft: 8,
    },
    emptyCard: {
        padding: 48,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        paddingBottom: 50,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 12,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    iconOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconOptionActive: {
        backgroundColor: Colors.light.primary + '20',
        borderWidth: 2,
        borderColor: Colors.light.primary,
    },
    iconOptionText: {
        fontSize: 28,
    },
});
