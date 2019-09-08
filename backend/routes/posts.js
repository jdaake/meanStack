const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(null, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// New post
router.post('', multer({
    storage: storage
  }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + '/images/' + req.file.filename
    });
    console.log(post);
    post.save().then(createdPost => {
      res.status(201).json({
        message: 'Post added successfully!',
        post: {
          // use spread operator to get createdPost title, content, and imagePath
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  });

// update post
router.put('/:id', multer({
    storage: storage
  }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({
        _id: req.params.id
      }, post)
      .then(results => {
        res.status(200).json({
          message: 'Post updated successfully!'
        });
      })
      .catch(err => console.log(err));
  });

// Get all posts
router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.then((documents) => {
      fetchedPosts = documents;
      return Post.count()

    })
    .then(count => {
      res.status(200).json({
        message: 'Post fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

// get by ID
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      return res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  });
});

// Delete posts
router.delete('/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
      _id: req.params.id
    })
    .then(results => console.log(results))
    .catch(err => console.log(err));
  res.status(200).json({
    message: 'Post Deleted'
  });
});

module.exports = router;
