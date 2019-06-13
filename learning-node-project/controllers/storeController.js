const mongoose = require('mongoose');

const Store = mongoose.model('Store');

exports.homepage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  console.log('Saved!');
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
  // res.redirect(`/store/${store.slug}`);
  res.redirect('/stores');
};

exports.getStores = async (req, res) => {
  // 1. querry db
  const stores = await Store.find();
  res.render('stores', {
    title: 'Stores',
    stores,
  });
};

exports.editStore = async (req, res) => {
  // 1. find
  const store = await Store.findOne({ _id: req.params.id });

  // 2 confir youare the owner
  // 3 render edit form
  res.render('editStore', {
    title: `Edit ${store.name}`,
    store,
  });
};


exports.updateStore = async (req, res) => {
  // find and update
  const store = await Store.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true, // return new store instead of old one
      runValidators: true,
    },
  ).exec();
    // redirect to the store
  req.flash('success', `Succesefully updated <strong>${store.slug}</storng>.
  <a href="/stores/${store.slug}">View store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};
