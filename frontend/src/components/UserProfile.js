import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  Box,
  Grid,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import API from '../api/axios';
import PostCard from './PostCard';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
    if (userId !== currentUser?.id) {
      checkFollowing();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/${userId}`);
      setProfile(data.user);
      setPosts(data.posts);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const checkFollowing = async () => {
    try {
      const { data } = await API.get(`/users/${userId}/is-following`);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await API.post(`/users/${userId}/follow`);
      setIsFollowing(data.isFollowing);
      setProfile(prev => ({
        ...prev,
        followersCount: data.followersCount
      }));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="md" 
        sx={{ 
          mt: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            mb: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, sm: 1 }
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            <Avatar
              sx={{ 
                width: { xs: 60, sm: 80 }, 
                height: { xs: 60, sm: 80 }, 
                bgcolor: '#1976d2', 
                mr: { xs: 0, sm: 3 },
                mb: { xs: 2, sm: 0 }
              }}
            >
              {profile.username[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                {profile.username}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {profile.email}
              </Typography>
            </Box>
            {userId !== currentUser?.id && (
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                onClick={handleFollow}
                size="small"
                sx={{ 
                  mt: { xs: 2, sm: 0 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Box>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={4}>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {posts.length}
              </Typography>
              <Typography 
                variant="body2" 
                align="center" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                Posts
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {profile.followersCount}
              </Typography>
              <Typography 
                variant="body2" 
                align="center" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                Followers
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {profile.followingCount}
              </Typography>
              <Typography 
                variant="body2" 
                align="center" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
              >
                Following
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: '1rem', sm: '1.25rem' },
            px: { xs: 1, sm: 0 }
          }}
        >
          Posts
        </Typography>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onUpdate={fetchProfile} />
        ))}
      </Container>
    </>
  );
}

export default UserProfile;
