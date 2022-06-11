const { Storage } = require("@google-cloud/storage");

const cloudStorage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
});

module.exports = cloudStorage;