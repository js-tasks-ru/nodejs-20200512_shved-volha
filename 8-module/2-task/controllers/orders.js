const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapProduct = require('../mappers/product');

module.exports.checkout = async function checkout(ctx, next) {
  const {user} = ctx;
  const {product, phone, address} = ctx.request.body;

  if (!user) {
    ctx.status = 401;
    return next();
  }

  const order = new Order({user, product, phone, address});
  await order.save();
  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order._id,
      product: {title: product},
    },
    to: user.email,
    subject: 'Заказ',
  });

  ctx.body = {order: order._id};

  return next();
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const {user} = ctx;
  const ordersList = await Order.find({user: user._id}).populate('product');

  const orders = ordersList.map((order) => {
    return {
      id: order._id,
      user: order.user,
      address: order.address,
      phone: order.phone,
      product: {
        id: order.product.id,
        title: order.product.title,
        images: order.product.images,
        category: order.product.category,
        subcategory: order.product.subcategory,
        price: order.product.price,
        description: order.product.description,
      },
    };
  });

  ctx.body = {orders};
};
