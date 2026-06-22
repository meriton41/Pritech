import { Task } from '../types/task';

interface PlaceholderTodo {
  id: number;
  title: string;
  completed: boolean;
}

interface QuotableResponse {
  content: string;
  author: string;
}

export interface Quote {
  content: string;
  author: string;
}

const PLACEHOLDER_TODOS_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';
const QUOTE_URL = 'https://api.quotable.io/random';

export async function fetchSeedTasks(): Promise<Task[]> {
  const response = await fetch(PLACEHOLDER_TODOS_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch seed tasks');
  }

  const todos = (await response.json()) as PlaceholderTodo[];

  return todos.map((todo) => ({
    id: `seed-${todo.id}`,
    title: todo.title.charAt(0).toUpperCase() + todo.title.slice(1),
    description: 'Imported from JSONPlaceholder API',
    status: todo.completed ? 'completed' : 'pending',
    createdAt: new Date().toISOString(),
  }));
}

export async function fetchQuote(): Promise<Quote> {
  const response = await fetch(QUOTE_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch quote');
  }

  const data = (await response.json()) as QuotableResponse;

  return {
    content: data.content,
    author: data.author,
  };
}
