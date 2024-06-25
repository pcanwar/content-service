
export default interface Lesson {
    
    courseId: string; // the id of the course
    lessonId: string; // the id of the  lesson
    title: string; // the title of the lesson   
    description : string | Array<string> | { [key: string]: string }; // the description of the lesson  
    contentURL?: Array<string> | { [key: string]: string }; // the URL of the content  
    videoLink: Array<string> | { [key:string]: string}; // the   URL of the video
    postedDate : string; // the date of
    updateDate : string; // the date of
}

// export default Lesson;

