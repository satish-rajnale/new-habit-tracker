import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle | any;
    textStyle?: TextStyle | any;
    icon?: React.ReactNode;
}

export const Button = ({ title, onPress, variant = 'primary', style, textStyle, icon }: ButtonProps) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                isPrimary ? styles.primary : isOutline ? styles.outline : styles.secondary,
                style
            ]}
        >
            {icon && icon}
            <Text style={[
                styles.text,
                isPrimary ? styles.primaryText : isOutline ? styles.outlineText : styles.secondaryText,
                textStyle,
                icon ? { marginLeft: 8 } : {}
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: Colors.light.primary,
    },
    secondary: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.light.primary,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: 'white',
    },
    secondaryText: {
        color: Colors.light.text,
    },
    outlineText: {
        color: Colors.light.primary,
    },
});
