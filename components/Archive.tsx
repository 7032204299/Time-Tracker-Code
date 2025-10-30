import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { USERS } from '../constants';

interface ArchiveProps {
  tasks: Task[];
  onDeleteTasks: (taskIds: string[]) => void;
}

const Archive: React.FC<ArchiveProps> = ({ tasks, onDeleteTasks }) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState('All Users');

  const filteredTasks = useMemo(() => {
    if (selectedUser === 'All Users') {
      return tasks;
    }
    const user = USERS.find(u => u.name === selectedUser);
    return user ? tasks.filter(task => task.assignedTo === user.email) : tasks;
  }, [tasks, selectedUser]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTasks(filteredTasks.map(t => t.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    if (e.target.checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} task(s)? This action cannot be undone.`)) {
        onDeleteTasks(selectedTasks);
        setSelectedTasks([]);
    }
  };

  const handleDeleteOne = (taskId: string) => {
    if (window.confirm(`Are you sure you want to delete this task? This action cannot be undone.`)) {
        onDeleteTasks([taskId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-slate-400">Filter by User:</label>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="ml-2 bg-slate-700 border border-slate-600 rounded-md p-2"
          >
            <option>All Users</option>
            {USERS.map(u => <option key={u.id}>{u.name}</option>)}
          </select>
        </div>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTasks.length === 0}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:bg-red-800/50 disabled:cursor-not-allowed transition-all"
        >
          Delete Selected ({selectedTasks.length})
        </button>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-4">
        {filteredTasks.length > 0 ? (
          <ul className="space-y-3">
            <li className="p-3 rounded-md flex justify-between items-center border-b border-slate-700">
                <div className="flex items-center gap-4 w-2/3">
                    <input 
                        type="checkbox" 
                        onChange={handleSelectAll} 
                        checked={filteredTasks.length > 0 && selectedTasks.length === filteredTasks.length}
                        className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-600 focus:ring-cyan-500"
                    />
                    <p className="font-semibold text-slate-200">Task</p>
                </div>
                <span className="text-sm font-medium text-slate-400">Status</span>
            </li>
            {filteredTasks.map(task => (
              <li key={task.id} className="bg-slate-900/50 p-3 rounded-md flex justify-between items-center hover:bg-slate-900 transition-colors">
                <div className="flex items-center gap-4 w-2/3">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={(e) => handleSelectOne(e, task.id)}
                    className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-600 focus:ring-cyan-500"
                  />
                  <div>
                    <p className="font-semibold text-slate-200">{task.name}</p>
                    <p className="text-xs text-slate-400">Completed on {new Date(task.completedAt || task.createdAt).toLocaleDateString()} by {task.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-green-400">{task.status}</span>
                    <button onClick={() => handleDeleteOne(task.id)} className="text-slate-500 hover:text-red-500 transition-colors" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 py-10">No archived tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Archive;
