import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Check, Trash2, X, Search } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Shared/Card';
import { Button } from '../../components/Shared/Button';
import { useApp } from '../../contexts/AppContext';
import { HABIT_CATEGORIES } from '../../constants/sampleData';

export default function HabitsScreen() {
    const { habits, toggleHabit, addHabit, deleteHabit } = useApp();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newHabit, setNewHabit] = useState({
        name: '',
        icon: '⭐',
        color: '#FF6B6B',
        category: 'health' as const,
        description: '',
    });

    const filteredHabits = habits.filter(habit => {
        const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || habit.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddHabit = async () => {
        if (newHabit.name.trim() === '') return;

        await addHabit(newHabit);
        setNewHabit({
            name: '',
            icon: '⭐',
            color: '#FF6B6B',
            category: 'health',
            description: '',
        });
        setModalVisible(false);
    };

    const completedToday = habits.filter(h => h.completedToday).length;
    const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Your Habits</Text>
                    <Text style={styles.subtitle}>{completedToday}/{habits.length} completed today • {completionRate}%</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Plus color="white" size={24} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color={Colors.light.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search habits..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={Colors.light.textSecondary}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={20} color={Colors.light.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContent}
            >
                <TouchableOpacity
                    style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
                        All
                    </Text>
                </TouchableOpacity>
                {HABIT_CATEGORIES.map(category => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryChip,
                            selectedCategory === category.id && styles.categoryChipActive
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Text style={styles.categoryIcon}>{category.icon}</Text>
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category.id && styles.categoryTextActive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredHabits.map((habit) => (
                    <Card key={habit.id} style={styles.habitCard}>
                        <View style={[styles.habitIconContainer, { backgroundColor: habit.color + '20' }]}>
                            <Text style={styles.habitIcon}>{habit.icon}</Text>
                        </View>
                        <View style={styles.habitInfo}>
                            <Text style={styles.habitName}>{habit.name}</Text>
                            <Text style={styles.habitStreak}>🔥 {habit.streak} day streak</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.checkButton, habit.completedToday && styles.checkedButton]}
                                onPress={() => toggleHabit(habit.id)}
                            >
                                <Check color={habit.completedToday ? 'white' : Colors.light.primary} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteHabit(habit.id)}>
                                <Trash2 color={Colors.light.error} size={20} />
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}

                {filteredHabits.length === 0 && (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>
                            {searchQuery || selectedCategory
                                ? 'No habits found matching your filters'
                                : 'No habits yet. Tap + to add your first habit!'}
                        </Text>
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
                            <Text style={styles.modalTitle}>Add New Habit</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color={Colors.light.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Habit Name (e.g. Morning Workout)"
                            value={newHabit.name}
                            onChangeText={(text) => setNewHabit({ ...newHabit, name: text })}
                            autoFocus
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Description (optional)"
                            value={newHabit.description}
                            onChangeText={(text) => setNewHabit({ ...newHabit, description: text })}
                            multiline
                        />

                        <Text style={styles.inputLabel}>Select Category</Text>
                        <View style={styles.categoryGrid}>
                            {HABIT_CATEGORIES.map(category => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryOption,
                                        newHabit.category === category.id && styles.categoryOptionActive,
                                        { borderColor: category.color }
                                    ]}
                                    onPress={() => setNewHabit({
                                        ...newHabit,
                                        category: category.id as any,
                                        color: category.color
                                    })}
                                >
                                    <Text style={styles.categoryOptionIcon}>{category.icon}</Text>
                                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.inputLabel}>Choose Icon</Text>
                        <View style={styles.iconGrid}>
                            {['⭐', '🏋️', '📚', '🧘', '💧', '🥗', '✍️', '🎯', '🚶', '💻', '🤸', '📞'].map(icon => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[
                                        styles.iconOption,
                                        newHabit.icon === icon && styles.iconOptionActive
                                    ]}
                                    onPress={() => setNewHabit({ ...newHabit, icon })}
                                >
                                    <Text style={styles.iconOptionText}>{icon}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Button title="Create Habit" onPress={handleAddHabit} />
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
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.card,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
    },
    categoryScroll: {
        maxHeight: 50,
    },
    categoryContent: {
        paddingHorizontal: 20,
        gap: 8,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.light.card,
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: Colors.light.primary,
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
    },
    categoryTextActive: {
        color: 'white',
    },
    scrollContent: {
        padding: 20,
    },
    habitCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
    },
    habitIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    habitIcon: {
        fontSize: 28,
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    habitStreak: {
        fontSize: 14,
        color: Colors.light.textSecondary,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
    },
    deleteButton: {
        padding: 8,
    },
    emptyCard: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
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
        maxHeight: '90%',
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
        marginTop: 8,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    categoryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: 'white',
    },
    categoryOptionActive: {
        backgroundColor: '#F0F9FF',
        borderWidth: 2,
    },
    categoryOptionIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    categoryOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
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
