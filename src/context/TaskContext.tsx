import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchQuote, fetchSeedTasks, Quote } from '../services/api';
import { hasSeededTasks, loadTasks, markTasksSeeded, saveTasks } from '../services/storage';
import { StatusFilter, Task, TaskFormValues } from '../types/task';

interface TaskContextValue {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  quote: Quote | null;
  searchQuery: string;
  statusFilter: StatusFilter;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  addTask: (values: TaskFormValues) => Task;
  updateTask: (id: string, values: TaskFormValues) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

function createTask(values: TaskFormValues): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: values.title.trim(),
    description: values.description.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        const [storedTasks, seeded] = await Promise.all([loadTasks(), hasSeededTasks()]);
        let nextTasks = storedTasks;

        if (!seeded && storedTasks.length === 0) {
          nextTasks = await fetchSeedTasks();
          await markTasksSeeded();
        }

        if (isMounted) {
          setTasks(nextTasks);
          await saveTasks(nextTasks);
        }

        const fetchedQuote = await fetchQuote();
        if (isMounted) {
          setQuote(fetchedQuote);
        }
      } catch {
        if (isMounted) {
          setQuote({
            content: 'Small steps every day lead to big results.',
            author: 'Unknown',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistTasks = useCallback(async (nextTasks: Task[]) => {
    setTasks(nextTasks);
    await saveTasks(nextTasks);
  }, []);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = query.length === 0 || task.title.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  const addTask = useCallback(
    (values: TaskFormValues) => {
      const task = createTask(values);
      void persistTasks([task, ...tasks]);
      return task;
    },
    [persistTasks, tasks],
  );

  const updateTask = useCallback(
    (id: string, values: TaskFormValues) => {
      const nextTasks = tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: values.title.trim(),
              description: values.description.trim(),
            }
          : task,
      );
      void persistTasks(nextTasks);
    },
    [persistTasks, tasks],
  );

  const toggleTaskStatus = useCallback(
    (id: string) => {
      const nextTasks = tasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const nextStatus: Task['status'] = task.status === 'completed' ? 'pending' : 'completed';
        return { ...task, status: nextStatus };
      });
      void persistTasks(nextTasks);
    },
    [persistTasks, tasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      void persistTasks(tasks.filter((task) => task.id !== id));
    },
    [persistTasks, tasks],
  );

  const getTaskById = useCallback((id: string) => tasks.find((task) => task.id === id), [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      loading,
      quote,
      searchQuery,
      statusFilter,
      setSearchQuery,
      setStatusFilter,
      addTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      getTaskById,
    }),
    [
      tasks,
      filteredTasks,
      loading,
      quote,
      searchQuery,
      statusFilter,
      addTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      getTaskById,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  return context;
}
