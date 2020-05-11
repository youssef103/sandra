//const express = require("express");
import express from "express";
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/db");
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql/schema");

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

app.use(
  `${BASE_URL}/graphql`,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// API Endpoints/Define Routes
app.use(`${BASE_URL}/auth`, require("./routes/auth"));
app.use(`${BASE_URL}/users`, require("./routes/users"));
app.use(`${BASE_URL}/profile`, require("./routes/profile"));
app.use(`${BASE_URL}/post`, require("./routes/post"));

// Server static assets in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listen on port ${PORT}`));
