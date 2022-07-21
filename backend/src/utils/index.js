// const Datauri = require("datauri");
const path = require("path");

// const cloudinary = require("../config/cloudinary");

// function uploader(req) {
//   return new Promise((resolve, reject) => {
//     const dUri = new Datauri();
//     let image = dUri.format(
//       path.extname(req.file.originalname).toString(),
//       req.file.buffer
//     );

//     cloudinary.uploader.upload(image.content, (err, url) => {
//       if (err) return reject(err);
//       return resolve(url);
//     });
//   });
// }

function validId(id) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  }

  return false;
}

module.exports = { uploader, validId };
