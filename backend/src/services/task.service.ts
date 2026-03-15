import { prisma } from '../config/db.js';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export const TaskStatus = {
  TODO: 'TODO' as const,
  IN_PROGRESS: 'IN_PROGRESS' as const,
  COMPLETED: 'COMPLETED' as const,
};

type TaskQuery = {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  search?: string;
};
export const createTask = async (userId: string, title: string, description?: string) => {
  return await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
};

export const getTasks = async (
  userId: string,
  params: TaskQuery
) => {
  const { page = 1, limit = 10, status, search } = params;
  const skip = (page - 1) * limit;

  const where: any = {
    userId,
  };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTaskById = async (userId: string, taskId: string) => {
  return await prisma.task.findFirst({
    where: { id: taskId, userId },
  });
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: { title?: string; description?: string; status?: TaskStatus }
) => {
  return await prisma.task.updateMany({
    where: { id: taskId, userId },
    data,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  return await prisma.task.deleteMany({
    where: { id: taskId, userId },
  });
};

export const toggleTaskStatus = async (userId: string, taskId: string) => {
  const task = await getTaskById(userId, taskId);
  if (!task) throw new Error('Task not found');

  const newStatus = task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;

  return await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
};
