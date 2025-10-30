import React from 'react';
import { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onEditTask }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Task Name</th>
              <th scope="col" className="px-6 py-3">Assigned To</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Created At</th>
              <th scope="col" className="px-6 py-3">Time Elapsed</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer" onClick={() => onEditTask(task)}>
                <td className="px-6 py-4 font-medium text-white">{task.name}</td>
                <td className="px-6 py-4">{task.assignedTo}</td>
                <td className="px-6 py-4">{task.status}</td>
                <td className="px-6 py-4">{new Date(task.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-mono">{new Date(task.elapsedTime * 1000).toISOString().substr(11, 8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {tasks.length === 0 && <p className="text-center text-slate-500 py-10">No tasks found.</p>}
    </div>
  );
};

export default Tasks;
