const parseUserData = (datastore, userData) => {
  const userExtract = userData[0][0];
  return {
    key: userExtract[datastore.KEY],
    username: userExtract.username,
    id: userExtract.id,
    createdAt: userExtract.createdAt,
    picture: userExtract.picture,
    bookmark: userExtract.bookmark,
    shipping: userExtract.shipping,
    role: userExtract.role,
    email: userExtract.email,
    passwordChangedAt: userExtract.passwordChangedAt,
    password: userExtract.password,
    origin: userExtract.origin,
  };
}

module.exports = parseUserData;