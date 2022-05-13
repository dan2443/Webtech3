const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sitesRoutes = require("./routes/sites");
const Site = require("./models/site");
const multer = require("multer");
const { db } = require("./models/site");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static("public"));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array(
    "uploadedImages"
  )
);
app.use("/images", express.static("images"));

app.get("/", getSites, (req, res) => {
  res.render("index", { sites: res.sites });
});

app.get("/site/:siteId", getSite, (req, res) => {
  res.render("site", { site: res.siteData });
});

app.use("/sites", sitesRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/webtech3", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(8080, initDB()); //port is 8080
  })
  .catch((err) => console.log(err));

async function getSites(req, res, next) {
  try {
    res.sites = await Site.find();
  } catch (err) {
    return res.status(500).json({ message: "couldn't fetch sites" });
  }
  next();
}

async function getSite(req, res, next) {
  let siteData;
  try {
    siteData = await Site.findById(req.params.siteId);
    if (!siteData) {
      return res.status(404).json({ message: "site not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "couldn't fetch sites" });
  }
  res.siteData = siteData;
  next();
}

const initialData = [
  {
    title: "United States",
    content:
      "The United States of America (U.S.A. or USA), commonly known as the United States (U.S. or US) or America, is a country primarily located in North America. It consists of 50 states, a federal district, five major unincorporated territories, 326 Indian reservations, and nine minor outlying islands.[h] At nearly 3.8 million square miles (9.8 million square kilometers), it is the world's third- or fourth-largest country by geographic area.[c] The United States shares land borders with Canada to the north and Mexico to the south as well as maritime borders with the Bahamas, Cuba, Russia, and other countries.[i] With a population of more than 331 million people,[j] it is the third most populous country in the world. The national capital is Washington, D.C., and the most populous city and financial center is New York City.",
    imageUrls: ["images/us1.png", "images/us2.jpg"],
  },
  {
    title: "Argentina",
    content:
      "Argentina, officially the Argentine Republic[A] (Spanish: República Argentina), is a country in the southern half of South America. Argentina covers an area of 2,780,400 km2 (1,073,500 sq mi),[B] making it the largest Spanish-speaking nation in the world by area. It is the second-largest country in South America after Brazil, the fourth-largest country in the Americas, and the eighth-largest country in the world. It shares the bulk of the Southern Cone with Chile to the west, and is also bordered by Bolivia and Paraguay to the north, Brazil to the northeast, Uruguay and the South Atlantic Ocean to the east, and the Drake Passage to the south. Argentina is a federal state subdivided into twenty-three provinces, and one autonomous city, which is the federal capital and largest city of the nation, Buenos Aires. The provinces and the capital have their own constitutions, but exist under a federal system. Argentina claims sovereignty over a part of Antarctica, the Falkland Islands and South Georgia and the South Sandwich Islands.",
    imageUrls: ["images/argentina1.jpg", "images/argentina2.jpg"],
  },
  {
    title: "Australia",
    content:
      "Australia, officially the Commonwealth of Australia, is a sovereign country comprising the mainland of the Australian continent, the island of Tasmania, and numerous smaller islands.[13] With an area of 7,617,930 square kilometres (2,941,300 sq mi),[14] Australia is the largest country by area in Oceania and the world's sixth-largest country. Australia is the oldest,[15] flattest,[16] and driest inhabited continent,[17][18] with the least fertile soils.[19][20] It is a megadiverse country, and its size gives it a wide variety of landscapes and climates, with deserts in the centre, tropical rainforests in the north-east, and mountain ranges in the south-east.",
    imageUrls: ["images/australia1.jpg", "images/australia2.jpg"],
  },
  {
    title: "Japan",
    content:
      'Japan is an island country in East Asia. It is situated in the northwest Pacific Ocean, and is bordered on the west by the Sea of Japan, while extending from the Sea of Okhotsk in the north toward the East China Sea and Taiwan in the south. Japan is a part of the Ring of Fire, and spans an archipelago of 6852 islands covering 377,975 square kilometers (145,937 sq mi); the five main islands are Hokkaido, Honshu (the "mainland"), Shikoku, Kyushu, and Okinawa. Tokyo is the nation\'s capital and largest city; other major cities include Yokohama, Osaka, Nagoya, Sapporo, Fukuoka, Kobe, and Kyoto.',
    imageUrls: ["images/japan1.jpg", "images/japan2.jpg"],
  },
  {
    title: "Iceland",
    content:
      "Iceland is a Nordic island country in the North Atlantic Ocean and the most sparsely populated country in Europe.[e][13] Iceland's capital and largest city is Reykjavík, which (along with its surrounding areas) is home to over 65% of the population. Iceland is the only part of the Mid-Atlantic Ridge that rises above sea level, and its central volcanic plateau is erupting almost constantly.[14][15] The interior consists of a plateau characterised by sand and lava fields, mountains, and glaciers, and many glacial rivers flow to the sea through the lowlands. Iceland is warmed by the Gulf Stream and has a temperate climate, despite a high latitude just outside the Arctic Circle. Its high latitude and marine influence keep summers chilly, and most of its islands have a polar climate.",
    imageUrls: ["images/iceland1.jpg", "images/iceland2.jpg"],
  },
];

async function initDB(req, res, next) {
  await db.collection("sites").deleteMany({});
  initialData.forEach((data) => {
    let site = new Site({
      title: data.title,
      content: data.content,
      imageUrls: data.imageUrls,
    });
    site.save();
  });
}
