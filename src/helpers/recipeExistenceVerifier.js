async function verifyRecipeExist(datastore, id) {
  const query = datastore
    .createQuery("Prod", "recipe")
    .filter("id", "=", id)
    .limit(1);

  try {
    result = await datastore.runQuery(query);
    return result;
  } catch (err) {
    return false;
  }
}

module.exports = verifyRecipeExist;