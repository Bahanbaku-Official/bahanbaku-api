const { Datastore } = require("@google-cloud/datastore");
require("dotenv").config();

const { register, login, profile, update, deleteUser, updateLocation, addBookmark , deleteBookmark } = require("./user");

const datastore = new Datastore({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.DATASTORE_DEV_API_KEY,
});

async function main() {
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
}
main();