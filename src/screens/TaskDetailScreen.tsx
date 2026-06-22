import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskForm } from '../components/TaskForm';
import { useTasks } from '../context/TaskContext';
import { RootStackParamList } from '../navigation/types';
import { TaskFormValues } from '../types/task';
import { colors } from '../theme/colors';
import { hasValidationErrors, validateTaskForm } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TaskDetailScreen({ navigation, route }: Props) {
  const { taskId } = route.params;
  const { getTaskById, updateTask, toggleTaskStatus, deleteTask } = useTasks();
  const task = getTaskById(taskId);

  const initialValues = useMemo<TaskFormValues>(
    () => ({
      title: task?.title ?? '',
      description: task?.description ?? '',
    }),
    [task],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [errors, setErrors] = useState(validateTaskForm(initialValues));

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.notFoundTitle}>Task not found</Text>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'completed';

  const handleChange = (field: keyof TaskFormValues, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(validateTaskForm(nextValues));
  };

  const handleSave = () => {
    const nextErrors = validateTaskForm(values);

    if (hasValidationErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    updateTask(task.id, values);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.metaCard}>
          <View style={[styles.statusBadge, isCompleted ? styles.completedBadge : styles.pendingBadge]}>
            <Text style={[styles.statusText, isCompleted ? styles.completedText : styles.pendingText]}>
              {isCompleted ? 'Completed' : 'Pending'}
            </Text>
          </View>
          <Text style={styles.metaLabel}>Created</Text>
          <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
        </View>

        {isEditing ? (
          <TaskForm values={values} errors={errors} onChange={handleChange} />
        ) : (
          <View style={styles.detailsCard}>
            <Text style={styles.detailLabel}>Title</Text>
            <Text style={styles.detailTitle}>{task.title}</Text>

            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailDescription}>
              {task.description || 'No description provided.'}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {isEditing ? (
          <View style={styles.footerRow}>
            <Pressable
              style={[styles.footerButton, styles.secondaryButton]}
              onPress={() => {
                setValues(initialValues);
                setErrors(validateTaskForm(initialValues));
                setIsEditing(false);
              }}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.footerButton, styles.primaryButton]} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Save</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.footerRow}>
            <Pressable
              style={[styles.footerButton, styles.secondaryButton]}
              onPress={() => toggleTaskStatus(task.id)}
            >
              <Text style={styles.secondaryButtonText}>
                {isCompleted ? 'Mark Pending' : 'Mark Completed'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.footerButton, styles.primaryButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.primaryButtonText}>Edit</Text>
            </Pressable>
          </View>
        )}

        {!isEditing ? (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  completedBadge: {
    backgroundColor: colors.successLight,
  },
  pendingBadge: {
    backgroundColor: colors.pendingLight,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  completedText: {
    color: colors.success,
  },
  pendingText: {
    color: colors.pending,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metaValue: {
    fontSize: 15,
    color: colors.text,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 10,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
