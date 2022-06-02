const fs = require('fs');
const http = require('http');
const https = require('https');

function download(url, filePath) {
  const proto = !url.charAt(4).localeCompare('s') ? https : http;
  return new Promise((resolve, reject) => {
    let fileInfo = null;
    let ext = null;
    let file = null;
    const request = proto.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };
      ext = fileInfo.mime.split('/')[1];
      file = fs.createWriteStream(`public/${filePath}.${ext}`);
      response.pipe(file);
      file.on('finish', () => resolve(fileInfo));
      file.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });
    });
    request.on('error', err => {
      reject(err);
    });
    request.end();
  });
}

module.exports = download;
