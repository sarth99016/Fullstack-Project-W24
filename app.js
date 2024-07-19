// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const xss = require("xss-clean"); // Importing xss-clean for preventing XSS attacks
const dotenv = require("dotenv"); // Importing dotenv for environment variable management
const fs = require("fs"); // Importing fs for file system operations
const https = require("https"); // Importing https for secure server operations
const path = require("path");
const multer = require("multer");
const { logger } = require("./server/logging");
const {
  endpointLoggingMiddleware,
  errorLoggingMiddleware,
  protectedRoutesMiddleware,
} = require("./server/middlewares");
const session = require("express-session");
const {
  renderAuthPage,
  performRegistration,
  performSignIn,
  signOut,
} = require("./server/routes/authentication");
const { renderAboutPage } = require("./server/routes/about");
const {
  renderHomePage,
  renderDisplayPage,
  renderManagePage,
  renderSearchPage,
  renderAddCarPage,
} = require("./server/routes/app/pages");
const {
  addCarEndpoint,
  deleteCarEndpoint,
  updateCarEndpoint,
} = require("./server/routes/app/endpoints");
const { uploadfile } = require("./server/fileUpload");

// Initialize Express application
const app = express();

// Environment setup from .env file
dotenv.config();

// General server setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// HTTPS configuration
const httpsOptions = {
  key: fs.readFileSync("key.pem"), // Read private key file
  cert: fs.readFileSync("certificate.pem"), // Read certificate file
};

// Middleware for preventing XSS attacks
app.use(xss());
const TEN_MINUTE = 10 * 60 * 1000;

app.use(
  session({
    secret: "SECRET_KEY",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: TEN_MINUTE, secure: true },
  })
);

// Custom middleware for logging requests and errors
app.use(endpointLoggingMiddleware);
app.use(errorLoggingMiddleware);
app.use(protectedRoutesMiddleware);

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //A
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    //A
    logger.error("Error connecting to MongoDB:", err.message);
  });

// Auth endpoints
app.get("/", renderAuthPage);
app.post("/register", performRegistration);
app.post("/login", performSignIn);
app.get("/logout", signOut);

// About endpoints
app.get("/about", renderAboutPage);

// Protected web pages
app.get("/app/home", renderHomePage);
app.get("/app/display", renderDisplayPage);
app.get("/app/manage", renderManagePage);
app.get("/app/search", renderSearchPage);
app.get("/app/addcar", renderAddCarPage);

// Protected API endpoints
app.post("/app/addcar", uploadfile.single("carImg"), addCarEndpoint);
app.post("/app/deletecar", deleteCarEndpoint);
app.post("/app/updatecar", uploadfile.single("carImg"), updateCarEndpoint);

// Create HTTPS server
https.createServer(httpsOptions, app).listen(port, () => {
  logger.info(
    `Server is running on https://localhost:${process.env.PORT || 3000}`
  );
});
