require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const authentication = require('./middleware/authentication');

//error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/jobs');

// extra packages
app.use(express.json());

//routes
// app.get('/', (req, res) => {
//   res.send('jobs api');
// });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/job', authentication, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 7000;

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    console.log('db connected');
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
