const util = require("util");
const Multer = require("multer");

let processFileDocs = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `src/public/docs/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
  })
}).single("file");
let processFileMiddleware = util.promisify(processFileDocs);

module.exports = processFileMiddleware;