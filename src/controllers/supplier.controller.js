const nanoid = require("../config/nanoid");
const datastore = require("../database/datastore");
const objectToDatastoreObject = require("../helpers/objectDatastoreConverter");
const parseRecipeData = require("../helpers/recipeDataParser");
const verifySupplierExist = require("../helpers/supplierExistenceVerifier");

const findAll = async (_, res, next) => {
  const query = datastore.createQuery("Prod", "supplier");

  try {
    const result = await datastore.runQuery(query);
    return res.status(200).json({
      success: true,
      message: "success get suppliers",
      results: result[0],
    })
  } catch (error) {
    next(error);
  }
}

const findById = async (req, res, next) => {
  const { id } = req.params;

  try {
    result = await verifySupplierExist(datastore, id);

    if (result[0].length === 0) {
      next('404,supplier not found');
      return;
    }

    return res.status(200).json({
      status: true,
      message: 'success get supplier by id',
      results: result[0][0],
    })
  } catch (error) {
    next(error);
  }
}

const create = async (req, res, next) => {
  const { name } = req.body;

  const query = datastore
    .createQuery("Prod", "supplier")
    .filter("name", "=", name);
  
  try {
    const result = await datastore.runQuery(query);
    if (result[0].length > 0) {
      next('409,supplier already exist');
      return;
    }

    const key = datastore.key({
      namespace: "Prod",
      path: ["supplier"],
    });
    const entity = {
      key,
      data: {
        ...req.body,
        id: nanoid(),
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
      }
    }

    await datastore.save(entity);
    return res.status(200).json({
      status: true,
      message: 'success create supplier',
      results: {
        id: entity.data.id,
      },
    })
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  const { id } = req.params;
  const supplier = req.body;

  try {
    const result = await verifySupplierExist(datastore, id);
    if (result[0].length === 0) {
      next('404,supplier not found');
      return;
    }

    const oldData = parseRecipeData(datastore, result);
    supplier.key = oldData.key;
    supplier.id = oldData.id;
    supplier.createdAt = oldData.createdAt;
    supplier.updatedAt = new Date().toJSON();

    const entity = objectToDatastoreObject(supplier);
    await datastore.update(entity);

    return res.status(200).json({
      status: true,
      message: 'success update supplier',
      results: {
        id: supplier.id,
      },
    })
  } catch (error) {
    next(error);
  }
}

const _delete = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await verifySupplierExist(datastore, id);

    if (result[0].length === 0) {
      next('404,supplier not found');
      return;
    }

    const datastoreId = result[0][0][datastore.KEY].id;
    const key = datastore.key({
      namespace: "Prod",
      path: ["supplier", parseInt(datastoreId, 10)],
    });

    await datastore.delete(key);

    return res.status(200).json({
      status: true,
      message: 'success delete supplier',
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