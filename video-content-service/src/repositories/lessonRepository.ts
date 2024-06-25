import { DynamoDB } from "aws-sdk";
import Lesson from "../models/lesson";
import { ILessonRepository } from "../interfaces/ILessonRepository";

class LessonRepository implements ILessonRepository {
    private db: DynamoDB.DocumentClient;
    private tableName: string;

    constructor(dynamoDbClient: DynamoDB.DocumentClient, tableName?: string) {
        this.db = dynamoDbClient;
        this.tableName = tableName || "DefaultLessonTableName";
    }

    async addLesson(lesson: Lesson): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: lesson,
        };
        try {
            await this.db.put(params).promise();
        } catch (error) {
            console.error("Error adding lesson:", error);
            throw new Error("Failed to add lesson");
        }
    }

    async getLesson(courseId: string, lessonId: string): Promise<Lesson | null> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :pk AND SK = :sk',
            ExpressionAttributeValues: {
                ':pk': `COURSE#${courseId}`,
                ':sk': `LESSON#${lessonId}`,
            },
        };
        try {
            const data = await this.db.query(params).promise();
            console.log(`Get lesson successfully: ${lessonId}`);
            return data.Items && data.Items.length > 0 ? (data.Items[0] as Lesson) : null;
        } catch (error) {
            console.error("Error getting lesson:", error);
            throw new Error("Failed to getting lesson");
        }
    }

    async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
        const params = {
          TableName: this.tableName,
          KeyConditionExpression: 'PK = :pk',
          ExpressionAttributeValues: {
            ':pk': `COURSE#${courseId}`,
          },
        };
        const data = await this.db.query(params).promise();
        return data.Items as Lesson[];
      }

    async updateLesson(courseId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> {
        try {
            const updateExpression = "set " + Object.keys(updates).map(key => `#${key} = :${key}`).join(", ");
            const expressionAttributeNames = Object.keys(updates).reduce((acc, key) => ({
                ...acc, [`#${key}`]: key
            }), {});
        
            const expressionAttributeValues = (Object.keys(updates) as (keyof Lesson)[]).reduce((acc, key) => ({
                ...acc, [`:${key}`]: updates[key]
            }), {});
        
            const params = {
                TableName: this.tableName,
                Key: {
                    PK: `COURSE#${courseId}`,
                    SK: `LESSON#${lessonId}`,
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: "UPDATED_NEW",
            };
            
            await this.db.update(params).promise();
        } catch (error) {
            //  debuggin error
            console.error("Failed to update lesson:", error);
            throw new Error("Error updating lesson: " + (error instanceof Error ? error.message : String(error)));
        }
    }

    async deleteLesson(courseId: string, lessonId: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                PK: `COURSE#${courseId}`,
                SK: `LESSON#${lessonId}`,
            },
        };
    
        await this.db.delete(params).promise();
    }

    async listLessonsForCourse(courseId: string): Promise<Lesson[]> {
        return this.getLessonsByCourseId(courseId);
    }
    
    async searchLessons(courseId: string, searchText: string): Promise<Lesson[]> {
        const params = {
            TableName: this.tableName,
            FilterExpression: "contains (title, :searchText) or contains (description, :searchText)",
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ":searchText": searchText,
                ":pk": `COURSE#${courseId}`,
            },
        };
    
        try {
            const data = await this.db.query(params).promise(); 
            // Using query instead of scan if filtering by PK
            return data.Items as Lesson[];
        } catch (error) {
            console.error("Error searching lessons:", error);
            throw new Error("Failed to search lessons");
        }
    }
    
    

} 



export default LessonRepository;

