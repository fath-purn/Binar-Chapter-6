const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const imagekit = require("../libs/imagekit");

module.exports = {
  createImage: async (req, res, next) => {
    try {
      const { title, deskripsi } = req.body;

      if (!title || !deskripsi) {
        res.status(400).json({
          status: false,
          message: "Bad Request",
          err: "title and deskripsi required",
          data: null,
        });
      }

      // Handle profile image securely
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          status: false,
          message: "Bad Request",
          err: "Profile image is required",
          data: null,
        });
      }
      const { url, fileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(file.originalname),
        file: file.buffer,
      });

      const createImage = await prisma.image.create({
        data: {
          title,
          deskripsi,
          imagekit_id: fileId,
          url: url,
        },
      });

      res.status(201).json({
        status: true,
        message: "Success",
        err: null,
        data: createImage,
      });
    } catch (err) {
      next(err);
    }
  },
  getImage: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
  getImageById: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
  updateImage: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
  deleteImage: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
};
