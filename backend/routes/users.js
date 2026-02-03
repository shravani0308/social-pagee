const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        createdAt: user.createdAt
      },
      posts
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Follow/Unfollow user
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    if (req.params.userId === req.user.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.userId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(req.params.userId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.userId
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user.userId
      );
    } else {
      // Follow
      currentUser.following.push(req.params.userId);
      userToFollow.followers.push(req.user.userId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Check if following
router.get('/:userId/is-following', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const isFollowing = currentUser.following.includes(req.params.userId);
    res.json({ isFollowing });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
