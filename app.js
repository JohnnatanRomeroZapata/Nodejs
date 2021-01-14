const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

/// ROUTES SECTION ///
const adminRoutes = require("./routes/adminRouter");
const shopRoutes = require("./routes/shopRouter");

/// PAGE NOT FOUND SECTION ///
const pageNotFoundController = require("./controllers/pageNotFoundController");

/// SEQUELIZE SECTION ///
const sequelize = require("./util/database");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const Cart = require("./models/cartModel");
const CartItem = require("./models/cartItemModel");
const Order = require("./models/orderModel");
const OrderItem = require("./models/orderItemModel");

////////// OTHERS //////////

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

app.use(async (req, res, next) => {
  try {
    const theUser = await User.findByPk(1);
    req.user = theUser; //here req.user becomes a sequelize object with the values registered in the db and all the utilities methods sequelize adds
    next();
  } catch (err) {
    console.error(err);
  }
});

////////// ENGINE //////////
app.set("view engine", "ejs"); //what engine to use
app.set("views", "views"); //where to find the engine

////////// ROUTES //////////
app.use("/admin", adminRoutes);
app.use(shopRoutes);

////////// PAGE NOT FOUND //////////
app.use(pageNotFoundController.getPageNotFound);

////////// SEQUELIZE --> CREATING TABLES //////////

/*
  A.belongsTo(B) association means that a One-To-One relationship exists between A and B,
  with the foreign key being defined in the source model (A).
*/
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

/*
  A.hasMany(B) association means that a One-To-Many relationship exists between A and B,
  with the foreign key being defined in the target model (B).
*/
User.hasMany(Product);

/*
  A.hasOne(B) association means that a One-To-One relationship exists between A and B, 
  with the foreign key being defined in the target model (B)
*/
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

/*
  The A.belongsToMany(B, { through: 'C' }) association means that a Many-To-Many relationship exists 
  between A and B, using table C as junction table, which will have the foreign keys 
  (aId and bId, for example). Sequelize will automatically create this model C 
  (unless it already exists) and define the appropriate foreign keys on it.
*/
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User); // A.belongsTo(B) --> foreign key being defined in the source model (A).
User.hasMany(Order); // A.hasMany(B) --> foreign key being defined in the target model (B)
Order.belongsToMany(Product, { through: OrderItem }); // A.belongsToMany(B, { through: 'C' }) --> C as junction table, which will have the foreign keys (aId and bId, for example)

(async () => {
  try {
    //await sequelize.sync({ force: true }); //User.sync() --> creates the table if it doesn't exist (and does nothing if it already exists)
    await sequelize.sync(); //User.sync() --> creates the table if it doesn't exist (and does nothing if it already exists)

    let user = await User.findByPk(1);

    if (!user) {
      user = await User.create({ name: "Johnnatan", email: "test@test.com" });
    }

    await user.createCart();
  } catch (err) {
    console.error(err);
  }
})();

////////// SET UP PORT TO LISTEN THE APP //////////
app.listen(3000); //listen(): Binds and listens for connections on the specified host and port
