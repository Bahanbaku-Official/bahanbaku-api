const { Storage } = require("@google-cloud/storage");

const cloudStorage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.CLOUD_STORAGE_DEV_API_KEY,
});

module.exports = cloudStorage;