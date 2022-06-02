const { getSupplier } = require("./supplier");
const { profile } = require("./user");

function compareByIngredientSupplierHave(a, b) {
  if (a["products"].length < b["products"].length) {
    return -1;
  }
  if (a["products"].length > b["products"].length) {
    return 1;
  }
  return 0;
}

function compareByIngredientPricePerSupplier(a, b) {
  if (a["productPlusShippingPrice"] < b["productPlusShippingPrice"]) {
    return -1;
  }
  if (a["productPlusShippingPrice"] > b["productPlusShippingPrice"]) {
    return 1;
  }
  return 0;
}

function getSupplierShippingCost(userShippingObject, supplierId) {
  for (let i = 0; i < userShippingObject.length; i++) {
    const shippingObject = userShippingObject[i];
    if (shippingObject["id"] === supplierId) {
      return shippingObject["cost"];
    }
  }
}

function productExhausted(val) {
  return val === true;
}

// To get supplier index from supplier list
function checkSupplierExist(supplierList, supplierId) {
  for (let i = 0; i < supplierList.length; i++) {
    const supplier = supplierList[i];
    if (supplier["id"] === supplierId) {
      return i;
    }
  }
  return -1;
}

function sortByTotalPrice(a, b) {
  if (a["totalPrice"] < b["totalPrice"]) {
    return -1;
  }
  if (a["totalPrice"] > b["totalPrice"]) {
    return 1;
  }
  return 0;
}

function getSupplierSpecificInformation(supplierList, supplierId) {
  supplierInfoObject = {};
  for (let index = 0; index < supplierList.length; index++) {
    const supplier = supplierList[index];
    if (supplier.id === supplierId) {
      supplierInfoObject["supplierName"] = supplier.name;
      supplierInfoObject["supplierContact"] = supplier.contact;
      supplierInfoObject["missingProduct"] = [];
      break;
    }
  }
  return supplierInfoObject;
}

function getSupplierAllInformation(supplierList, supplierId) {
  supplierInfoObject = {};
  for (let index = 0; index < supplierList.length; index++) {
    const supplier = supplierList[index];
    if (supplier.id === supplierId) {
      return supplier;
    }
  }
}

function supplierHasAtLeastOneIngredient(supplier) {
  return supplier["products"].length > 0;
}

function magicCalculation(
  listIngredientArray,
  listSuppliersIngredientsData,
  listSuppliersData
) {
  // This is where the magic happen
  listSupplierIngredientsData = [...listSuppliersIngredientsData];
  listSupplierIngredientPrice = Array.from(
    { length: listIngredient.length },
    () => []
  ); // Abracadabra !!!
  listSupplierIds = [];
  listSupplier = [...listSuppliersData];
  listIngredient = listIngredientArray;

  counter = 0;

  listSupplier.forEach((supplierObject) => {
    // Get user shipping cost on this supplier

    for (let j = 0; j < listIngredient.length; j++) {
      ingredientName = listIngredient[j];

      listProduct = supplierObject.product; // Array

      isIngredientExist = false;
      for (let k = 0; k < listProduct.length; k++) {
        productName = listProduct[k].name;
        productPrice = listProduct[k].price;
        productNameLower = productName.toLowerCase();
        ingredientNameLower = ingredientName.toLowerCase();
        if (productNameLower.includes(ingredientNameLower)) {
          // Check if ingredient exist
          isIngredientExist = true;
          productObject = {
            productName: productName,
            productPrice: productPrice,
          };

          // console.log(listSupplierIngredientsData[counter]);
          listSupplierIngredientsData[counter]["products"].push(productObject); // Ingredient exist
          listSupplierIngredientsData[counter]["totalPrice"] += productPrice;

          supplierIngredientPriceObject = {
            supplierId: supplierObject.id,
            supplierName: supplierObject.name,
            productName: productName,
            productPrice: productPrice,
            productPlusShippingPrice:
              productPrice +
              listSupplierIngredientsData[counter]["shippingCost"],
            supplierContact: supplierObject.contact,
          };
          listSupplierIngredientPrice[j].push(supplierIngredientPriceObject);
        }
      }
      if (isIngredientExist === false) {
        // listSupplierIngredientsData[counter]["products"].push(ingredientName); // Ingredient doesn't exist
        listSupplierIngredientsData[counter]["emptyIngredient"].push(j); // Push index of empty ingredient
        listSupplierIngredientsData[counter]["missingProduct"].push(
          ingredientName
        );
      }
    }
    counter += 1;
  });

  listSupplierIngredientsData = listSupplierIngredientsData.filter(
    supplierHasAtLeastOneIngredient
  );
  listSupplierIngredientsData.sort(compareByIngredientSupplierHave);
  temp = [];
  listSupplierIngredientPrice.forEach((arr) => {
    arr.sort(compareByIngredientPricePerSupplier);
    temp.push(arr);
  });
  listSupplierIngredientPrice = [...temp];

  // console.log(listSupplierIngredientsData);
  // console.log(listSupplierIngredientPrice);

  // Second phase, fill empty product
  const maxSupplierConcurrency = 3;
  const maxRanking = 10;
  listBestSupplier = [];

  for (let i = 0; i < listSupplierIngredientsData.length; i++) {
    supplier = listSupplierIngredientsData[i];
    console.log(supplier);

    emptyIngredient = supplier["emptyIngredient"];
    emptyIngredientCount = emptyIngredient.length;
    currentSupplierTotalPrice = supplier["totalPrice"];
    delete supplier["emptyIngredient"];
    delete supplier["totalPrice"];

    totalSupplierConcurrency = 0;

    if (emptyIngredientCount > 0) {
      // Init value
      productListIndex = Array.from({ length: emptyIngredientCount }, () => 0);
      productListExhausted = Array.from(
        { length: emptyIngredientCount },
        () => false
      );

      while (totalSupplierConcurrency < maxSupplierConcurrency) {
        completeSupplier = {
          suppliers: [supplier],
          totalPrice: currentSupplierTotalPrice,
        };
        for (let j = 0; j < emptyIngredientCount; j++) {
          ingredientMissingIndex = emptyIngredient[j]; // Return index of ingredient
          // If ingredient not exist anywhere
          isIngredientExist =
            listSupplierIngredientPrice[ingredientMissingIndex].length > 0;          
          if (isIngredientExist) {
            // Fill supplier's missing ingredient with best ingredient
            productData =
              listSupplierIngredientPrice[ingredientMissingIndex][
                productListIndex[j]
              ];

            newSupplierId = productData["supplierId"];
            newSupplierName = productData["supplierName"];
            newSupplierContact = productData["supplierContact"];
            shippingCost = getSupplierShippingCost(
              userShippingCost,
              newSupplierId
            );
            supplierExistIndex = checkSupplierExist(
              completeSupplier["suppliers"],
              newSupplierId
            );

            delete productData["supplierId"];
            delete productData["supplierName"];
            delete productData["productPlusShippingPrice"];

            if (supplierExistIndex === -1) {
              // If supplier is new
              supplierObject = {
                supplierId: newSupplierId,
                supplierName: newSupplierName,
                supplierContact: newSupplierContact,
                shippingCost: shippingCost,
                products: [productData],
              };
              // console.log(productData);
              completeSupplier["suppliers"].push(supplierObject);
              completeSupplier["totalPrice"] +=
                productData.productPrice + shippingCost;
            } else {
              // If supplier is exist
              completeSupplier["suppliers"][supplierExistIndex].push(
                productData
              );
              completeSupplier["totalPrice"] += productData.productPrice;
            }

            productListIndex[j]++;
          }
          if (
            productListIndex[j] ===
            listSupplierIngredientPrice[ingredientMissingIndex].length
          ) {
            productListExhausted[j] = true;
          }
        }

        // New 
        completeSupplier["missingProduct"] = completeSupplier["suppliers"][0]["missingProduct"]
        delete completeSupplier["suppliers"][0]["missingProduct"]
        // End New
        listBestSupplier.push(completeSupplier);
        if (productListExhausted.every(productExhausted)) {
          // console.log("All product exhausted");
          break;
        }
      }
    } else {
      completeSupplier = {
        suppliers: [supplier],
        totalPrice: currentSupplierTotalPrice,
      };
      listBestSupplier.push(completeSupplier);
    }
  }
  listBestSupplier.sort(sortByTotalPrice);
  // console.log("LIST BEST SUPPLIER");
  // console.log(listBestSupplier);
  if (listBestSupplier.length > maxRanking) {
    return listBestSupplier.slice(0, maxRanking);
  } else {
    return listBestSupplier;
  }
}

