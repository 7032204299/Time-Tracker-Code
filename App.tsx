
import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Reports from './components/Reports';
import Archive from './components/Archive';
import Header from './components/Header';
import { User, Task, TaskStatus } from './types';
import { USERS } from './constants';
import NotificationComponent from './components/Notification';
import TaskDetailModal from './components/TaskDetailModal';

// Default to the admin user
const defaultUser: User = USERS[0];

const initialTasks: Task[] = [
  { id: 't1', name: 'Design new landing page', description: 'Create mockups and wireframes in Figma.', estimatedTime: 3600 * 2, elapsedTime: 1800, status: TaskStatus.STARTED, assignedTo: 'alex.kit@example.com', createdBy: 'admin@example.com', createdAt: Date.now() - 86400000, logs: [], notes: [], startedAt: Date.now() - 1800000, urlLink: 'https://www.figma.com/design' },
  { id: 't2', name: 'Develop login feature', description: 'Implement JWT authentication for the API.', estimatedTime: 3600 * 4, elapsedTime: 0, status: TaskStatus.NEW, assignedTo: 'jane.anderson@example.com', createdBy: 'admin@example.com', createdAt: Date.now() - 172800000, logs: [], notes: [] },
  { id: 't3', name: 'Client meeting preparation', description: 'Prepare slides for the Q3 review meeting.', estimatedTime: 3600, elapsedTime: 3600, status: TaskStatus.REVIEW, assignedTo: 'david.smith@example.com', createdBy: 'admin@example.com', createdAt: Date.now() - 259200000, logs: [], notes: [], startedAt: Date.now() - 260000000, completedAt: Date.now() - 259200000 },
  { id: 't4', name: 'Deploy staging server', description: 'Update the staging environment with the latest build.', estimatedTime: 1800, elapsedTime: 1800, status: TaskStatus.COMPLETED, assignedTo: 'admin@example.com', createdBy: 'admin@example.com', createdAt: Date.now() - 345600000, logs: [], notes: [{ timestamp: Date.now() - 345000000, user: 'admin@example.com', text: 'Approved.' }] },
];

export type Tab = 'dashboard' | 'tasks' | 'reports' | 'archive';

export const App: React.FC = () => {
  const [currentUser] = useState<User>(defaultUser);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  }, []);

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'elapsedTime' | 'status' | 'createdAt' | 'createdBy' | 'logs' | 'notes'>) => {
    const task: Task = {
        ...newTaskData,
        id: `task-${Date.now()}`,
        elapsedTime: 0,
        status: TaskStatus.NEW,
        createdBy: currentUser.email,
        createdAt: Date.now(),
        logs: [{
          timestamp: Date.now(),
          user: currentUser.email,
          change: 'Task created.'
        }],
        notes: [],
    };
    setTasks(prev => [...prev, task]);
    showNotification('Task created successfully!', 'success');
  };
  
  const handleEditTask = (taskToEdit: Task) => {
    setEditingTask(taskToEdit);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  const handleModalSubmit = (taskData: Omit<Task, 'id' | 'elapsedTime' | 'status' | 'createdAt' | 'createdBy' | 'logs' | 'notes'> | Task) => {
      if ('id' in taskData) {
          // Editing existing task
          handleUpdateTask(taskData);
          showNotification('Task updated successfully!', 'success');
      } else {
          // Creating new task
          handleCreateTask(taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
  };

  const handleDeleteTasks = (taskIds: string[]) => {
    setTasks(prevTasks => prevTasks.filter(task => !taskIds.includes(task.id)));
    showNotification(`${taskIds.length} task(s) deleted successfully!`, 'success');
  };

  const renderContent = () => {
    // The dashboard and tasks views get all tasks to provide a complete overview.
    // The archive is specifically for completed tasks.
    const archivedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED);

    switch (activeTab) {
      case 'dashboard':
        // Pass all tasks to the dashboard so users can see their full board, including completed items.
        return <Dashboard tasks={tasks} currentUser={currentUser} onUpdateTask={handleUpdateTask} onEditTask={handleEditTask} showNotification={showNotification} />;
      case 'tasks':
        return <Tasks tasks={tasks} onEditTask={handleEditTask} />;
      case 'reports':
        return <Reports tasks={tasks} />;
      case 'archive':
        // The archive view only shows tasks that are completed.
        return <Archive tasks={archivedTasks} onDeleteTasks={handleDeleteTasks} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
           <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-100 capitalize">{activeTab}</h1>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-all transform hover:scale-105"
            >
              + Create Task
            </button>
          </div>
          {renderContent()}
        </div>
      </main>
      
      {notification && <NotificationComponent message={notification.message} type={notification.type} />}

      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSubmit={handleModalSubmit}
        task={editingTask}
        currentUser={currentUser}
      />
    </div>
  );
};

export default App;
