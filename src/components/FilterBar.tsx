import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusFilter } from '../types/task';
import { colors } from '../theme/colors';

interface FilterBarProps {
  value: StatusFilter;
  onChange: (filter: StatusFilter) => void;
}

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = value === filter.value;

        return (
          <Pressable
            key={filter.value}
            onPress={() => onChange(filter.value)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
