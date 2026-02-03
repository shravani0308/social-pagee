import React, { useState } from 'react';
import { Paper, TextField, Button, Box, IconButton, Typography, Popover, CircularProgress } from '@mui/material';
import { PhotoCamera, EmojiEmotions } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import API from '../api/axios';

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content && !image) {
      alert('Please add content or image');
      return;
    }

    setIsPosting(true);
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setContent('');
      setImage(null);
      setPreview('');
      onPostCreated();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 2, sm: 1 }
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
      >
        Create Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPosting}
          sx={{ 
            mb: 2,
            '& .MuiInputBase-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        />
        {preview && (
          <Box sx={{ mb: 2 }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: 300,
                borderRadius: 8,
                objectFit: 'cover'
              }} 
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <IconButton 
              color="primary" 
              component="label"
              size="small"
              disabled={isPosting}
            >
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              <PhotoCamera fontSize="small" />
            </IconButton>
            <IconButton 
              color="primary" 
              onClick={(e) => setEmojiAnchor(e.currentTarget)}
              size="small"
              disabled={isPosting}
            >
              <EmojiEmotions fontSize="small" />
            </IconButton>
          </Box>
          <Button 
            type="submit" 
            variant="contained"
            size="small"
            disabled={isPosting}
            sx={{ px: { xs: 2, sm: 3 }, minWidth: 80 }}
          >
            {isPosting ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </Box>
      </Box>
      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{
          '& .MuiPopover-paper': {
            maxWidth: { xs: '90vw', sm: 'auto' }
          }
        }}
      >
        <EmojiPicker 
          onEmojiClick={handleEmojiClick}
          width={window.innerWidth < 600 ? 280 : 350}
        />
      </Popover>
    </Paper>
  );
}

export default CreatePost;
