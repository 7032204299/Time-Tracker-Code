import React, { useState, useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { USERS } from '../constants';

interface ReportsProps {
  tasks: Task[];
}

const formatTime = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const Reports: React.FC<ReportsProps> = ({ tasks }) => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (selectedUser !== 'all') {
      filtered = filtered.filter(task => task.assignedTo === selectedUser);
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case 'daily':
        filtered = filtered.filter(task => new Date(task.createdAt).toDateString() === now.toDateString());
        break;
      case 'weekly':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        filtered = filtered.filter(task => new Date(task.createdAt) >= lastWeek);
        break;
      case 'monthly':
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(task => new Date(task.createdAt) >= firstDayOfMonth);
        break;
      default:
        break;
    }
    return filtered;
  }, [tasks, selectedUser, dateRange]);

  const kpiData = useMemo(() => {
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(t => t.status === TaskStatus.COMPLETED);
    
    const totalCompletionTime = completedTasks.reduce((acc, task) => acc + task.elapsedTime, 0);
    const avgCompletionTime = completedTasks.length > 0 ? totalCompletionTime / completedTasks.length : 0;
    
    const onTimeTasks = completedTasks.filter(t => t.elapsedTime <= t.estimatedTime).length;
    const onTimePercentage = completedTasks.length > 0 ? (onTimeTasks / completedTasks.length) * 100 : 0;
    
    return {
        totalTasks,
        avgCompletionTime: formatTime(avgCompletionTime),
        onTimePercentage: `${onTimePercentage.toFixed(0)}%`
    };
  }, [filteredTasks]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col sm:flex-row flex-wrap items-center gap-4">
        <div className="w-full sm:w-auto">
          <label className="text-sm text-slate-400 mr-2">User:</label>
          <select 
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full sm:w-auto bg-slate-700 border border-slate-600 rounded-md p-2"
          >
            <option value="all">All Users</option>
            {USERS.map(u => <option key={u.id} value={u.email}>{u.name}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="text-sm text-slate-400 mr-2">Date Range:</label>
          <select 
             value={dateRange}
             onChange={e => setDateRange(e.target.value)}
             className="w-full sm:w-auto bg-slate-700 border border-slate-600 rounded-md p-2"
          >
            <option value="all">All Time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="flex-grow flex flex-col sm:flex-row sm:justify-end gap-2 w-full sm:w-auto">
           <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg">Export (PDF)</button>
           <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">Export (Excel)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <h4 className="text-slate-400 font-semibold">Total Tasks</h4>
            <p className="text-3xl font-bold text-cyan-400">{kpiData.totalTasks}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <h4 className="text-slate-400 font-semibold">Avg. Completion Time</h4>
            <p className="text-3xl font-bold text-cyan-400">{kpiData.avgCompletionTime}</p>
        </div>
         <div className="bg-slate-800/50 p-4 rounded-lg text-center">
            <h4 className="text-slate-400 font-semibold">On-Time Percentage</h4>
            <p className="text-3xl font-bold text-cyan-400">{kpiData.onTimePercentage}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">Task Completion (Pie Chart)</h3>
          <div className="flex items-center justify-center h-64 bg-slate-700/50 rounded-md text-slate-500">Graph Placeholder</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4">User Performance (Bar Chart)</h3>
          <div className="flex items-center justify-center h-64 bg-slate-700/50 rounded-md text-slate-500">Graph Placeholder</div>
        </div>
      </div>
    </div>
  );
};

export default Reports;