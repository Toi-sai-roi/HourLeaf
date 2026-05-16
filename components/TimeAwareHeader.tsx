import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTimeVibe } from '../hooks/useTimeVibe';
import { Spacing } from '../constants/Colors';

export const TimeAwareHeader = () => {
    const { vibe } = useTimeVibe();
    return (
        <View style={s.container}>
            <Text style={[s.vibePhrase, { color: vibe.textColor }]}>
                {vibe.vibePhrase}
            </Text>
        </View>
    );
};

const s = StyleSheet.create({
    container: { marginTop: Spacing.md, marginBottom: Spacing.lg },

    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    timeText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
    vibePhrase: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', lineHeight: 28 },

    badge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' }
});