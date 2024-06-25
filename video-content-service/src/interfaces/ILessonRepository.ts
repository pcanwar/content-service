import Lesson from "../models/lesson";

export interface ILessonRepository {
    addLesson(lesson: Lesson): Promise<void>;
    // addLesson(courseId: string, lessonDetails: Omit<Lesson, 'lessonId'>): Promise<void> ;
    getLesson(courseId: string, lessonId: string): Promise<Lesson | null>;
    updateLesson(courseId: string, lessonId: string, updates: Partial<Lesson>): Promise<void>;
    deleteLesson(courseId: string, lessonId: string): Promise<void>;
    getLessonsByCourseId(courseId: string): Promise<Lesson[]>;
}
