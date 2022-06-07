# BahanbaKu API
An app which connects Android and Machine Learning for BahanbaKu

## Library
- .env loader : dotenv
- Auth : jsonwebtoken
- Unique ID : nanoid
- File Upload : multer
- HTTP Client : axios
- Backend : express
- API Docs : swagger-ui-express
- NoSQL : @google-cloud/datastore
- Storage : @google-cloud/storage
- CORS : cors

# GCP Resource Used
- VMs : Google Compute Engine
- NoSQL : Cloud DataStore
- Storage : Cloud Storage
- Distance between : Distance Matrix API
- Nearby restaurant : Places API

## Installation
Requires Node.JS v14+ to run
```sh
git clone https://github.com/irvanrizkin/bahanbaku-api
cd bahanbaku-api
npm install
cp env.example .env
# Edit the .env first before running
node index.js
```

## API Documentation
Only accessible after `node index.js`
Swagger : http://localhost:5000/docs/
