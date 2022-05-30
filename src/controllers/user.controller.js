const datastore = require('../database/datastore');
const nanoid = require('../config/nanoid');
const jwt = require('jsonwebtoken');
const parseUserData = require('../helpers/userdataParser');
const objectToDatastoreObject = require('../helpers/objectDatastoreConverter');
const verifyUserExist = require('../helpers/userExistenceVerifier');

const register = async (req, res) => {
  const { email } = req.body;
  const key = datastore.key({
    namespace: "Dev",
    path: ["user"],
  });

  const entity = {
    key,
    data: {
      ...req.body,
      id: nanoid(),
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      picture: "",
      origin: {
        lat: 0,
        lng: 0,
      },
      passwordChangedAt: new Date().toJSON(),
      bookmark: [],
      shipping: [],
      role: "user",
    },
  }

  const query = datastore
    .createQuery("Dev", "user")
    .filter("email", "=", email);

  const result = await datastore.runQuery(query);

  if (result[0].length > 0) {
    return res.status(409).json({
      status: false,
      message: 'Email has already registered',
    })
  }
  
  try {
    const results = await datastore.save(entity);
    return res.status(200).json({
      status: true,
      message: 'user successfully created',
      results,
    })
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  const query = datastore
    .createQuery("Dev", "user")
    .filter("email", "=", email)
    .filter("password", "=", password)
    .limit(1);

  try {
    const result = await datastore.runQuery(query);

    if (result[0].length === 0) {
      return res.status(401).json({
        status: false,
        message: 'wrong username / password',
      })
    }

    const payload = {
      id: result[0][0].id,
      role: result[0][0].role,
    }
    const token = jwt.sign(payload, process.env.JWT_TOKEN);
    return res.status(200).json({
      status: true,
      message: 'user successfully login',
      token,
    })
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }
}

const profile = async (req, res) => {
  const { id } = req.user;

  const query = datastore
    .createQuery("Dev", "user")
    .filter("id", "=", id)
    .limit(1);

  try {
    const result = await datastore.runQuery(query);

    if (result[0].length === 0) {
      return res.status(404).json({
        status: false,
        message: '404 Not Found',
      })
    }

    return res.status(200).json({
      status: true,
      message: 'success',
      results: result[0][0],
    })
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }
}

const update = async (req, res) => {
  const { email, username, password, newPassword } = req.body;
  let result;

  const query = datastore
    .createQuery("Dev", "user")
    .filter("id", "=", req.user.id)
    .filter("password", "=", password)
    .limit(1);

  try {
    result = await datastore.runQuery(query);

    if (result[0].length === 0) {
      return res.status(401).json({
        status: false,
        message: 'wrong username / password',
      })
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
    })
  }

  oldData = parseUserData(datastore, result);
  const passwordChangedAtNew = newPassword === "" 
    ? oldData.passwordChangedAt : new Date().toJSON();
  const passwordNew = newPassword ?? oldData.password;

  oldData.username = username ?? oldData.username;
  oldData.email = email ?? oldData.email;
  oldData.passwordChangedAt = passwordChangedAtNew;
  oldData.password = passwordNew;
  oldData.updatedAt = new Date().toJSON();

  const entity = objectToDatastoreObject(oldData);

  try {
    result = await datastore.update(entity);
    return res.status(200).json({
      status: true,
      message: 'success update user',
      results: {
        id: req.user.id,
      },
    })
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
      error,
    })
  }
}

const _delete = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: false,
      message: 'You is not an admin',
    })
  }

  const result = await verifyUserExist(datastore, id);
  try {
    if (!result) throw 'query error';

    if (result[0].length === 0) {
      return res.status(404).json({
        status: false,
        message: '404 Resource Not Found',
      })
    }

    datastoreId = result[0][0][datastore.KEY]["id"];
    const key = datastore.key({
      namespace: "Dev",
      path: ["user", parseInt(datastoreId, 10)],
    });

    deleteRes = await datastore.delete(key);
    return res.status(200).json({
      status: true,
      message: 'success delete user',
      results: {
        id,
      },
    })


  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
      error,
    })
  }
}

const addBookmark = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const result = await verifyUserExist(datastore, userId);
  try {
    if (!result) throw 'query error';

    if (result[0].length === 0) {
      return res.status(404).json({
        status: false,
        message: '404 Resource Not Found',
      })
    }

    oldData = parseUserData(datastore, result);

    newBookmark = [...oldData.bookmark];
    newBookmark.push(id);

    newBookmark = [...new Set(newBookmark)];

    oldData["updatedAt"] = new Date().toJSON();
    oldData["bookmark"] = newBookmark;

    const entity = objectToDatastoreObject(oldData);

    await datastore.update(entity);
    return res.status(200).json({
      status: true,
      message: 'success add bookmark',
      results: {},
    })

  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
      error,
    })
  }
}

const deleteBookmark = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const result = await verifyUserExist(datastore, userId);
  try {
    if (!result) throw 'query error';

    if (result[0].length === 0) {
      return res.status(404).json({
        status: false,
        message: '404 Resource Not Found (user)',
      })
    }

    oldData = parseUserData(datastore, result);

    deletedIndex = oldData.bookmark.indexOf(id);
    if (deletedIndex === -1) {
      return res.status(404).json({
        status: false,
        message: '404 Resource Not Found (bookmark)',
      })
    }

    newBookmark = [...oldData.bookmark];
    newBookmark.splice(deletedIndex, 1);

    oldData["updatedAt"] = new Date().toJSON();
    oldData["bookmark"] = newBookmark;

    const entity = objectToDatastoreObject(oldData);

    await datastore.update(entity);
    return res.status(200).json({
      status: true,
      message: 'success delete bookmark',
      results: {},
    })

  } catch (error) {
    return res.status(400).json({
      status: false,
      message: '400 Bad Request',
      error,
    })
  }
}

module.exports = {
  register,
  login,
  profile,
  update,
  delete: _delete,
  addBookmark,
  deleteBookmark,
}