const Router = require('express').Router();
const {createImage, getImage, getImageById, updateImage, deleteImage} = require('../controllers/image.controllers');
const {image} = require('../libs/multer');

Router.post('/image', image.single('image'), createImage);
Router.get('/image', getImage);
Router.get('/image/:id', getImageById);
Router.put('/image/:id', image.single('image'), updateImage);
Router.delete('/image/:id', deleteImage);

module.exports = Router;