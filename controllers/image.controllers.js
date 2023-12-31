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
      const getImage = await prisma.image.findMany({
        orderBy: {
          id: "asc",
        },
      });

      res.status(200).json({
        status: true,
        message: "Success",
        err: null,
        data: getImage,
      });
    } catch (err) {
      next(err);
    }
  },
  getImageById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const getImageById = await prisma.image.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!getImageById) {
        return res.status(404).json({
          status: false,
          message: "Bad Request",
          err: "Id not found",
          data: null,
        });
      }

      res.status(200).json({
        status: true,
        message: "Success",
        err: null,
        data: getImageById,
      });
    } catch (err) {
      next(err);
    }
  },
  updateImage: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, deskripsi } = req.body;

      const getImageById = await prisma.image.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!getImageById) {
        return res.status(404).json({
          status: false,
          message: "Bad Request",
          err: "Id not found",
          data: null,
        });
      }

      // If title or deskripsi is not provided, use the existing data
      const newTitle = title || getImageById.title;
      const newDeskripsi = deskripsi || getImageById.deskripsi;

      // Handle profile image securely
      const file = req.file;
      if (!file) {
        const updateImage = await prisma.image.update({
          where: {
            id: parseInt(id),
          },
          data: {
            title: newTitle,
            deskripsi: newDeskripsi,
          },
        });

        return res.status(200).json({
          status: true,
          message: "Success",
          err: null,
          data: updateImage,
        });
      }

      // Delete existing image from imagekit
      const deleteImageKit = await imagekit.deleteFile(
        getImageById.imagekit_id
      );

      const { url, fileId } = await imagekit.upload({
        fileName: Date.now() + path.extname(file.originalname),
        file: file.buffer,
      });

        // Update existing image
      const updateImage = await prisma.image.update({
        where: {
          id: parseInt(id),
        },
        data: {
          title: newTitle,
          deskripsi: newDeskripsi,
          imagekit_id: fileId,
          url: url,
        },
      });

      res.status(200).json({
        status: true,
        message: "Success",
        err: null,
        data: updateImage,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteImage: async (req, res, next) => {
    try {
      const { id } = req.params;

      const getImageById = await prisma.image.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      // If image not found
      if (!getImageById) {
        return res.status(404).json({
          status: false,
          message: "Bad Request",
          err: "Id not found",
          data: null,
        });
      }

      // Delete existing image from database
      const deleteImage = await prisma.image.delete({
        where: {
          id: parseInt(id),
        },
      });

      // Delete existing image from imagekit
      const deleteImageKit = await imagekit.deleteFile(
        getImageById.imagekit_id
      );

      res.status(200).json({
        status: true,
        message: "Delete Success",
        err: null,
        data: deleteImage,
      });
    } catch (err) {
      next(err);
    }
  },
};
