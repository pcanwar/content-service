import { Request, Response } from 'express';
import LessonService from '../services/lessonService';
import LessonRepository from '../repositories/lessonRepository';
import { DynamoDB } from "aws-sdk";
import Lesson from '../models/lesson';
import CourseRepository from '../../../course-service/src/repositories/courseRepository';

const dynamoDbClient = new DynamoDB.DocumentClient();
const lessonTableName = process.env.LESSONS_TABLE_NAME || "DefaultLessonTableName";
const courseTableName = process.env.COURSES_TABLE_NAME || "DefaultCourseTableName"; 

const lessonRepository = new LessonRepository(dynamoDbClient, lessonTableName);
const courseRepository = new CourseRepository(dynamoDbClient, courseTableName); 

const lessonService = new LessonService(lessonRepository, courseRepository);

export class LessonController {
    async addLesson(req: Request, res: Response) {
        try {
            const lesson: Lesson = req.body;
            await lessonService.createLesson(lesson);
            res.status(201).send({ message: 'Successfully added a lesson' });
        } catch (error) {
            res.status(400).send({ error: error instanceof Error ? error.message : "Error adding lesson" });
        }
    }

    async getLesson(req: Request, res: Response) {
        const { courseId, lessonId } = req.params;
        try {
            const lesson = await lessonService.getLesson(courseId, lessonId);
            if (lesson) {
                res.json(lesson); // send json obj
            } else {
                res.status(404).send({ message: 'Lesson not found' });
            }
        } catch (error) {
            res.status(500).send({ error: error instanceof Error ? error.message : "Error retrieving lesson" });
        }
    }

    async updateLesson(req: Request, res: Response) {
        const { courseId, lessonId } = req.params;
        const updates = req.body;
        try {
            await lessonService.updateLesson(courseId, lessonId, updates);
            res.send({ message: 'Lesson updated successfully' });
        } catch (error) {
            res.status(500).send({ error: 'Failed to update the lesson' });
        }
    }

    async deleteLesson(req: Request, res: Response) {
        const { courseId, lessonId } = req.params;
        try {
            await lessonService.deleteLesson(courseId, lessonId);
            res.send({ message: 'Lesson deleted successfully' });
        } catch (error) {
            res.status(500).send({ error: 'Failed to delete the lesson' });
        }
    }

    async listLessonsForCourse(req: Request, res: Response) {
        try {
            const { courseId } = req.params;
            const lessons = await lessonService.listLessonsForCourse(courseId);
            res.json(lessons);
            // if (lessons) {
            //     res.json(lessons); 
            // }else {
            //     res.status(404).send({ message: 'Lessons not found' });
            // }
        } catch (error) {
            res.status(500).send({ error: error instanceof Error ? error.message : "Error listing lessons for course" });
        }
    }
}

export default LessonController;
