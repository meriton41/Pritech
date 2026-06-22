import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskForm } from '../components/TaskForm';
import { useTasks } from '../context/TaskContext';
import { RootStackParamList } from '../navigation/types';
import { TaskFormValues } from '../types/task';
import { colors } from '../theme/colors';
import { hasValidationErrors, validateTaskForm } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const INITIAL_VALUES: TaskFormValues = {
  title: '',
  description: '',
};

export function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTasks();
  const [values, setValues] = useState<TaskFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState(validateTaskForm(INITIAL_VALUES));

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

    const task = addTask(values);
    navigation.replace('TaskDetail', { taskId: task.id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TaskForm values={values} errors={errors} onChange={handleChange} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Task</Text>
        </Pressable>
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
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
