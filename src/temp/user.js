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
  const datastoreId = userData[0][0][datastore.KEY]["id"]; // Get Datastore ID

  const key = datastore.key({
    namespace: "Dev",
    path: ["user", parseInt(datastoreId, 10)],
  });

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
    datastoreId: datastoreId,
    origin: origin,
  };
}

async function register(datastore, username, email, password, role = "user") {
  const key = datastore.key({
    namespace: "Dev",
    path: ["user"],
  });
  const entity = {
    key: key,
    data: [
      {
        name: "id",
        value: nanoid(),
      },
      {
        name: "createdAt",
        value: new Date().toJSON(),
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
        value: "",
      },
      {
        name: "origin",
        value: {
          lat: 0,
          lng: 0,
        },
      },
      {
        name: "passwordChangedAt",
        value: new Date().toJSON(),
      },
      {
        name: "bookmark",
        value: [],
      },
      {
        name: "shipping",
        value: [],
      },
      {
        name: "role",
        value: role,
      },
    ],
  };

  const query = datastore
    .createQuery("Dev", "user")
    .filter("email", "=", email);

  const result = await datastore.runQuery(query);
  if (result[0].length > 0) {
    // Aksi kalau email udah pernah register
    console.log("Email has been registered");
  } else {
    try {
      res = await datastore.save(entity);
      console.log(`User ${key.id} created successfully.`);
    } catch (err) {
      console.error("ERROR:", err);
    }
  }
}

async function login(datastore, email, password) {
  const query = datastore
    .createQuery("Dev", "user")
    .filter("email", "=", email)
    .filter("password", "=", password)
    .limit(1);

  try {
    const result = await datastore.runQuery(query);
    return result;
  } catch (err) {
    console.error("ERROR:", err);
    return undefined;
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
      // Kalau User ada
      return parseUserData(datastore, result);
    } else {
      // Kalau User gaada
      return [];
    }
  } catch (err) {
    console.error("ERROR:", err);
    return undefined;
  }
}

async function update(
  datastore,
  id,
  username,
  email,
  password,
  newpassword = ""
) {
  const query = datastore
    .createQuery("Dev", "user")
    .filter("id", "=", id)
    .filter("password", "=", password)
    .limit(1);

  try {
    result = await datastore.runQuery(query);
  } catch (err) {
    console.error("ERROR:", err);
  }

  if (result !== undefined) {
    ({
      key,
      id,
      createdAt,
      origin,
      picture,
      bookmark,
      shipping,
      role,
      passwordChangedAt,
      password,
    } = parseUserData(datastore, result));

    const passwordChangedAtFinal =
      newpassword === "" ? passwordChangedAt : new Date().toJSON();
    const passwordFinal = newpassword === "" ? password : newpassword;

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
          value: passwordFinal,
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
          value: passwordChangedAtFinal,
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
    console.log("Username / Password Wrong");
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
    ({
      key,
      id,
      username,
      email,
      createdAt,
      picture,
      bookmark,
      shipping,
      origin,
      role,
      passwordChangedAt,
      password,
      datastoreId,
    } = parseUserData(datastore, result));

    bookmarkFinal = [...bookmark];
    bookmarkFinal.push(bookmarkString);

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
          value: bookmarkFinal,
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

async function deleteBookmark(datastore, id, bookmarkString) {
  const result = await verifyUserExist(datastore, id);

  if (result[0].length > 0) {
    ({
      key,
      id,
      username,
      email,
      createdAt,
      picture,
      bookmark,
      shipping,
      origin,
      role,
      passwordChangedAt,
      password,
      datastoreId,
    } = parseUserData(datastore, result));

    // Remove bookmark
    bookmarkIndex = bookmark.indexOf(bookmarkString);
    if (bookmarkIndex > -1) {
      bookmarkFinal = [...bookmark];
      bookmark.splice(bookmarkIndex, 1); // 2nd parameter means remove one item only
    }

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
