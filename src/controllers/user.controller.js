const datastore = require('../database/datastore');
const nanoid = require('../config/nanoid');
const jwt = require('jsonwebtoken');

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
  const query = datastore
    .createQuery("Dev", "user")
    .filter("id", "=", req.user.id)
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

const update = (req, res) => {
  const { password } = req.body;

  if (password) {
    return res.status(200).json({
      status: true,
      message: 'this is update endpoint with password',
      results: req.body,
    })
  }

  if (location) {
    return res.status(200).json({
      status: true,
      message: 'this is update endpoint with location',
      results: req.body,
    })
  }

  return res.status(200).json({
    status: true,
    message: 'this is update endpoint clear',
    results: req.body,
  })
}

const _delete = (req, res) => {
  const { id } = req.params;

  return res.status(200).json({
    status: true,
    message: 'this is delete endpoint',
    results: {
      id,
    },
  })
}

const addBookmark = (req, res) => {
  const { id } = req.params;

  if (id !== 'eJXCDdzd') {
    return res.status(404).json({
      status: true,
      message: 'this is add bookmark endpoint when match not found',
      results: {
        id,
      },
    })
  }

  return res.status(200).json({
    status: true,
    message: 'this is add bookmark endpoint when match found',
    results: {
      id,
    },
  })
}

const deleteBookmark = (req, res) => {
  const { id } = req.params;

  if (id !== 'eJXCDdzd') {
    return res.status(404).json({
      status: true,
      message: 'this is delete bookmark endpoint when match not found',
      results: {
        id,
      },
    })
  }

  return res.status(200).json({
    status: true,
    message: 'this is delete bookmark endpoint when match found',
    results: {
      id,
    },
  })
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