import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import { colors } from '@/constants/colors';

interface Props {
    name: string;
    svgIcon: React.ComponentType<any>; // Đảm bảo svgIcon là một component
    screen?: string;
}

const FeatureItem: React.FC<Props> = ({ svgIcon: IconComponent, name, screen }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <IconComponent height={24} width={24} />
            <TextComponent text={name} numOfLine={2} styles={styles.name} color={colors.primary}/>
        </TouchableOpacity>
    );
};

export default FeatureItem;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 80,
        backgroundColor: colors.white,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        
    },
    name: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 6
    },
});