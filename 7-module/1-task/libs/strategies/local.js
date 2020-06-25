const LocalStrategy = require('passport-local').Strategy;
<<<<<<< HEAD
const User = require('../../models/User.js')
=======
const User = require('../../models/User.js');
>>>>>>> 2a5edfe25a6d285f35208c8c1ad76b0a11592285

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
      User.findOne({email: email}, function(err, user) {
<<<<<<< HEAD
        if(err) { return done(err) };
        if(!user) {
          return done(null, false, 'Нет такого пользователя');
        }
        if(!user.checkPassword(password)) {
          return done(null, false, 'Неверный пароль');
        }
        return done(null, user);
=======
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
>>>>>>> 2a5edfe25a6d285f35208c8c1ad76b0a11592285
      });
    }
);
