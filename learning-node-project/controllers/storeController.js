const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  },
};

const Store = mongoose.model('Store');

exports.homepage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skips to next middleware
    return;
  }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  // now we resize
  const photo = await jimp.read(req.file.buffer);

  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
};


exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  console.log('Saved!');
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
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
  req.body.location.type = 'Point';

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
  req.flash('success', `Successfully updated <strong>${store.slug}</storng>.
  <a href="/stores/${store.slug}">View store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({
    slug: req.params.slug,
  });
  if (!store) {
    next();
    return;
  }
  res.render('store', {
    store,
    title: store.name,
  });
};

exports.getStoresByTags = async (req, res) => {
  const { tag } = req.params;

  const tagQuery = tag || { $exists: true };

  const tagsPromise = Store.getTagsList();
  const storePromise = Store.find({
    tags: tagQuery,
  });

  const [tags, stores] = await Promise.all([
    tagsPromise,
    storePromise,
  ]);

  res.render('tag', {
    tags,
    title: 'Tags ',
    tag,
    stores,
  });
};
