const nanoid = require("../config/nanoid");
const datastore = require("../database/datastore");
const objectToDatastoreObject = require("../helpers/objectDatastoreConverter");
const parseRecipeData = require("../helpers/recipeDataParser");
const verifyRecipeExist = require("../helpers/recipeExistenceVerifier");

const findAll = async (req, res, next) => {
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
    next(error);
  }
}

const findById = async (req, res, next) => {
  const { id } = req.params;

  try {
    result = await verifyRecipeExist(datastore, id);

    if (result[0].length === 0) {
      next('404,recipe not found');
      return;
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
    next(error);
  }
}

const create = async (req, res, next) => {
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
    next('409,recipe already exist');
    return;
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
    next(error);
  }
}

const update = async (req, res, next) => {
  const { id } = req.params;
  const recipe = req.body;

  try {
    const result = await verifyRecipeExist(datastore, id);
    if (result[0].length === 0) {
      next('404,recipe not found');
      return;
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
    next(error);
  }
}

const _delete = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await verifyRecipeExist(datastore, id);

    if (result[0].length === 0) {
      next('404,recipe not found');
      return;
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
    next(error);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: _delete,
}