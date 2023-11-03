require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const imageRoutes = require('./routes/image.routes');
app.use('/api/v1', imageRoutes);


// 404 error handling
app.use((req, res, next) => {
    res.status(404).json({
      status: false,
      message: "Not Found",
      data: null,
    });
  });
  
  // 500 error handling
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      data: err.message,
    });
  });

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));