const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  12
);

function parseSingleSupplierData(datastore, supplierData) {
  const createdAt = supplierData[0][0]["createdAt"];
  const updatedAt = supplierData[0][0]["updatedAt"];
  const id = supplierData[0][0]["id"];
  const name = supplierData[0][0]["name"];
  const origin = supplierData[0][0]["origin"];
  const address = supplierData[0][0]["address"];
  const address_obj = supplierData[0][0]["address_obj"];
  const product = supplierData[0][0]["product"];
  const contact = supplierData[0][0]["contact"];
  const image = supplierData[0][0]["image"];

  const key = supplierData[0][0][datastore.KEY];

  return {
    key: key,
    createdAt: createdAt,
    updatedAt: updatedAt,
    id: id,
    name: name,
    origin: origin,
    address: address,
    address_obj: address_obj,
    product: product,
    contact: contact,
    image: image,
  };
}

function parseMultiSupplierData(datastore, supplierData) {
  supplierArray = [];
  supplierData[0].forEach((supplier) => {
    const createdAt = supplierData[0][0]["createdAt"];
    const updatedAt = supplierData[0][0]["updatedAt"];
    const id = supplierData[0][0]["id"];
    const name = supplierData[0][0]["name"];
    const origin = supplierData[0][0]["origin"];
    const address = supplierData[0][0]["address"];
    const address_obj = supplierData[0][0]["address_obj"];
    const product = supplierData[0][0]["product"];
    const contact = supplierData[0][0]["contact"];
    const image = supplierData[0][0]["image"];

    const key = supplierData[0][0][datastore.KEY];

    supplierObject = {
      key: key,
      createdAt: createdAt,
      updatedAt: updatedAt,
      id: id,
      name: name,
      origin: origin,
      address: address,
      address_obj: address_obj,
      product: product,
      contact: contact,
      image: image,
    };

    supplierArray.push(supplierObject);
  });

  return supplierArray;
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

async function verifySupplierExist(datastore, id) {
  const query = datastore
    .createQuery("Dev", "supplier")
    .filter("id", "=", id)
    .limit(1);

  try {
    result = await datastore.runQuery(query);
    return result;
  } catch (err) {
    console.error("ERROR:", err);
  }
}

async function createSupplier(datastore, supplier) {
  const key = datastore.key({
    namespace: "Dev",
    path: ["supplier"],
  });

  supplier["key"] = key;
  supplier["id"] = nanoid();
  supplier["createdAt"] = new Date().toJSON();
  supplier["updatedAt"] = supplier["createdAt"];

  const entity = objectToDatastoreObject(supplier);

  const query = datastore
    .createQuery("Dev", "supplier")
    .filter("name", "=", supplier["name"]);

  const result = await datastore.runQuery(query);
  if (result[0].length === 0) {
    try {
      res = await datastore.save(entity);
      console.log(`Supplier ${key.id} created successfully.`);
      return supplier.id;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("Error: Supplier with that name already exists");
  }
}

async function getSupplierById(datastore, id) {
  const result = await verifySupplierExist(datastore, id);
  if (result[0].length > 0) {
    existingData = parseSingleSupplierData(datastore, result);
    console.log(`Success get supplier ${existingData.name} successfully.`);
    return existingData;
  } else {
    console.log("ERROR: Supplier doesn't exist");
    return [];
  }
}

async function getSupplier(datastore) {
  query = datastore.createQuery("Dev", "supplier");
  const result = await datastore.runQuery(query);

  if (result[0].length > 0) {
    existingData = parseMultiSupplierData(datastore, result);
    return existingData;
  } else {
    console.log("ERROR: No Supplier in Database");
    return [];
  }
}

async function updateSupplier(datastore, id, supplier) {
  const result = await verifySupplierExist(datastore, id);

  if (result[0].length > 0) {
    const existingData = parseSingleSupplierData(datastore, result);
    const datastoreId = parseInt(existingData["key"]["id"], 10);
    const key = datastore.key({
      namespace: "Dev",
      path: ["supplier", datastoreId],
    });

    supplier["key"] = key;
    supplier["id"] = id;
    supplier["createdAt"] = existingData.createdAt;
    supplier["updatedAt"] = new Date().toJSON();

    const entity = objectToDatastoreObject(supplier);

    try {
      res = await datastore.update(entity);
      console.log(`Supplier ${key.id} updated successfully.`);
      return supplier.id;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("ERROR: Supplier doesn't exist");
    return [];
  }
}

async function deleteSupplier(datastore, id) {
  const result = await verifySupplierExist(datastore, id);

  if (result[0].length > 0) {
    const existingData = parseSingleSupplierData(datastore, result);
    const datastoreId = parseInt(existingData["key"]["id"], 10);
    const key = datastore.key({
      namespace: "Dev",
      path: ["supplier", datastoreId],
    });

    try {
      res = await datastore.delete(key);
      console.log(`Supplier ${key.id} deleted successfully.`);
      return existingData.id;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("ERROR: Supplier doesn't exist");
    return [];
  }
}

module.exports = {
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  getSupplier,
};
