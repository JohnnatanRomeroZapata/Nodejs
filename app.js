const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const adminRoutes = require("./routes/adminRouter");
const shopRoutes = require("./routes/shopRouter");
const pageNotFoundController = require("./controllers/pageNotFoundController");

/*
  bodyParser.urlencoded

  Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. 
  This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings.

  A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). 
  This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
*/
app.use(bodyParser.urlencoded({ extended: false }));

/*
  express.static: o serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.

  path.join(): Join several segments into one path
*/
app.use(express.static(path.join(__dirname, "public")));

////////// ENGINE //////////
app.set("view engine", "ejs"); //what engine to use
app.set("views", "views"); //where to find the engine

////////// ROUTES //////////
app.use("/admin", adminRoutes);
app.use(shopRoutes);

////////// PAGE NOT FOUND //////////
app.use(pageNotFoundController.getPageNotFound);

////////// SET UP PORT TO LISTEN THE APP //////////
app.listen(3000); //listen(): Binds and listens for connections on the specified host and port
