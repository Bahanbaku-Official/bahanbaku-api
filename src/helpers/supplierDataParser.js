const parseSupplierData = (datastore, supplierData) => {
  const supplierExtract = supplierData[0][0];
  return {
    key: supplierExtract[datastore.KEY],
    createdAt: supplierExtract.createdAt,
    updatedAt: supplierExtract.updatedAt,
    id: supplierExtract.id,
    name: supplierExtract.name,
    origin: supplierExtract.origin,
    address: supplierExtract.address,
    addressObj: supplierExtract.addressObj,
    product: supplierExtract.product,
    contact: supplierExtract.contact,
    image: supplierExtract.image,
  };
}

module.exports = parseSupplierData;