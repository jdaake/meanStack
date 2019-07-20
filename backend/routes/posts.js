const express = require('express');
const router = express.Router();
const Post = require('../models/post');


// New post
router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      postId: createdPost._id
    });
  });
});

// update post
router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
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
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
      });
    })
    .catch(err => console.log(err));
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

module.export = router;
