import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASKS_KEY = '@pritech/tasks';
const SEEDED_KEY = '@pritech/seeded';

export async function loadTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(TASKS_KEY);

  if (!raw) {
    return [];
  }

  return JSON.parse(raw) as Task[];
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function hasSeededTasks(): Promise<boolean> {
  const value = await AsyncStorage.getItem(SEEDED_KEY);
  return value === 'true';
}

export async function markTasksSeeded(): Promise<void> {
  await AsyncStorage.setItem(SEEDED_KEY, 'true');
}
