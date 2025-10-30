let ejs = require("ejs");

function renderFunct(file, object) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(`views/${file}`, object, function (err, htmlFile) {
      if (err) reject(err);
      else {
        resolve(htmlFile);
      }
    });
  });
}

module.exports = renderFunct;
