const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.get('/video', (req, res) => {
  const filePath = path.join(__dirname, 'video.mp4');
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // If the request includes a range header, parse the start and end bytes
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // Set the headers for the partial content response
    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    };

    // Send the partial content response
    res.writeHead(206, headers);
    file.pipe(res);
  } else {
    // If the request does not include a range header, send the entire file
    const headers = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    };

    // Send the entire file
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});