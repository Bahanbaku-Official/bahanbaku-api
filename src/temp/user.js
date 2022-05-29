const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  12
);

async function verifyUserExist(datastore, id) {
  const query = datastore
    .createQuery("Dev", "user")
    .filter("id", "=", id)
    .limit(1);

  try {
    result = await datastore.runQuery(query);
    return result;
  } catch (err) {
    console.error("ERROR:", err);
    return undefined;
  }
}

function parseUserData(datastore, userData) {
  const id = userData[0][0]["id"];
  const username = userData[0][0]["username"];
  const createdAt = userData[0][0]["createdAt"];
  const picture = userData[0][0]["picture"];
  const email = userData[0][0]["email"];
  const origin = userData[0][0]["origin"];
  const bookmark = userData[0][0]["bookmark"];
  const shipping = userData[0][0]["shipping"];
  const role = userData[0][0]["role"];
  const passwordChangedAt = userData[0][0]["passwordChangedAt"];
  const password = userData[0][0]["password"];

  const key = userData[0][0][datastore.KEY];

  return {
    key: key,
    username: username,
    id: id,
    createdAt: createdAt,
    picture: picture,
    bookmark: bookmark,
    shipping: shipping,
    role: role,
    email: email,
    passwordChangedAt: passwordChangedAt,
    password: password,
    origin: origin,
  };
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

async function register(datastore, req, role = "user") {
  const key = datastore.key({
    namespace: "Dev",
    path: ["user"],
  });

  user = {};
  user["key"] = key;
  user["id"] = nanoid();
  user["createdAt"] = new Date().toJSON();
  user["updatedAt"] = user["createdAt"];
  user["username"] = req.username;
  user["email"] = req.email;
  user["password"] = req.password;
  user["picture"] = "";
  user["origin"] = [];
  user["passwordChangedAt"] = user["createdAt"];
  user["bookmark"] = [];
  user["shipping"] = [];
  user["role"] = role;

  const entity = objectToDatastoreObject(user);

  const query = datastore
    .createQuery("Dev", "user")
    .filter("email", "=", email);

  const result = await datastore.runQuery(query);
  if (result[0].length > 0) {
    // Aksi kalau email udah pernah register
    console.log("Email has been registered");
    return [];
  } else {
    try {
      res = await datastore.save(entity);
      console.log(`User ${key.id} created successfully.`);
      return user.id;
    } catch (err) {
      console.error("ERROR:", err);
      return [];
    }
  }
}

async function login(datastore, req) {
  const query = datastore
    .createQuery("Dev", "user")
    .filter("email", "=", req.email)
    .filter("password", "=", req.password)
    .limit(1);

  try {
    const result = await datastore.runQuery(query);
    if (result[0].length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("ERROR:", err);
    return [];
  }
}

async function profile(datastore, id) {
  const query = datastore
    .createQuery("Dev", "user")
    .filter("id", "=", id)
    .limit(1);

  try {
    const result = await datastore.runQuery(query);
    if (result[0].length > 0) {
      console.log("Get Profile Success");
      return parseUserData(datastore, result);
    } else {
      console.log("User with that ID doesn't exist");
      return [];
    }
  } catch (err) {
    console.error("ERROR:", err);
    return undefined;
  }
}

async function update(datastore, id, req) {
  const query = datastore
    .createQuery("Dev", "user")
    .filter("id", "=", id)
    .filter("password", "=", req.password)
    .limit(1);

  try {
    result = await datastore.runQuery(query);
  } catch (err) {
    console.error("ERROR:", err);
  }

  if (result[0].length > 0) {
    existingData = parseUserData(datastore, result);
    const passwordChangedAtFinal =
      req.newPassword === "" ? existingData.passwordChangedAt : new Date().toJSON();
    const passwordFinal =
      req.newPassword === "" ? existingData.password : req.newPassword;

    existingData["username"] = req.username;
    existingData["email"] = req.email;
    existingData["passwordChangedAt"] = passwordChangedAtFinal;
    existingData["password"] = passwordFinal;
    existingData["updatedAt"] = new Date().toJSON();

    const entity = objectToDatastoreObject(existingData);

    try {
      res = await datastore.update(entity);
      console.log(`User ${key.id} updated successfully.`);
      return existingData.id;
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("Username / Password Wrong");
    return false;
  }
}

async function updateLocation(datastore, id, origin) {
  const result = await verifyUserExist(datastore, id);

  if (result !== undefined) {
    ({
      key,
      id,
      createdAt,
      picture,
      username,
      email,
      bookmark,
      shipping,
      role,
      passwordChangedAt,
      password,
      datastoreId,
    } = parseUserData(datastore, result));

    entity = {
      key: key,
      data: [
        {
          name: "id",
          value: id,
        },
        {
          name: "createdAt",
          value: createdAt,
        },
        {
          name: "updatedAt",
          value: new Date().toJSON(),
        },
        {
          name: "username",
          value: username,
        },
        {
          name: "email",
          value: email,
        },
        {
          name: "password",
          value: password,
        },
        {
          name: "picture",
          value: picture,
        },
        {
          name: "origin",
          value: origin,
        },
        {
          name: "passwordChangedAt",
          value: passwordChangedAt,
        },
        {
          name: "bookmark",
          value: bookmark,
        },
        {
          name: "shipping",
          value: shipping,
        },
        {
          name: "role",
          value: role,
        },
      ],
    };

    try {
      res = await datastore.update(entity);
      console.log(`User ${key.id} updated successfully.`);
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("User Doesn't Exist");
  }
}

async function deleteUser(datastore, id) {
  const result = await verifyUserExist(datastore, id);
  if (result[0].length > 0) {
    datastoreId = result[0][0][datastore.KEY]["id"]; // Get Datastore ID
    const key = datastore.key({
      namespace: "Dev",
      path: ["user", parseInt(datastoreId, 10)],
    });

    try {
      res = await datastore.delete(key);
      console.log(`User ${key.id} deleted successfully.`);
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("User Doesn't Exist");
  }
}

async function addBookmark(datastore, id, bookmarkString) {
  const result = await verifyUserExist(datastore, id);

  if (result !== undefined) {
    existingData = parseUserData(datastore, result);

    bookmarkFinal = [...existingData.bookmark];
    bookmarkFinal.push(bookmarkString);

    // Remove Duplicate
    bookmarkFinal = new Set(bookmarkFinal)
    bookmarkFinal = Array.from(bookmarkFinal)

    existingData["updatedAt"] = new Date().toJSON()
    existingData["bookmark"] = bookmarkFinal

    const entity = objectToDatastoreObject(existingData)

    try {
      res = await datastore.update(entity);
      console.log(`User ${key.id} updated successfully.`);
      return true
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("User Doesn't Exist");
    return false
  }
}

async function deleteBookmark(datastore, id, bookmarkString) {
  const result = await verifyUserExist(datastore, id);

  if (result[0].length > 0) {
    existingData = parseUserData(datastore, result);

    // Remove bookmark
    bookmarkIndex = existingData.bookmark.indexOf(bookmarkString);
    bookmarkFinal = [...existingData.bookmark];
    if (bookmarkIndex > -1) {      
      bookmarkFinal.splice(bookmarkIndex, 1); // 2nd parameter means remove one item only
    }

    existingData["updatedAt"] = new Date().toJSON()
    existingData["bookmark"] = bookmarkFinal    

    const entity = objectToDatastoreObject(existingData)

    try {
      res = await datastore.update(entity);
      console.log(`User ${key.id} updated successfully.`);
      return true
    } catch (err) {
      console.error("ERROR:", err);
    }
  } else {
    console.log("User Doesn't Exist");
    return false
  }
}

module.exports = {
  register,
  login,
  profile,
  update,
  updateLocation,
  deleteUser,
  addBookmark,
  deleteBookmark,
};
