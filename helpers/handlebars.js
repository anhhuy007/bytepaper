import Handlebars from "handlebars";

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper(
  "hasSubCategorySelected",
  function (subCategories, currentCategoryId) {
    return subCategories.some(
      (subCategory) => subCategory.subId === currentCategoryId
    );
  }
);

Handlebars.registerHelper("or", function (a, b) {
  return a || b;
});
