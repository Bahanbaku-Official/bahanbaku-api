const register = (req, res) => {
  return res.status(200).json({
    status: true,
    message: 'this is register endpoint',
    results: req.body,
  })
}

const login = (req, res) => {
  return res.status(200).json({
    status: true,
    message: 'this is login endpoint',
    results: req.body,
  })
}

const profile = (_, res) => {
  return res.status(200).json({
    results: {
      id: 'eJXCDdzd',
      username: 'testing',
      email: 'testing@gmail.com',
      picture: 'http://cloud-storage/profile/eJXCDdzd.png',
      origin: {
        lat: -9.424724,
        long: 105.2290617 
      },
      shipping: [
        {
          id: 'gJDNQCOC',
          cost: 10000,
        },
        {
          id: '24SUZiRT',
          cost: 15000,
        },
      ],
      bookmarks: [
        "pQLi6pat",
        "8cLv0cul",
      ]
    }
  })
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