async function getIngredient(datastore, id, ingredientString) {
  listSupplier = await getSupplier(datastore);
  userData = await profile(datastore, id);

  const distanceDifferentiation = 50000;

  listSupplierIngredientsData = [];
  listIngredient = ingredientString.split(","); // Array Ingredient that being searched
  userShippingCost = userData["shipping"];

  listSupplierBasedOnDistance = [[], []]; // The first one for short distance , the second one for long distance
  listSupplierInformationBasedOnDistance = [[], []];

  userShippingCost.forEach((shippingObject) => {
    supplierSpecificInfo = getSupplierSpecificInformation(
      listSupplier,
      shippingObject.id
    );
    supplierGeneralInfo = getSupplierAllInformation(
      listSupplier,
      shippingObject.id
    );
    // Init object
    supplierData = {
      supplierId: shippingObject.id,
      shippingCost: shippingObject.cost,
      ...supplierSpecificInfo,
      products: [], // Ingredient array of object , -1 if ingredient not exist
      totalPrice: shippingObject.cost, // init total price with shipping cost
      emptyIngredient: [],
    };
    if (shippingObject.distance <= distanceDifferentiation) {
      listSupplierBasedOnDistance[0].push(supplierData);
      listSupplierInformationBasedOnDistance[0].push(supplierGeneralInfo);
    } else {
      listSupplierBasedOnDistance[1].push(supplierData);
      listSupplierInformationBasedOnDistance[1].push(supplierGeneralInfo);
    }
  });

  // console.log(listSupplierBasedOnDistance);
  // console.log(listSupplierInformationBasedOnDistance);

  outputObject = {};

  for (let index = 0; index < listSupplierBasedOnDistance.length; index++) {
    const listOfSuppliersSpecificInformation =
      listSupplierBasedOnDistance[index];
    const listOfSuppliersAllInformation =
      listSupplierInformationBasedOnDistance[index];
    bestSupplierList = magicCalculation(
      listIngredient,
      listOfSuppliersSpecificInformation,
      listOfSuppliersAllInformation
    );
    // console.log("BEST SUPPLIER LIST");
    // console.log(bestSupplierList);
    // console.log("END SUPPLIER LIST");
    if (index === 0) {
      outputObject["under"] = [...bestSupplierList];
      // console.log(outputObject["under"]);
    } else {
      outputObject["above"] = [...bestSupplierList];
      // console.log(outputObject["above"]);
    }
  }
  return outputObject;
  // console.log(outputObject);
}

module.exports = {
  getIngredient,
};
