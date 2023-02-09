const express = require('express');
const app = express();
//Common things
const path = require('path');
const fs = require('fs');
//config
let r = (Math.random() + 1).toString(36).substring(2);
let filename;
const port = 80; //Port, defualt 80
const url = "http://example.com" //Your URL, use HTTPS for SSL cerificate
//Multer config
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'screenshots/');
  },
  filename: function (req, file, cb) {
    cb(null, r + ".png"); //file.originalname
    filename = r + ".png"
  }
});
const upload = multer({ storage: storage });

//Routes

//Hello world?
app.get("/", (req, res) => {
  res.send("Hello World!")
});
//Endpoint for uploading from ShareX
app.post('/screenshots', upload.array('screenshots', 10), (req, res) => {
  res.send(`${url}/get/${filename}`);
});

//Endpoint for receiving screenshots
  app.get('/get/:filename', (req, res) => {
    if(!req.params.filename) {
        res.send("No filename provided!")
        return;
    }

    const screenshotDir = path.join(__dirname, 'screenshots');

    let final = `${screenshotDir}/${filename}`;
  
    res.writeHead(200, {'Content-Type': 'image/png' });
    
        fs.readFile(final,
          function (err, content) {
              // Serving the image
              res.end(content);
          });
})
  //Port listener
app.listen(port, () => {
  console.log(`ShareX server listening at http://localhost:${port}`);
});
