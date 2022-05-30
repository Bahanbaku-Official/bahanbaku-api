const parseRecipeData = (datastore, recipeData) => {
  const recipeExtract = recipeData[0][0];
  return {
    key: recipeExtract[datastore.KEY],
    createdAt: recipeExtract.createdAt,
    updatedAt: recipeExtract.updatedAt,
    id: recipeExtract.id,
    title: recipeExtract.title,
    image: recipeExtract.image,
    servings: recipeExtract.servings,
    times: recipeExtract.times,
    description: recipeExtract.description,
    ingredients: recipeExtract.ingredients,
    steps: recipeExtract.steps,
    rating: recipeExtract.rating,
    author: recipeExtract.author,
    totalViews: recipeExtract.totalViews,
    tags: recipeExtract.tags,
  }
}

module.exports = parseRecipeData;