const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User.js');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email: email}, function(err, user) {
        if (err) {
          return done(err);
        };

        if (!user) {
          return done(null, false, 'Нет такого пользователя');
        };

        user.checkPassword(password).then((res) => {
          if (!res) {
            return done(null, false, 'Неверный пароль')
          };
          return done(null, user);
        });
      });
    }
);
