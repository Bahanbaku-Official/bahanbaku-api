const recipes = [
  {
    id: "pQLi6pat",
    title: "nasi goreng jawa",
    servings: 3,
    times: 45,
    ingredients: [
      "1600 g nasi putih",
      "2 butir telur, kocok lepas",
      "1 buah daging paha ayam atas bawah, potong agak tipis",
      "6 buah bakso sapi, iris",
      "5 lembar kol, buang tulang, iris kasar",
      "6 batang caisim, potong 3 cm",
      "2 sdm Bango Kecap Manis",
      "1 bungkus Royco Bumbu Komplit Nasi Goreng",
      "1 sdt garam",
      "⅛ sdt merica putih bubuk",
      "2 batang daun bawang, iris miring",
      "2 sdm minyak, untuk menumis",
      "3 siung bawang putih, goreng",
      "4 butir kemiri, goreng",
      "6 butir bawang merah",
      "3 buah cabai merah besar",
      "5 butir ebi"
    ],
    steps: [
      "1 Panaskan minyak. Tumis bumbu halus sampai harum. Tambahkan telur di tengah wajan. Aduk sampai berbutir.",
      "2 Masukkan ayam, aduk hingga matang. Masukkan bakso sapi, aduk sebentar. Tambahkan kol dan caisim. Aduk sampai setengah layu.",
      "3 Masukkan nasi. Aduk-aduk. Tambahkan Bango Kecap Manis, Royco Bumbu Komplit Nasi Goreng, garam, dan merica. Aduk sampai matang.",
      "4 Masukkan daun bawang. Aduk rata. Sajikan."
    ],
    description: "Resep nasi goreng Jawa merupakan salah satu menu makanan rumahan yang jadi andalan di kala para ratu dapur sedang tak punya waktu memasak atau tak punya bahan masakan di kulkas Bahan-bahannya yang sederhana dan hampir selalu ada di setiap rumah membuat resep nasi goreng ini sangat mudah diaplikasikan kapan saja",
    author: "Dilla",
    image: "https://storage.googleapis.com/bahanbaku/recipe/pQLi6pat.png",
    tags: [
      "Nasi Goreng"
    ]
  }
]

const findAll = (req, res) => {
  const { search, featured, new: latest } = req.query;

  if (search) {
    return res.status(200).json({
      success: true,
      message: "get recipe by query",
      results: {
        recipes
      }
    })
  }

  if (featured === "1") {
    return res.status(200).json({
      success: true,
      message: "get featured recipe",
      results: {
        recipes
      }
    })
  }

  if (latest === "1") {
    return res.status(200).json({
      success: true,
      message: "get latest recipe",
      results: {
        recipes
      }
    })
  }

  return res.status(200).json({
    success: true,
    message: "success get recipes",
    results: {
      recipes
    }
  })
}

const findById = (req, res) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
      message: `success get ${id} recipe`,
      results: {
        recipe: recipes[0]
      }
  })
}

const create = (req, res) => {
  return res.status(200).json({
    success: true,
      message: `success create recipe`,
      results: req.body
  })
}

const update = (req, res) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
      message: `success update recipe`,
      results: {
        id,
      }
  })
}

const _delete = (req, res) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
      message: `success delete recipe`,
      results: {
        id,
      }
  })
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: _delete,
}