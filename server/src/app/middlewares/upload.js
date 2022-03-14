const util = require("util");
const Multer = require("multer");

let processFile = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `src/public/video/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
  })
}).single("file");
let processFileMiddleware = util.promisify(processFile);

module.exports = processFileMiddleware;