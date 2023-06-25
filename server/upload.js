const express = require('express');
const router = express.Router();
require("dotenv").config();
const { pinImage, pinMetadata } = require("./functions");
const multer = require('multer');

// To get the file through memory using multer.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware for file upload
const uploadMiddleware = upload.single('image');

// Route handler
const uploadIpfsHandler = async function (req, res) {
  uploadMiddleware(req, res, async function (error) {
    if (error) {
      console.log(error);
      return res.status(500).send('File upload failed.');
    }

    const { buffer, originalname } = req.file;
    const { name, description, attributes } = req.body;

    try {
      const img_hash = await pinImage(buffer, originalname);
      console.log({ img_hash });
      const metaHash = await pinMetadata(name, description, `ipfs://${img_hash}`, attributes);
      res.send({ metaHash });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error occurred during processing.');
    }
  });
};

// Route configuration
router.post('/upload-ipfs', uploadIpfsHandler);

module.exports = router;
