import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path, { resolve } from "path";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { read, readFileSync } from "fs";
import Fuse from "fuse.js";
import ColorThief from "colorthief";

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
app.use(express.json());
// Use body-parser middleware to parse incoming requests
app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static(path.join(__dirname, "images"))); // Serve static images

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

// Data for cards on home page
app.get("/", async (req, res) => {
  try {
    const jsonData = JSON.parse(
      await readFile(path.join(__dirname, "articles_sample.json"))
    );

    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const nestedObject = jsonData[key];
        let id = String(nestedObject.article_id);
        let path = `/0${id.slice(0, 2)}/0${id}.jpg`;

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

// Data for carousel on homepage
app.get("/homepage", async (req, res) => {
  try {
    const mostBrought = JSON.parse(
      await readFile(path.join(__dirname, "most_bought_articles.json"))
    );
    res.setHeader("Content-Type", "application/json");
    res.json(mostBrought);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading JSON file or images.");
  }
});

app.post("/search", (req, res) => {
  const query_string = req.body.query;
  try {

    const jsonData = readFileSync('articles.json', "utf8");
    const data = JSON.parse(jsonData);
    let results = searchStringonJSON(query_string, data);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  }
  catch (err) {
        if (err.code === "ENOENT") {
          console.error("File not found or path is incorrect.");
        } else {
          console.error("Error reading the file:", err);
        }
  }
});

app.post("/fetch", (req, res) => {
  let index_code;
  let garment_group_no;
  let obj;
  let id;
  obj = req.body;
  index_code = obj.index_code;
  garment_group_no = obj.garment_group_no;
  id = String(obj.article_id);
  let fpath = `./items/${index_code}/${garment_group_no}/${index_code}_${garment_group_no}.json`;

  try {
    const jsonData = readFileSync(fpath, "utf8");
    const data = JSON.parse(jsonData);
    let finalData = compareAndReturn(obj, data);
    res.setHeader("Content-Type", "application/json");
    res.json(finalData);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("File not found or path is incorrect.");
    } else {
      console.error("Error reading the file:", err);
    }
  }
});



app.post('/getDominantColor', (req, res) => {
  let id = req.body.article_id;
  let path = __dirname + `/images/0${id.slice(0, 2)}/0${id}.jpg`;
  let obj = {};
  let img;
  try {
    img = resolve(process.cwd(), path);
  }
  catch (err) {
    const sand = {
      'color1': null,
      'color2' : null
    }

    res.json(sand);
  }

    ColorThief.getPalette(img, 3).then((colorArr) => {
      let idx = 1;
      colorArr.map((item) => {
        if (item[0] < 215 && item[1] < 215 && item[2] < 215) {
          let color = rgbToHex(item[0], item[1], item[2]);
          let token = "color" + String(idx);
          obj[token] = color;
          idx++;
        }
      });

      res.setHeader("Content-Type", "application/json");
      res.json(obj);
      
    });
});


//!SECTION : Functions
//NOTE - Functions needed for code
function compareAndReturn(obj, jsonData) {
  const options = {
    keys: [
      "index_code",
      "product_type_name",
      "product_group_name",
      "graphical_appearance_name",
      "colour_group_name",
      "department_name",
      "section_name",
    ],
    threshold: 0.99,
  };


  const query = {
   'index_code' : obj.index_code,
    "product_type_name" : obj.product_type_name,
    "product_group_name" : obj.product_group_name,
    "graphical_appearance_name" :obj.graphical_appearance_name,
    "colour_group_name" : obj.colour_group_name,
    "department_name" : obj.department_name,
    "section_name" : obj.section_name
  }

  const fuse = new Fuse(jsonData, options);
  const results = fuse.search(query);
  const limitedResults = results.length > 20 ? results.slice(0, 20) : results;
  for (let key in limitedResults) {
    const nestedObject = limitedResults[key];
    let id = String(nestedObject.item.article_id);
    let path = `http://localhost:8000/0${id.slice(0, 2)}/0${id}.jpg`;
    nestedObject.item.imgpath = path;
  }
  return limitedResults;
}

const rgbToHex = (red, green, blue) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
};


function searchStringonJSON(query_string, jsonData) {
  const options = {
    keys: [
      "index_code",
      "product_type_name",
      "product_group_name",
      "graphical_appearance_name",
      "colour_group_name",
      "department_name",
      "section_name",
    ],
    threshold: 0.99,
    includeScore: true
  };

  const obj = {
      "index_code" : query_string,
      "product_type_name" : query_string,
      "product_group_name" : query_string,
      "graphical_appearance_name" : query_string,
      "colour_group_name" : query_string,
      "department_name" : query_string,
      "section_name" : query_string
  }

  const fuse = new Fuse(jsonData, options);
  const results = fuse.search(obj);
  const reversed = [...results];
  const limitedResults = reversed.length > 20 ? reversed.slice(0, 20) : reversed;
  for (let key in limitedResults) {
    const nestedObject = limitedResults[key];
    let id = String(nestedObject.item.article_id);
    let path = `http://localhost:8000/0${id.slice(0, 2)}/0${id}.jpg`;
    nestedObject.item.imgpath = path;
  }
  // return limitedResults;
  return reversed;
  // return results;
}

