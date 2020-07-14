const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;
  const user = await User.findOne({email});

  if (user) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
  } else {
    const verificationToken = uuid();
    const newUser = new User({email, displayName, verificationToken});
    await newUser.setPassword(password);
    await newUser.save();

    // send email
    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });
    ctx.body = {status: 'ok'};
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const user = await User.findOne({verificationToken});

  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  } else {
    user.verificationToken = undefined;
    await user.save();
    const token = uuid();

    ctx.body = {token};
  }
};
