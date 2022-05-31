const nanoid = require("../config/nanoid");
const datastore = require("../database/datastore");
const objectToDatastoreObject = require("../helpers/objectDatastoreConverter");
const parseRecipeData = require("../helpers/recipeDataParser");
const verifyRecipeExist = require("../helpers/recipeExistenceVerifier");

const findAll = async (req, res) => {
  const { search, featured, new: latest } = req.query;

  if (search) {
    query = datastore
      .createQuery("Dev", "recipe")
      .filter("title", ">=", titleCase(search));
  } else if (featured === "1") {
    query = datastore
      .createQuery("Dev", "recipe")
      .order("createdAt", {
        descending: true,
      })
      .limit(5);
  } else if (latest === "1") {
    query = datastore
      .createQuery("Dev", "recipe")
      .order("totalViews", {
        descending: true,
      })
      .limit(5);
  } else {
    query = datastore.createQuery("Dev", "recipe");
  }

  try {
    const result = await datastore.runQuery(query);
    return res.status(200).json({
      success: true,
      message: "success get recipes",
      results: result[0],
    })
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }
}

const findById = async (req, res) => {
  const { id } = req.params;

  try {
    result = await verifyRecipeExist(datastore, id);

    if (result[0].length === 0) {
      return res.status(404).json({
        status: false,
        message: '404 Resource Not Found',
      })
    }

    oldData = parseRecipeData(datastore, result);
    oldData.totalViews += 1;

    entity = objectToDatastoreObject(oldData);
    await datastore.update(entity);

    return res.status(200).json({
      status: true,
      message: 'success get recipe',
      results: oldData,
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
      error,
    })
  }
}

const create = async (req, res) => {
  const { title } = req.body;

  const key = datastore.key({
    namespace: "Dev",
    path: ["recipe"],
  });

  const entity = {
    key,
    data: {
      ...req.body,
      id: nanoid(),
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      rating: 0.0,
      totalViews: 0,
    }
  }

  const query = datastore
    .createQuery("Dev", "recipe")
    .filter("title", "=", title);

  const result = await datastore.runQuery(query);

  if (result[0].length > 0) {
    return res.status(409).json({
      status: false,
      message: 'Recipe has already exist',
    })
  }

  try {
    await datastore.save(entity);
    return res.status(200).json({
      status: true,
      message: 'success create recipe',
      results: {
        id: entity.data.id,
      },
    })
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params;
  const recipe = req.body;

  try {
    const result = await verifyRecipeExist(datastore, id);
    if (result[0].length === 0) {
      return res.status(404).json({
        status: false,
        message: '404 Resource Not Found',
      })
    }

    const oldData = parseRecipeData(datastore, result);
    recipe.key = oldData.key;
    recipe.id = oldData.id;
    recipe.createdAt = oldData.createdAt;
    recipe.updatedAt = new Date().toJSON();
    recipe.totalViews = oldData.totalViews;
    recipe.rating = oldData.rating;

    const entity = objectToDatastoreObject(recipe);
    await datastore.update(entity);

    return res.status(200).json({
      status: true,
      message: 'success update recipe',
      results: {
        id: entity.data.id,
      },
    })
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }
}

const _delete = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await verifyRecipeExist(datastore, id);

    if (result[0].length === 0) {
      return res.status(404).json({
        status: false,
        message: '404 Resource Not Found',
      })
    }

    const datastoreId = result[0][0][datastore.KEY].id;
    const key = datastore.key({
      namespace: "Dev",
      path: ["recipe", parseInt(datastoreId, 10)],
    });

    await datastore.delete(key);

    return res.status(200).json({
      status: true,
      message: 'success delete recipe',
      results: {
        id: result[0][0].id,
      },
    })

  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: _delete,
}