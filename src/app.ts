import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes';

const app = express();

app.use(cors(config.cors));
app.use(express.json({ limit: config.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.bodyLimit }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('adskip backend is running!');
});

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
