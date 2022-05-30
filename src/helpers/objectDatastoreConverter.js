const objectToDatastoreObject = (objectData) => {
  key = objectData.key;
  delete objectData.key;
  entity = {
    key,
    data: [],
  }

  for (const [key, value] of Object.entries(objectData)) {
    obj = {
      name: key,
      value: value,
    };
    entity.data.push(obj);
  }

  return entity;
}

module.exports = objectToDatastoreObject;