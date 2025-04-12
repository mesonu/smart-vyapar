import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  EmojiObjects as EmojiObjectsIcon,
} from '@mui/icons-material';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://placehold.co/200x200/1976d2/white?text=JS',
      bio: '15+ years of experience in business software solutions',
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      image: 'https://placehold.co/200x200/1976d2/white?text=SJ',
      bio: 'Expert in cloud architecture and scalable systems',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Product',
      image: 'https://placehold.co/200x200/1976d2/white?text=MC',
      bio: 'Passionate about creating user-centric solutions',
    },
    {
      name: 'Emily Brown',
      role: 'Customer Success Lead',
      image: 'https://placehold.co/200x200/1976d2/white?text=EB',
      bio: 'Dedicated to ensuring customer satisfaction',
    },
  ];

  const values = [
    {
      icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
      title: 'Innovation',
      description: 'Constantly pushing boundaries to create cutting-edge solutions',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Customer First',
      description: 'Every decision is made with our customers in mind',
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality in everything we do',
    },
    {
      icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,
      title: 'Integrity',
      description: 'Building trust through transparency and honest practices',
    },
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        width: '100vw',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <LandingNav />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: 12,
            background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>
              About SmartShop
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}>
              Empowering businesses with innovative solutions for growth and success
            </Typography>
          </Container>
        </Box>

        {/* Story Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Our Story
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                Founded in 2020, SmartShop emerged from a simple vision: to make business management accessible and efficient for everyone. What started as a small team with big dreams has grown into a trusted partner for businesses worldwide.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                Today, we serve thousands of businesses across the globe, helping them streamline operations, boost productivity, and achieve their goals. Our journey is driven by continuous innovation and an unwavering commitment to our customers' success.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://placehold.co/600x400/1976d2/white?text=Our+Journey"
                alt="Our Journey"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Mission & Vision */}
        <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Our Mission
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                    To provide innovative and accessible business management solutions that empower organizations to thrive in the digital age. We strive to simplify complex processes and enable sustainable growth for our clients.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Our Vision
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                    To be the global leader in business management solutions, recognized for our innovation, reliability, and commitment to customer success. We envision a world where every business has the tools to reach its full potential.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Values Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Our Values
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto', color: 'text.secondary' }}
          >
            The principles that guide everything we do
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 4,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{value.icon}</Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Team Section */}
        <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
              Meet Our Team
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{ mb: 6, maxWidth: 800, mx: 'auto', color: 'text.secondary' }}
            >
              The passionate people behind SmartShop
            </Typography>
            <Grid container spacing={4}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      height: '100%',
                      borderRadius: 4,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <Avatar
                      src={member.image}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary.main" gutterBottom>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default AboutUs; 