import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createTaskSchema,
  listTasksSchema,
  updateTaskSchema,
} from '../schemas/task.schema.js';

const router = Router();


router.use(authenticate);

router.post('/', validate(createTaskSchema), taskController.create);
router.get('/', validate(listTasksSchema), taskController.list);
router.get('/:id', taskController.get);
router.patch('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.remove);
router.patch('/:id/toggle', taskController.toggle);

export default router;
