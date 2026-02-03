import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Collapse,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline, Share } from '@mui/icons-material';
import API from '../api/axios';

function PostCard({ post, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isLiked = post.likes.some(like => like.userId === currentUser?.id);
  const isOwnPost = post.userId === currentUser?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOwnPost) {
      checkFollowing();
    }
  }, [post.userId]);

  const checkFollowing = async () => {
    try {
      const { data } = await API.get(`/users/${post.userId}/is-following`);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await API.post(`/users/${post.userId}/follow`);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleLike = async () => {
    try {
      await API.post(`/posts/${post._id}/like`);
      onUpdate();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await API.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      onUpdate();
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post._id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.username}`,
          text: post.content,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSnackbar(true);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 1 }
        }}
      >
        <CardHeader
          avatar={
            <Avatar 
              sx={{ 
                bgcolor: '#1976d2', 
                cursor: 'pointer',
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 }
              }}
              onClick={handleProfileClick}
            >
              {post.username[0].toUpperCase()}
            </Avatar>
          }
          title={
            <Typography 
              variant="subtitle1" 
              sx={{ 
                cursor: 'pointer', 
                fontWeight: 'bold',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
              onClick={handleProfileClick}
            >
              {post.username}
            </Typography>
          }
          subheader={
            <Typography 
              variant="caption" 
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              {formatDate(post.createdAt)}
            </Typography>
          }
          action={
            !isOwnPost && (
              <Button
                size="small"
                variant={isFollowing ? 'outlined' : 'contained'}
                onClick={handleFollow}
                sx={{ 
                  mt: 1,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  px: { xs: 1, sm: 2 }
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )
          }
          sx={{ pb: { xs: 1, sm: 2 } }}
        />
      {post.content && (
        <CardContent sx={{ py: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="body1"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {post.content}
          </Typography>
        </CardContent>
      )}
      {post.imageUrl && (
        <CardMedia
          component="img"
          image={post.imageUrl}
          alt="Post image"
          sx={{ 
            maxHeight: { xs: 400, sm: 500 }, 
            objectFit: 'contain',
            width: '100%'
          }}
        />
      )}
      <CardActions 
        disableSpacing
        sx={{ px: { xs: 1, sm: 2 } }}
      >
        <IconButton 
          onClick={handleLike}
          size="small"
        >
          {isLiked ? <Favorite color="error" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
        </IconButton>
        <Typography 
          variant="body2"
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() => post.likes.length > 0 && setShowLikes(true)}
        >
          {post.likes.length}
        </Typography>
        <IconButton 
          onClick={() => setShowComments(!showComments)}
          size="small"
        >
          <ChatBubbleOutline fontSize="small" />
        </IconButton>
        <Typography 
          variant="body2"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {post.comments.length}
        </Typography>
        <IconButton 
          onClick={handleShare}
          size="small"
        >
          <Share fontSize="small" />
        </IconButton>
      </CardActions>
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CardContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Box component="form" onSubmit={handleComment} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ 
                mb: 1,
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="small"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Comment
            </Button>
          </Box>
          {post.comments.map((comment, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle2" 
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {comment.username}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {comment.text}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {formatDate(comment.createdAt)}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Collapse>
    </Card>
    <Snackbar
      open={shareSnackbar}
      autoHideDuration={3000}
      onClose={() => setShareSnackbar(false)}
      message="Link copied to clipboard!"
    />
    
    <Dialog 
      open={showLikes} 
      onClose={() => setShowLikes(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Likes ({post.likes.length})
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          {post.likes.map((like, index) => (
            <ListItem 
              key={index}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => {
                setShowLikes(false);
                navigate(`/profile/${like.userId}`);
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40 }}>
                  {like.username[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={like.username}
                primaryTypographyProps={{
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
    </>
  );
}

export default PostCard;
