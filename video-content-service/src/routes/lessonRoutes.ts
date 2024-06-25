import { Router } from 'express';
import { LessonController } from '../controllers/lessonController';

const router = Router();
const lessonController = new LessonController();

// Lesson
router.post('/lessons', lessonController.addLesson);
router.get('/lessons/:courseId/:lessonId', lessonController.getLesson);
router.get('/lessons/:courseId', lessonController.listLessonsForCourse);
router.put('/lessons/:courseId/:lessonId', lessonController.updateLesson);
router.delete('/lessons/:courseId/:lessonId', lessonController.deleteLesson);

export default router;
