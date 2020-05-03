const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();
const BASE_URL = "/api";

// connect DB
connectDB();

// init Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("tiny"));

// API Endpoints/Define Routes
app.use(`${BASE_URL}/auth`, require("./routes/auth"));
app.use(`${BASE_URL}/users`, require("./routes/users"));
app.use(`${BASE_URL}/profile`, require("./routes/profile"));
app.use(`${BASE_URL}/post`, require("./routes/post"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));
