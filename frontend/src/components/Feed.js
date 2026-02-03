import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import API from '../api/axios';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

function Feed({ setAuth }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Social Feed
          </Typography>
          <Typography 
            sx={{ 
              mr: { xs: 1, sm: 2 },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {user?.username}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            size="small"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="md" 
        sx={{ 
          mt: { xs: 2, sm: 4 }, 
          mb: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <CreatePost onPostCreated={fetchPosts} />
        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
          ))}
        </Box>
      </Container>
    </>
  );
}

export default Feed;
