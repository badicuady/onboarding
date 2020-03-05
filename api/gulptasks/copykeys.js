const { src, dest } = require("gulp");

function copyKeyFiles(cb) {
  return src("./src/config/keys/*.key").pipe(dest("./dist/config/keys/"));
}

exports.copyKeyFiles = copyKeyFiles;
