const Product = require('../models/Product.js');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;
  let products = [];

  try {
    const productList = subcategory ? await Product.find({subcategory}) : await Product.find({});

    products = productList.map((product) => ({
      id: product._id,
      category: product.category,
      description: product.description,
      images: product.images,
      price: product.price,
      subcategory: product.subcategory,
      title: product.title,
    }));

    ctx.status = 200;
    ctx.body = {products};
  } catch (err) {
    ctx.status = 400;
    ctx.body = {products};
  }
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {};
};

module.exports.productById = async function productById(ctx, next) {
  const [ , , , id] = ctx.request.url.split('/');

  try {
    const productList = await Product.find({_id: id});
    if (!productList.length) {
      ctx.status = 404;
      ctx.body = {};
    }
    else {
      const product = productList.map((product) => ({
        id: product._id,
        category: product.category,
        description: product.description,
        images: product.images,
        price: product.price,
        subcategory: product.subcategory,
        title: product.title,
      }));

      ctx.status = 200;
      ctx.body = { product: product[0] };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {};
  }
};
