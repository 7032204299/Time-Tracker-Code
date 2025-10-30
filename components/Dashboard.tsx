import React from 'react';
import { User, Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface DashboardProps {
  currentUser: User;
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  showNotification: (message: string, type: 'success' | 'error') => void;
}

const KanbanColumn: React.FC<{ title: string; tasks: Task[]; children: React.ReactNode }> = ({ title, tasks, children }) => (
    <div className="bg-slate-800/50 rounded-lg p-4 flex-1">
        <h3 className="font-bold text-lg text-slate-300 mb-4 pb-2 border-b border-slate-700">{title} ({tasks.length})</h3>
        <div className="space-y-4 overflow-y-auto h-[calc(100vh-20rem)] pr-2">
            {children}
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ currentUser, tasks, onUpdateTask, onEditTask, showNotification }) => {
  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'New Task', status: TaskStatus.NEW },
    { title: 'Task Started', status: TaskStatus.STARTED },
    { title: 'Task Review', status: TaskStatus.REVIEW },
    { title: 'Completed', status: TaskStatus.COMPLETED },
  ];

  const userTasks = tasks.filter(task => task.assignedTo === currentUser.email || currentUser.role === 'ADMIN');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {columns.map(({ title, status }) => (
        <KanbanColumn key={status} title={title} tasks={userTasks.filter(t => t.status === status)}>
          {userTasks.filter(t => t.status === status).length > 0 ? (
            userTasks
              .filter(task => task.status === status)
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                  onEdit={onEditTask}
                  showNotification={showNotification}
                  currentUser={currentUser}
                />
              ))
          ) : (
            <div className="text-center text-slate-500 py-10">No tasks in this stage.</div>
          )}
        </KanbanColumn>
      ))}
    </div>
  );
};

export default Dashboard;
