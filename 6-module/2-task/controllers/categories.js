const Category = require('../models/Category.js');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categoryList = await Category.find({});
  const categories = categoryList.map((category) => {
    const subcategories = category.subcategories.map((subcategory) => ({
      id: subcategory._id,
      title: subcategory.title,
    }));

    return {
      id: category._id,
      title: category.title,
      subcategories,
    };
  });

  ctx.status = 200;
  ctx.body = { categories };

  return next();
};
