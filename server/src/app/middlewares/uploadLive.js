const util = require("util");
const Multer = require("multer");

let processFile = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `src/public/livestream/`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
  })
}).single("blobFile");
let processFileMiddleware = util.promisify(processFile);

module.exports = processFileMiddleware;