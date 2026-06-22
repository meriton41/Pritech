import { TaskFormErrors, TaskFormValues } from '../types/task';

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {};
  const title = values.title.trim();

  if (!title) {
    errors.title = 'Title is required';
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `Title must be at least ${TITLE_MIN_LENGTH} characters`;
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be at most ${TITLE_MAX_LENGTH} characters`;
  }

  const description = values.description.trim();
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`;
  }

  return errors;
}

export function hasValidationErrors(errors: TaskFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
