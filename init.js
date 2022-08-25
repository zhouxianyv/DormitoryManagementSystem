const fs = require('fs');
const path = require('path');
const foldersPath = [
  'www',
  'tempDir',
  'public/uploads/banner',
  'public/uploads/category',
  'public/wangeditor/html',
  'public/wangeditor/img'
];

function initFolder(folderPath = '') {
  var folders = folderPath.split('/');
  var targetPath = '';
  folders.forEach(item => {
    targetPath += item + '/';
    var targetStatus = fs.existsSync(path.join(__dirname, targetPath));
    if (!targetStatus) fs.mkdirSync(path.join(__dirname, targetPath));
  });
}

(() => {
  foldersPath.forEach(item => initFolder(item));
})();