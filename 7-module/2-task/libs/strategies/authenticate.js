const User = require('../../models/User.js');

module.exports = function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');
  User.findOne({email: email}, function(err, user) {
    if (err) {
      return done(err);
    };

    if (!user) {
      const newUser = new User({email, displayName});
      newUser.save()
          .then((res) => {
            return done(null, res);
          })
          .catch((err) => {
            return done(err);
          });
    } else {
      return done(null, user);
    }
  });
};
