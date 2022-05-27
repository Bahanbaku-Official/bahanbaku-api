const suppliers = [
  {
    id: "gJDNQCOC",
    name: "Warung Toni",
    origin: [
      -7.424724,
      109.2290617
    ],
    address: "Jl. Graha Timur 5, Purwokerto Wetan, Kec. Purwokerto Tim., Kabupaten Banyumas, Jawa Tengah",
    addressObj: {
      subDistrict: "Purwokerto Wetan",
      district: "Purwokerto Timur",
      city: "Banyumas",
      province: "Jawa Tengah",
      zipCode: "53111"
    },
    product: [
      {
        name: "Frisian Flag susu UHT 900ml",
        price: 13900
      },
      {
        name: "Alini Gula Halus 500gr",
        price: 20000
      },
      {
        name: "Telur 1kg",
        price: 13000
      },
      {
        name: "DOLPIN Garam Dapur 500gr",
        price: 10500
      },
      {
        name: "Beras Ramos 1kg",
        price: 14000
      },
      {
        name: "Bawang putih 1kg",
        price: 32000
      },
      {
        name: "Bawang merah 1kg",
        price: 37000
      },
      {
        name: "Santan sasa 65ml",
        price: 3500
      }
    ]
  }
]

const findAll = (_, res) => {
  return res.status(200).json({
    success: true,
    message: "success get suppliers",
    results: {
      suppliers
    }
  })
}

const findById = (req, res) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
      message: `success get ${id} supplier`,
      results: {
        supplier: suppliers[0]
      }
  })
}

const create = (req, res) => {
  return res.status(200).json({
    success: true,
      message: `success create supplier`,
      results: req.body
  })
}

const update = (req, res) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
      message: `success update supplier`,
      results: {
        id,
      }
  })
}

const _delete = (req, res) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
      message: `success delete supplier`,
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