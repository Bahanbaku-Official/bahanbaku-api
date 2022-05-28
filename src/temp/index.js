const { Datastore } = require("@google-cloud/datastore");
require("dotenv").config();

const {
  register,
  login,
  profile,
  update,
  deleteUser,
  updateLocation,
  addBookmark,
  deleteBookmark,
} = require("./user");

const {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipe
} = require("./recipe")

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.DATASTORE_DEV_API_KEY,
});

async function main() {
  // User
  //await register(datastore,"irvan", "irvan@gmail.com", "irvan123", "admin"); // admin is optional , default value is user
  //res = await login(datastore, "irvan@gmail.com", "irvan123");
  //console.log(res)
  //res = await profile(datastore, "G3qt59Hfl4La");
  //console.log(res);
  //res = await update(datastore, "G3qt59Hfl4La" , "irvan 2" , "irvan@gmail.com" , "irvan123" ,"irvan124");
  //res = await deleteUser(datastore,"G3qt59Hfl4La")
  //res = await updateLocation(datastore,"G3qt59Hfl4La",{"lat":1.21313131,"lng":2.2313131})
  //res = await addBookmark(datastore,"G3qt59Hfl4La","ID Bookmark 2")
  //res = await deleteBookmark(datastore,"G3qt59Hfl4La","ID Bookmark 2")

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
    rating:0
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

}
main();
