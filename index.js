const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./src/docs/api.json");
const { Datastore } = require("@google-cloud/datastore");
const errorHandler = require('./src/helpers/errorHandler');

require("dotenv").config();

const user = require('./src/routes/user.route');
const recipe = require('./src/routes/recipe.route');
const supplier = require('./src/routes/supplier.route');
const ingredient = require('./src/routes/ingredient.route');

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.DATASTORE_DEV_API_KEY,
});

const app = express();

app.get("/", (_, res) => {
  res.json({
    message: "Welcome to the base endpoint",
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(cors());

app.use('/user', user);
app.use('/recipe', recipe);
app.use('/supplier', supplier);
app.use('/ingredients', ingredient);

app.use(errorHandler)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Running in port ${PORT}`);
});
