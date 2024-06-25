import express from 'express';
import lessonRoutes from './routes/lessonRoutes';

const app = express();
app.use(express.json()); 

// test if needed
// app.get('/', (req, res) => {
//     res.send('Welcome to the processing');
// });


// http://localhost:3000/api/lessons
app.use('/api', lessonRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Liesten on port ${PORT}`));
