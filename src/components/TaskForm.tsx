import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TaskFormErrors, TaskFormValues } from '../types/task';
import { colors } from '../theme/colors';

interface TaskFormProps {
  values: TaskFormValues;
  errors: TaskFormErrors;
  onChange: (field: keyof TaskFormValues, value: string) => void;
}

export function TaskForm({ values, errors, onChange }: TaskFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          value={values.title}
          onChangeText={(text) => onChange('title', text)}
          placeholder="Enter task title"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, errors.title ? styles.inputError : null]}
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={values.description}
          onChangeText={(text) => onChange('description', text)}
          placeholder="Enter task description"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, styles.textArea, errors.description ? styles.inputError : null]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 110,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
});
