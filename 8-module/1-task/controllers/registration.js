const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.user;
  const user = await User.findOne({ email });

  if(user) {
    ctx.status = 400;
    ctx.body = {errors: { email: 'Такой email уже существует' }};
  }
  else {
    const verificationToken = uuid();
    await User.create({ email, displayName, password, verificationToken });
    //send email
    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });
  }
  return next();
};

module.exports.confirm = async (ctx, next) => {
  const parsedUrl = ctx.request.url.split('/');
  const verificationToken = parsedUrl[parsedUrl.length - 1];

  const user = await User.findOne({ verificationToken });

  if (!user){
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
  else {
    await User.update({verificationToken: ''});

  }
  return next();
};
