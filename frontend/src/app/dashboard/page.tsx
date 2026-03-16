'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api.service';
import { Task, TaskStatus, TaskFilters, ListTasksResponse } from '@/types/task';
import { toast } from 'react-hot-toast';
import {
  Plus, Search, Filter, LogOut, CheckCircle2, Circle,
  Clock, Trash2, Edit3, Loader2, Menu, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TaskModal from '@/components/tasks/TaskModal';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    search: '',
  });

  //  search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ListTasksResponse>('/tasks', { params: filters });
      setTasks(data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTaskStatus = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`);
      setTasks(prev => prev.map(t =>
        t.id === task.id ? { ...t, status: t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED' } : t
      ));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const deleteTask = (id: string) => {
    setTaskToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    toast.promise(api.delete(`/tasks/${taskToDelete}`), {
      loading: 'Deleting...',
      success: () => {
        setTasks(prev => prev.filter(t => t.id !== taskToDelete));
        setIsDeleteConfirmOpen(false);
        setTaskToDelete(null);
        return 'Deleted successfully';
      },
      error: 'Delete failed',
    });
  };

  const handleAddTask = async (data: any) => {
    toast.promise(api.post('/tasks', data), {
      loading: 'Creating...',
      success: (res: any) => {
        setTasks(prev => [res.data, ...prev]);
        setIsAddModalOpen(false);
        return 'Task created';
      },
      error: 'Creation failed',
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;
    
    toast.promise(api.patch(`/tasks/${editingTask.id}`, data), {
      loading: 'Updating...',
      success: (res: any) => {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? res.data : t));
        setIsEditModalOpen(false);
        setEditingTask(undefined);
        return 'Updated successfully';
      },
      error: 'Update failed',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 glass border-r border-slate-200 transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold gradient-text">TaskFlow</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-4">
            <button
              onClick={() => {
                setFilters({ ...filters, status: undefined });
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer",
                !filters.status ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "hover:bg-slate-100 text-slate-600"
              )}
            >
              <Menu size={20} />
              <span>All Tasks</span>
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'TODO' });
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer",
                filters.status === 'TODO' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "hover:bg-slate-100 text-slate-600"
              )}
            >
              <Circle size={20} />
              <span>To Do</span>
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'IN_PROGRESS' });
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer",
                filters.status === 'IN_PROGRESS' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "hover:bg-slate-100 text-slate-600"
              )}
            >
              <Clock size={20} />
              <span>In Progress</span>
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, status: 'COMPLETED' });
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer",
                filters.status === 'COMPLETED' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "hover:bg-slate-100 text-slate-600"
              )}
            >
              <CheckCircle2 size={20} />
              <span>Completed</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 lg:p-8 relative overflow-x-hidden">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 glass rounded-lg border border-slate-200"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="relative flex-1 max-w-md mx-4 lg:mx-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900"
            />
          </div>

          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl font-medium transition-all primary-glow cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Plus size={40} />
            </div>
            <p className="text-xl">No tasks found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-indigo-400 mt-2 hover:underline"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-start">
            <AnimatePresence mode='popLayout'>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass p-6 rounded-2xl border border-slate-100 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
                        task.status === 'COMPLETED'
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-indigo-500"
                      )}
                    >
                      {task.status === 'COMPLETED' && <CheckCircle2 size={16} />}
                    </button>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className={cn(
                    "text-xl font-semibold mb-2 transition-all",
                    task.status === 'COMPLETED' && "text-slate-400 line-through"
                  )}>
                    {task.title}
                  </h3>
                  <p className={cn(
                    "text-slate-500 text-sm mb-4 line-clamp-3",
                    task.status === 'COMPLETED' && "opacity-50"
                  )}>
                    {task.description || 'No description provided'}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs">
                      {task.status === 'TODO' && <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md border border-slate-200">To Do</span>}
                      {task.status === 'IN_PROGRESS' && <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md border border-amber-200">In Progress</span>}
                      {task.status === 'COMPLETED' && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-200">Completed</span>}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <TaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddTask}
          title="Create New Task"
        />

        <TaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(undefined);
          }}
          onSubmit={handleUpdateTask}
          task={editingTask}
          title="Edit Task"
        />

        <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your task.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
