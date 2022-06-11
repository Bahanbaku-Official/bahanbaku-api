const datastore = require("../database/datastore");
const { getSupplierSpecificInformation, getSupplierAllInformation, magicCalculation } = require("../helpers/ingredients/magicCalculation");

const getIngredient = async (req, res, next) => {
  const { id } = req.user;
  const { search } = req.query;
  const querySupplier = datastore.createQuery("Prod", "supplier");
  const queryProfile = datastore
    .createQuery("Prod", "user")
    .filter("id", "=", id)
    .limit(1);
  const distanceLimit = 50000;

  try {
    const suppliers = await datastore.runQuery(querySupplier);
    const profile = await datastore.runQuery(queryProfile);

    if (suppliers[0].length === 0 || profile[0].length === 0) {
      next('404,supplier or profile not found');
      return;
    }

    const ingredients = search.split(',');
    const shippings = profile[0][0].shipping;

    suppliersBasedOnDistance = [[], []];
    suppliersInformationBasedOnDistance = [[], []];

    shippings.forEach((shipping) => {
      supplierSpecificInfo = getSupplierSpecificInformation(
        suppliers[0],
        shipping.id
      )
      supplierGeneralInfo = getSupplierAllInformation(
        suppliers[0],
        shipping.id
      )

      // Init
      supplierData = {
        supplierId: shipping.id,
        shippingCost: shipping.cost,
        ...supplierSpecificInfo,
        products: [],
        totalPrice: shipping.cost,
        emptyIngredient: []
      }

      if (shipping.distance <= distanceLimit) {
        suppliersBasedOnDistance[0].push(supplierData);
        suppliersInformationBasedOnDistance[0].push(supplierGeneralInfo)
      } else {
        suppliersBasedOnDistance[1].push(supplierData);
        suppliersInformationBasedOnDistance[1].push(supplierGeneralInfo)
      }
    })

    outputObject = {};

    for (let i = 0; i < suppliersBasedOnDistance.length; i++) {
      const supplierSpecificInformations = suppliersBasedOnDistance[i];
      const supplierAllInformations = suppliersInformationBasedOnDistance[i];

      bestSupplierList = magicCalculation(
        ingredients,
        supplierSpecificInformations,
        supplierAllInformations,
        shippings,
      )

      if (i === 0) {
        outputObject.under = [...bestSupplierList];
      } else {
        outputObject.above = [...bestSupplierList];
      }
    }

    return res.status(200).json({
      status: true,
      message: 'success predict ingredients',
      results: outputObject,
    })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getIngredient,
}