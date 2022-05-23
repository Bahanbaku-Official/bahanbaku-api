const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./src/docs/api.json");

require("dotenv").config();

const app = express();

app.get("/", (_, res) => {
  res.json({
    message: "Welcome to the base endpoint",
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Running in port ${PORT}`);
});
