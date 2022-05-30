const { Datastore } = require("@google-cloud/datastore");

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.DATASTORE_DEV_API_KEY,
});

module.exports = datastore;