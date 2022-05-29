const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs").promises;

require("dotenv").config();

const {
  register,
  login,
  profile,
  update,
  deleteUser,
  updateLocation,
  uploadPicture,
  addBookmark,
  deleteBookmark,
} = require("./user");

const {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipe,
} = require("./recipe");

const {
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplier,
} = require("./supplier");

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.DATASTORE_DEV_API_KEY,
});

const cloudStorage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.CLOUD_STORAGE_DEV_API_KEY,
});

async function main() {
  // User

  // req = {
  //   username: "irvan",
  //   email: "irvan@gmail.com",
  //   password: "irvan123",
  // };
  // ret = await register(datastore,req, "admin"); // admin is optional , default value is user
  // console.log("User ID: "+ ret);

  // req = {
  //   email: "irvan@gmail.com",
  //   password: "irvan123",
  // };
  // ret = await login(datastore, req);
  // console.log(
  //   ret === true ? "Login Success" : " Wrong username / password"
  // ); // Give JWT Token

  // ret = await profile(datastore, "svMz9AIXjdhp");
  // console.log(ret);

  // req = {
  //   username: "irvan 2",
  //   email: "irvan@gmail.com",
  //   password: "irvan123",
  //   newPassword: "",
  // };
  // ret = await update(datastore, "svMz9AIXjdhp", req);
  // console.log(ret !== false ? "User ID: " + ret : "Wrong username / password");

  // req = {
  //   username: "irvan",
  //   email: "irvan@gmail.com",
  //   password: "irvan123",
  //   newPassword: "irvan125",
  // };
  // ret = await update(datastore, "svMz9AIXjdhp", req);
  // console.log(ret !== false ? "User ID: " + ret : "Wrong username / password");

  // ret = await deleteUser(datastore,"svMz9AIXjdhp")

  // req = { lat: 1.21313131, lng: 2.2313131 };
  // ret = await updateLocation(datastore, "svMz9AIXjdhp",req);

  // ret = await addBookmark(datastore, "svMz9AIXjdhp", "Recipe2");
  // console.log(ret !== false ? "Success add Bookmark" : "Fail add bookmark")

  // ret = await deleteBookmark(datastore, "svMz9AIXjdhp", "Recipe1");
  // console.log(ret !== false ? "Success delete Bookmark" : "Fail delete bookmark")

  photoName = "tes_foto.jpg";
  photoObject = {};  

  async function uploadPhotoFromLocal() {
    data = await fs.readFile(photoName, "binary");         
    photoObject = {
      originalname: photoName,
      buffer: Buffer.from(data,"binary"),
    };          
  }

  await uploadPhotoFromLocal();  

  ret = await uploadPicture(datastore, cloudStorage, "svMz9AIXjdhp", photoObject);
  console.log(ret);

  // Recipe
  recipe = {
    title: "Hello World",
    desc: "string",
    servings: 0,
    times: 0,
    image: "string",
    description: "string",
    ingredients: ["string"],
    steps: ["string"],
    tags: ["string"],
    author: "rifqi",
    rating: 0,
  };

  //ret = await createRecipe(datastore , recipe)
  //console.log("Recipe ID : " + ret);

  //ret = await getRecipeById(datastore,"NPLWjA4z5Ufp")
  //console.log(ret); // Response

  //ret = await updateRecipe(datastore,"NPLWjA4z5Ufp",recipe)
  //console.log("Recipe ID : " + ret);

  //ret = await deleteRecipe(datastore,"Nz0Xp2giduPF")
  //console.log("Recipe ID : " + ret);

  // ret = await getRecipe(datastore)
  // console.log(ret);
  // ret = await getRecipe(datastore,{search:"hello world 2"})
  // console.log(ret);
  // ret = await getRecipe(datastore,{new:1})
  // console.log(ret);
  // ret = await getRecipe(datastore,{featured:1})
  // console.log(ret);

  supplier = {
    name: "Rifqi Shop",
    origin: [-7.424724, 109.2290617],
    address:
      "Jl. Graha Timur 5, Purwokerto Wetan, Kec. Purwokerto Timur., Kabupaten Banyumas, Jawa Tengah",
    addressObj: {
      subDistrict: "Purwokerto Wetan",
      district: "Purwokerto Timur",
      city: "Banyumas",
      province: "Jawa Tengah",
      zipCode: "53111",
    },
    product: [
      {
        name: "Frisian Flag susu UHT 900ml",
        price: 13900,
      },
      {
        name: "Alini Gula Halus 500gr",
        price: 20000,
      },
      {
        name: "Telur 1kg",
        price: 13000,
      },
      {
        name: "DOLPIN Garam Dapur 500gr",
        price: 10500,
      },
      {
        name: "Beras Ramos 1kg",
        price: 14000,
      },
      {
        name: "Bawang putih 1kg",
        price: 32000,
      },
      {
        name: "Bawang merah 1kg",
        price: 37000,
      },
      {
        name: "Santan sasa 65ml",
        price: 3500,
      },
    ],
    contact: "081234567890",
    image: "https://google.com",
  };

  // ret = await createSupplier(datastore , supplier)
  // console.log("Supplier ID : " + ret);

  // ret = await getSupplier(datastore)
  // console.log(ret);

  // ret = await getSupplierById(datastore,"j9Dy4kGK3p66")
  // console.log(ret); // Response

  // ret = await updateSupplier(datastore,"j9Dy4kGK3p66",supplier)
  // console.log("Supplier ID : " + ret);

  // ret = await deleteSupplier(datastore,"j9Dy4kGK3p66")
  // console.log("Supplier ID : " + ret);
}
main();
