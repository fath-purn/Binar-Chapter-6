require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/', (req, res) => {
    res.json({
        status: true,
        message: 'Welcome to the image upload API'
    });
});

const imageRoutes = require('./routes/image.routes');
app.use('/api/v1', imageRoutes);


// 404 error handling
app.use((err, req, res, next) => {
    res.status(404).json({
      status: false,
      message: "Not Found",
      err: err.message,
      data: null,
    });
  });
  
  // 500 error handling
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      err: err.message,
      data: null,
    });
  });

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));