require("dotenv").config();

const express = require("express"),
  app = express(),
  nunjucks = require("nunjucks"),
  mongoose = require("mongoose"),
  Link = require("./models/link"),
  shortid = require("shortid"),
  url = require("url");

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database connected");
  }
);

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

nunjucks.configure("views", {
  express: app,
  watch: true,
  noCache: true,
});

app.set("view engine", "html");

// Routes

// Basic route that has a form and sends and url as a post request
app.get("/", (req, res) => {
  return res.render("pages/index.html");
});

// Creates an id for the link
// Creates a Link in the database
// Renders index.html and will display the link we just created
app.post("/", (req, res) => {
  const linkId = shortid.generate();
  const linkURL = req.body.url;
  console.log(req.body, linkURL);

  Link.create({
    id: linkId,
    url: linkURL,
  })
    .then((newLink) => {
      console.log(newLink);
      const newURL =
        url.format({
          protocol: req.protocol,
          host: req.get("host"),
        }) +
        "/" +
        newLink.id;
      console.log(newURL);
      // {{ protocol }}{{ host }}/{{ newLink.id }} =>
      // http://localhost:3000/huiuih
      return res.render("pages/index.html", {
        url: newURL,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// Gets the Link from the database based on linkid
// Redirects the user to the url provided
app.get("/:linkid", (req, res) => {
  const { linkid } = req.params;
  Link.findOne({ id: linkid })
    .then((link) => {
      if (!link) return;
      console.log(link);
      return res.redirect(link.url);
    })
    .catch((error) => {
      console.log(error);
    });
});

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || "localhost";

app.listen(PORT, IP, () => {
  console.log("Server started on port", PORT);
});
