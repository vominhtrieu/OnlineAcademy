const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.uploadImage = (file, cb) => {
  let uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'images',
    },
    function (err, result) {
      cb(err, result);
    }
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
};

exports.uploadVideo = (file, cb) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'videos',
      timeout: 1000000,
    },
    function (err, result) {
      cb(err, result);
    }
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
};
