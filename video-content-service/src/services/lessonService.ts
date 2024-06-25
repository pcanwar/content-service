import LessonRepository from '../repositories/lessonRepository';
import CourseRepository from '../../../course-service/src/repositories/courseRepository';
import { v4 as uuidv4 } from 'uuid';

import Lesson from '../models/lesson';

class LessonService {
  private lessonRepository: LessonRepository;
  private courseRepository: CourseRepository; 
  
  constructor(lessonRepository: LessonRepository, courseRepository: CourseRepository) {
    this.lessonRepository = lessonRepository;
    this.courseRepository = courseRepository;
  }

  async createLesson(lessonDetails: Omit<Lesson, 'lessonId'>): Promise<void> {

    if (!lessonDetails.courseId || !lessonDetails.title || !lessonDetails.videoLink) {
      throw new Error('Missing required fields: courseId, title, videoLink');
    }
    if (lessonDetails.title.length > 200000) {
      throw new Error('Title too long');
    }
    const course = await this.courseRepository.getCourse(lessonDetails.courseId);
    if (!course) {
      throw new Error('Cannot add lesson to a non-existent course');
    }
    const existingLessons = await this.lessonRepository.getLessonsByCourseId(lessonDetails.courseId);
    const isTitleExist = existingLessons.some(lesson => lesson.title === lessonDetails.title);
    if (isTitleExist) {
      throw new Error('This title already exists in the course');
    }

    const lessonId = uuidv4(); 
    const newLesson = { ...lessonDetails, lessonId };

    try {
      await this.lessonRepository.addLesson(newLesson);
    } catch (error) {
      console.error("Failed to add the lesson", error);
      throw new Error("Failed to add the lesson");
    }
  }

  async getLesson(courseId: string, lessonId: string): Promise<Lesson | null> {
    try {
      return await this.lessonRepository.getLesson(courseId, lessonId);
  } catch (error) {
      console.error("Failed to get lesson", error);
      throw new Error("Failed to get lesson");
  }  
}

  async updateLesson(courseId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> {
    try {
      await this.lessonRepository.updateLesson(courseId, lessonId, updates);
    } catch (error) {
        console.error("Failed to update lesson", error);
        throw new Error("Failed to update lesson");
    }
  }

  async deleteLesson(courseId: string, lessonId: string): Promise<void> {
    try {
      await this.lessonRepository.deleteLesson(courseId, lessonId);
  } catch (error) {
      console.error("Failed to delete lesson", error);
      throw new Error("Failed to delete lesson");
    }
  }

  async listLessonsForCourse(courseId: string): Promise<Lesson[]> {
    try {
        return await this.lessonRepository.listLessonsForCourse(courseId);
    } catch (error) {
        console.error("Failed to list lessons ", error);
        throw new Error("Failed to list lessons");
    }
}



}

export default LessonService;
