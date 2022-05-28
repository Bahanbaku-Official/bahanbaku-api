const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  12
);

function parseSingleRecipeData(datastore, recipeData) {
  const createdAt = recipeData[0][0]["createdAt"];
  const updatedAt = recipeData[0][0]["updatedAt"];
  const id = recipeData[0][0]["id"];
  const title = recipeData[0][0]["title"];
  const image = recipeData[0][0]["image"];
  const servings = recipeData[0][0]["servings"];
  const times = recipeData[0][0]["times"];
  const desc = recipeData[0][0]["desc"];
  const ingredients = recipeData[0][0]["ingredients"];
  const steps = recipeData[0][0]["steps"];
  const rating = recipeData[0][0]["rating"];
  const author = recipeData[0][0]["author"];
  const totalViews = recipeData[0][0]["totalViews"];
  const tags = recipeData[0][0]["tags"];

  const key = recipeData[0][0][datastore.KEY];

  return {
    key: key,
    createdAt: createdAt,
    updatedAt: updatedAt,
    id: id,
    title: title,
    image: image,
    servings: servings,
    times: times,
    desc: desc,
    ingredients: ingredients,
    steps: steps,
    rating: rating,
    author: author,
    totalViews: totalViews,
    tags: tags,
  };
}

function parseMultiRecipeData(datastore, recipeData) {
  recipeArray = [];
  recipeData[0].forEach((recipe) => {
    const createdAt = recipe["createdAt"];
    const updatedAt = recipe["updatedAt"];
    const id = recipe["id"];
    const title = recipe["title"];
    const image = recipe["image"];
    const servings = recipe["servings"];
    const times = recipe["times"];
    const desc = recipe["desc"];
    const ingredients = recipe["ingredients"];
    const steps = recipe["steps"];
    const rating = recipe["rating"];
    const author = recipe["author"];
    const totalViews = recipe["totalViews"];
    const tags = recipe["tags"];

    const key = recipe[datastore.KEY];

    recipeObject = {
      key: key,
      createdAt: createdAt,
      updatedAt: updatedAt,
      id: id,
      title: title,
      image: image,
      servings: servings,
      times: times,
      desc: desc,
      ingredients: ingredients,
      steps: steps,
      rating: rating,
      author: author,
      totalViews: totalViews,
      tags: tags,
    };

    recipeArray.push(recipeObject);
  });

  return recipeArray;
}

function objectToDatastoreObject(objectData) {
  key = objectData["key"];
  delete objectData["key"];
  entity = {
    key,
    data: [],
  };
  for (const [key, value] of Object.entries(objectData)) {
    obj = {
      name: key,
      value: value,
    };
    entity.data.push(obj);
  }

  return entity;
}

async function verifyRecipeExist(datastore, id) {
  const query = datastore
    .createQuery("Dev", "recipe")
    .filter("id", "=", id)
    .limit(1);

  try {
    result = await datastore.runQuery(query);
    return result;
  } catch (err) {
    console.error("ERROR:", err);
  }
}

function titleCase(str) {
  str = String(str).toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

async function createRecipe(datastore, recipe) {
  const key = datastore.key({
    namespace: "Dev",
    path: ["recipe"],
  });

  recipe["key"] = key;
  recipe["id"] = nanoid();
  recipe["createdAt"] = new Date().toJSON();
  recipe["updatedAt"] = recipe["createdAt"];
  recipe["totalViews"] = 0;

  const entity = objectToDatastoreObject(recipe);

  const query = datastore
    .createQuery("Dev", "recipe")
    .filter("title", "=", recipe["title"]);

  const result = await datastore.runQuery(query);
  if (result[0].length === 0) {
    try {
      res = await datastore.save(entity);
      console.log(`Recipe ${key.id} created successfully.`);
      return recipe.id;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("recipe with that title already exists");
  }
}

async function getRecipeById(datastore, id) {
  const result = await verifyRecipeExist(datastore, id);
  if (result[0].length > 0) {
    existingData = parseSingleRecipeData(datastore, result);
    existingData["totalViews"] += 1;

    entity = objectToDatastoreObject(existingData);

    try {
      res = await datastore.update(entity);
      console.log(`Success get recipe ${existingData.title} successfully.`);
      return existingData;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    // Kalau Resep tidak ditemukan
    console.log("ERROR: Recipe doesn't exist");
    return [];
  }
}

async function getRecipe(datastore, option = {}) {
  search = option.search || "";
  newRecipe = option.new || 0;
  featured = option.featured || 0;

  getRecipeOption = -1;

  if (search.length > 0) {
    getRecipeOption = 1;
    search = titleCase(search); // Mempermudah format dalam pencarian resep
  } else if (newRecipe === 1) {
    getRecipeOption = 2;
  } else if (featured === 1) {
    getRecipeOption = 3;
  }

  console.log(getRecipeOption);

  switch (getRecipeOption) {
    case 1:
      query = datastore
        .createQuery("Dev", "recipe")
        .filter("title", ">=", titleCase(search));
      break;
    case 2:
      query = datastore
        .createQuery("Dev", "recipe")
        .order("createdAt", {
          descending: true,
        })
        .limit(5); // Limit data yang di kembalikan
      break;
    case 3:
      query = datastore
        .createQuery("Dev", "recipe")
        .order("totalViews", {
          descending: true,
        })
        .limit(5); // Limit data yang di kembalikan
      break;
    default: // Tidak ada opsi yang dipilih
      query = datastore.createQuery("Dev", "recipe").limit(10);
      break;
  }

  // Search berdasarkan nama resep

  const result = await datastore.runQuery(query);

  if (result[0].length > 0) {
    existingData = parseMultiRecipeData(datastore, result);
    return existingData;
  } else {
    // Kalau Resep tidak ditemukan
    console.log("ERROR: Recipe with that title doesn't exist");
    return [];
  }
}

async function updateRecipe(datastore, id, recipe) {
  const result = await verifyRecipeExist(datastore, id);

  if (result[0].length > 0) {
    const existingData = parseSingleRecipeData(datastore, result);
    const datastoreId = parseInt(existingData["key"]["id"], 10);
    const key = datastore.key({
      namespace: "Dev",
      path: ["recipe", datastoreId],
    });

    recipe["key"] = key;
    recipe["id"] = id;
    recipe["createdAt"] = existingData.createdAt;
    recipe["updatedAt"] = new Date().toJSON();

    const entity = objectToDatastoreObject(recipe);

    try {
      res = await datastore.update(entity);
      console.log(`Recipe ${key.id} updated successfully.`);
      return recipe.id;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("ERROR: Recipe doesn't exist");
    return [];
  }
}

async function deleteRecipe(datastore, id) {
  const result = await verifyRecipeExist(datastore, id);

  if (result[0].length > 0) {
    const existingData = parseSingleRecipeData(datastore, result);
    const datastoreId = parseInt(existingData["key"]["id"], 10);
    const key = datastore.key({
      namespace: "Dev",
      path: ["recipe", datastoreId],
    });

    try {
      res = await datastore.delete(key);
      console.log(`Recipe ${key.id} deleted successfully.`);
      return existingData.id;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("ERROR: Recipe doesn't exist");
    return [];
  }
}

module.exports = {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipe,
};
