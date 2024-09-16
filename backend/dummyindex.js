import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

// Obtain the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imdir = "images/";

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("file");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static(__dirname + "/images"));
console.log(__dirname + "/images");

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});

app.get("/", async (req, res) => {
  try {
    const jsonData = JSON.parse(await readFile("articlejson.json"));

    // Iterate through the JSON data and provide image URLs
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const nestedObject = jsonData[key];
        let id = String(nestedObject.article_id);
        let path = `/images/0${id.slice(0, 2)}/0${id}.jpg`;
        console.log(path);
        // Add the image URL to the "img" attribute
        nestedObject.img = path;
      }
    }

    // Set the appropriate content type header
    res.setHeader("Content-Type", "application/json");

    // Send the JSON data with the added image URLs
    res.json(jsonData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading JSON file or images.");
  }
});
