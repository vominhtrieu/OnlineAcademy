const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.destroy = cloudinary.uploader.destroy;

exports.uploadImage = (file, cb) => {
  if (!file.buffer) cb(new Error('File không tồn tại'));
  let uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'images',
    },
    cb
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
};

exports.uploadVideo = (file, cb) => {
  //Check file is exceed 100MB
  if (file.buffer.length > 104857600)
    return cb(new Error('Kích thước file không đươc vượt quá 100MB, bạn nên chia nhỏ ra thành các video con'));
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: 'video',
      folder: 'videos',
      timeout: 1000000,
    },
    function (err, result) {
      cb(err, result);
    }
  );

  streamifier.createReadStream(file.buffer).pipe(uploadStream);
};
