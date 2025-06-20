import express from 'express';
import dotenv from 'dotenv';
const app = express();
const port = 3000;
dotenv.config();
app.get('/', (req, res) => {
  res.send('Hello!');
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
