import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes';

const app = express();

app.use(cors(config.cors));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Ad Detector Backend is running!');
});

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
