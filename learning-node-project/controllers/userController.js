const mongoose = require('mongoose');
const promisify = require('es6-promisify');

const User = mongoose.model('User');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Log In' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
  // using expressValidator
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That EMail is not valid').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extensions: false,
    gmail_remove_subaddres: false,
  });
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Confirm Password cannot be blank!').notEmpty();
  req.checkBody('password-confirm', 'Your password do not match!').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    });
    return; // stop from running
  }
  next(); // no errors proceed to next middleware
};

exports.register = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = new User({
    email,
    name,
  });
  // using passportLocalMongoose to register (User.register)

  const register = promisify(User.register, User);

  await register(user, password);
  next();
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit you account' });
};

exports.updateAccount = async (req, res) => {
  const { name, email } = req.body;
  const updates = {
    name,
    email,
  };

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    {
      new: true,
      runValidators: true,
      context: 'query',
    },
  );
  req.flash('success', 'Your profile was successfully updated')
  res.redirect('back');
};
