import express from 'express';
import cors from 'cors';
import services from "./services.js";

services.connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/colab', (req, res) => {
    res.json({ message: 'colab calls will go here' });
});
