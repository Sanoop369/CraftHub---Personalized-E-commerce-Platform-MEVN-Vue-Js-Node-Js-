const express = require("express");
const app = express();
var cors = require('cors')
const bodyParser = require('body-parser');



// Increase payload size limit (e.g., 50MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()) 
const dbConfig = require("./db");

const usersRoute = require("./routes/userRoute");
const catRoute = require("./routes/categoryRoute");
const prodRoute = require("./routes/productRoute");
const adminRoute = require("./routes/adminRoute");
const reviewsRoute = require("./routes/reviewRoute");
const addresRoute = require("./routes/addressRoute");
const ratingsRoute = require("./routes/ratingRoute");
const ordersRoute = require("./routes/orderRoute");
const cartRoute = require("./routes/cartRoute");



app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/categories", catRoute);
app.use("/api/products", prodRoute);
app.use("/api/admins", adminRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/addres", addresRoute);
app.use("/api/ratings", ratingsRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/cart", cartRoute);



const port = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Node app listening on ${port} port!`));
