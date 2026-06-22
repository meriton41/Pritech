import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';
import { colors } from '../theme/colors';

interface TaskItemProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function TaskItem({ task, onPress, onToggle, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Pressable
        onPress={onToggle}
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        hitSlop={8}
      >
        {isCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={1}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        <Text style={styles.date}>Created {formatDate(task.createdAt)}</Text>
      </View>

      <Pressable onPress={onDelete} style={styles.deleteButton} hitSlop={8}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
});
