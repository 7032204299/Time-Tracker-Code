import React from 'react';
import { Task } from '../types';
import { USERS } from '../constants';

interface ArchiveProps {
  tasks: Task[];
}

const Archive: React.FC<ArchiveProps> = ({ tasks }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-4">
        <div>
          <label className="text-sm text-slate-400">Filter by User:</label>
          <select className="ml-2 bg-slate-700 border border-slate-600 rounded-md p-2">
            <option>All Users</option>
            {USERS.map(u => <option key={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-4">
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map(task => (
              <li key={task.id} className="bg-slate-900/50 p-3 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-200">{task.name}</p>
                  <p className="text-xs text-slate-400">Completed on {new Date(task.completedAt || task.createdAt).toLocaleDateString()} by {task.assignedTo}</p>
                </div>
                <span className="text-sm font-medium text-green-400">{task.status}</span>
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
