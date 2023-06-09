const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const transcript = require("./transcript.js");

app.use(cors());

app.get("/video/:id/audio", (req, res) => {
  console.log("audio");
  const filePath = path.join(__dirname, "audio.webm");
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const chunksize = 1024 * 1024; // Set the chunk size to 1 MB

  if (range) {
    // If the request includes a range header, parse the start and end bytes
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // Set the headers for the partial content response
    const chunkSize = Math.min(chunksize, end - start + 1); // Use the smaller of chunksize and the remaining data to avoid exceeding the client's buffer limit
    const file = fs.createReadStream(filePath, { start, end });
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "audio/webm",
    };

    // Send the partial content response
    res.writeHead(206, headers);
    file.pipe(res);
  } else {
    // If the request does not include a range header, send the entire file
    const headers = {
      "Content-Length": fileSize,
      "Content-Type": "audio/webm",
    };

    // Send the entire file
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.get("/video/:id/subtitles", (req, res) => {
  const sub = transcript[1];
  res.json(sub);
});

app.get("/video/:id", (req, res) => {
  console.log("video");
  const filePath = path.join(__dirname, "video.mp4");
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const chunksize = 1024 * 1024; // Set the chunk size to 1 MB

  if (range) {
    // If the request includes a range header, parse the start and end bytes
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // Set the headers for the partial content response
    const chunkSize = Math.min(chunksize, end - start + 1); // Use the smaller of chunksize and the remaining data to avoid exceeding the client's buffer limit
    const file = fs.createReadStream(filePath, { start, end });
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    // Send the partial content response
    res.writeHead(206, headers);
    file.pipe(res);
  } else {
    // If the request does not include a range header, send the entire file
    const headers = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    // Send the entire file
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.get("/audio/:id/subtitles", (req, res) => {
  const sub = transcript[0];
  res.json(sub);
});

app.get("/audio/:id", (req, res) => {
  console.log("audio-new");
  const filePath = path.join(__dirname, "audio1.webm");
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  const chunksize = 1024 * 1024; // Set the chunk size to 1 MB

  if (range) {
    // If the request includes a range header, parse the start and end bytes
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // Set the headers for the partial content response
    const chunkSize = Math.min(chunksize, end - start + 1); // Use the smaller of chunksize and the remaining data to avoid exceeding the client's buffer limit
    const file = fs.createReadStream(filePath, { start, end });
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "audio/webm",
    };

    // Send the partial content response
    res.writeHead(206, headers);
    file.pipe(res);
  } else {
    // If the request does not include a range header, send the entire file
    const headers = {
      "Content-Length": fileSize,
      "Content-Type": "audio/webm",
    };

    // Send the entire file
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "Endpoint Success" });
});

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

module.exports = app;
