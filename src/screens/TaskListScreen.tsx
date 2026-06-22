import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { QuoteBanner } from '../components/QuoteBanner';
import { SearchBar } from '../components/SearchBar';
import { TaskItem } from '../components/TaskItem';
import { useTasks } from '../context/TaskContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskList'>;

export function TaskListScreen({ navigation }: Props) {
  const {
    filteredTasks,
    loading,
    quote,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    toggleTaskStatus,
    deleteTask,
    tasks,
  } = useTasks();

  const hasTasks = tasks.length > 0;
  const hasFilteredResults = filteredTasks.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View>
                {quote ? <QuoteBanner quote={quote} /> : null}
                {hasTasks ? (
                  <>
                    <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
                    <FilterBar value={statusFilter} onChange={setStatusFilter} />
                  </>
                ) : null}
              </View>
            }
            ListEmptyComponent={
              hasTasks ? (
                <EmptyState
                  title="No matching tasks"
                  message="Try adjusting your search or filter to find what you need."
                />
              ) : (
                <EmptyState
                  title="No tasks yet"
                  message="Tap the + button to create your first task."
                />
              )
            }
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
                onToggle={() => toggleTaskStatus(item.id)}
                onDelete={() => deleteTask(item.id)}
              />
            )}
          />
        )}

        <Pressable
          style={styles.fab}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={styles.fabText}>+</Text>
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
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 96,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
  },
});
