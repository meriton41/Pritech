# PRITECH — React Native Task Manager

A simple React Native mobile app for managing personal tasks, built as part of the PRITECH technical assessment.

## Setup instructions

### Prerequisites

- Node.js 18+
- npm
- Expo Go app on a physical device, or Xcode (iOS) / Android Studio (Android) for simulators

### Installation

```bash
git clone https://github.com/meriton41/Pritech.git 
cd Pritech
npm install
```

### Run the app

```bash
npm start
```

Then:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go on your phone

Other scripts:

```bash
npm run ios
npm run android
npm run web
```

## What was implemented

### Core requirements

- **Task list screen** — shows all tasks with title, description preview, status, and created date
- **Add new task** — dedicated screen with title and description fields
- **Mark completed / pending** — toggle from the list or detail screen
- **Delete task** — from the list or detail screen (with confirmation on detail)
- **Task details view** — full task info with edit mode
- **Input validation** — title required (min 2 chars), description length limit
- **Clean UI** — simple card-based layout with consistent spacing and colors
- **Public API integration** — seeds initial tasks from [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) and displays a daily quote from [Quotable](https://api.quotable.io)

### Bonus features

- **Search** — filter tasks by title
- **Status filter** — All / Pending / Completed
- **Local storage** — tasks persisted with AsyncStorage
- **Navigation** — React Navigation stack between list, add, and detail screens

### Task fields

| Field       | Description                          |
|-------------|--------------------------------------|
| Title       | User-entered task title              |
| Description | Short task description               |
| Status      | `pending` or `completed`             |
| Created date| ISO timestamp when the task was made |

## Project structure

```
src/
  components/     Reusable UI (TaskItem, TaskForm, SearchBar, etc.)
  context/        Task state and persistence (TaskContext)
  navigation/     Stack navigator setup
  screens/        TaskList, AddTask, TaskDetail
  services/       API calls and AsyncStorage helpers
  theme/          Shared colors
  types/          TypeScript interfaces
  utils/          Form validation
```

## Tech stack

- React Native (Expo)
- TypeScript
- React Navigation
- AsyncStorage
- Functional components and hooks

## Screenshots

_Add screenshots or a screen recording here before submission._

## Notes

- On first launch, five sample tasks are imported from JSONPlaceholder if no local data exists.
- All user-created tasks are stored locally and survive app restarts.
- Internet is required on first launch for API seeding and the inspiration quote.
