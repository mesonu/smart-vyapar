import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Stack,
  Divider,
} from '@mui/material';
import {
  Store as StoreIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Support as SupportIcon,
  Sync as SyncIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../components/LandingNav';
import LandingFooter from '../components/LandingFooter';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <StoreIcon />,
      title: 'Smart Inventory Management',
      description: 'Real-time tracking, automated reordering, and stock alerts',
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Advanced Analytics',
      description: 'Data-driven insights for better business decisions',
    },
    {
      icon: <PaymentIcon />,
      title: 'Seamless Billing',
      description: 'Quick invoicing, payment tracking, and GST compliance',
    },
    {
      icon: <PeopleIcon />,
      title: 'Customer Management',
      description: 'Track customer behavior and improve engagement',
    },
    {
      icon: <InventoryIcon />,
      title: 'Stock Analysis',
      description: 'Plan stock based on days and analyze items needing reorder',
    },
    {
      icon: <SpeedIcon />,
      title: 'Fast Billing',
      description: '40% faster billing with shortcuts and barcode scanning',
    },
    {
      icon: <SecurityIcon />,
      title: 'GST Compliance',
      description: 'Generate GST-compliant invoices and file returns easily',
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Business Insights',
      description: 'Get detailed reports and analytics for better decision making',
    },
  ];

  const stats = [
    { value: '20B+', label: 'Invoices Processed Per Year', icon: <TrendingUpIcon /> },
    { value: '100B$', label: 'Transactions Processed Per Year', icon: <PaymentIcon /> },
    { value: '50%', label: 'Businesses Run On Our Software', icon: <BusinessIcon /> },
    { value: '1M+', label: 'Businesses Served Worldwide', icon: <PeopleIcon /> },
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Store Owner',
      image: 'https://placehold.co/100x100/1976d2/white?text=RK',
      content: 'SmartShop has transformed our business operations. The inventory management is seamless, and customer satisfaction has improved significantly.',
    },
    {
      name: 'Priya Sharma',
      role: 'Business Manager',
      image: 'https://placehold.co/100x100/1976d2/white?text=PS',
      content: 'The analytics and reporting features help us make better decisions. Our sales have increased by 30% since we started using SmartShop.',
    },
    {
      name: 'Amit Patel',
      role: 'Retail Chain Owner',
      image: 'https://placehold.co/100x100/1976d2/white?text=AP',
      content: 'Managing multiple stores has never been easier. The centralized dashboard gives us complete control over our business.',
    },
  ];

  const benefits = [
    {
      icon: <SpeedIcon />,
      title: 'Save Time',
      description: 'Automate routine tasks and focus on growing your business',
    },
    {
      icon: <SecurityIcon />,
      title: 'Stay Secure',
      description: 'Bank-grade security to protect your business data',
    },
    {
      icon: <SyncIcon />,
      title: 'Stay Updated',
      description: 'Real-time updates and notifications for better decision making',
    },
    {
      icon: <SupportIcon />,
      title: '24/7 Support',
      description: 'Round-the-clock technical support for your business',
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
      
      {/* Hero Section */}
      <Box
        sx={{
          width: '100vw',
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/pattern.png) repeat',
            opacity: 0.1,
          },
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h1"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    lineHeight: 1.2,
                    background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Transform Your Business with SmartShop
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                  }}
                >
                  The all-in-one solution for modern businesses. Streamline operations,
                  boost sales, and grow your business with our powerful platform.
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  sx={{ 
                    mt: 6,
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      color: 'primary.main',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/demo')}
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      borderColor: '#fff',
                      color: '#fff',
                      borderWidth: 2,
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: '#e3f2fd',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Watch Demo
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: '20px',
                    transform: 'rotate(-3deg)',
                  },
                }}
              >
                <img
                  src="https://placehold.co/600x400/1976d2/white?text=Dashboard+Preview"
                  alt="Dashboard Preview"
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    position: 'relative',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section with Enhanced Design */}
      <Box 
        sx={{ 
          py: 10,
          bgcolor: '#fff',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), transparent)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 8,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            Trusted by Businesses Worldwide
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 8,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Join thousands of businesses that trust SmartShop to manage their operations and drive growth
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      fontSize: '2rem',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section with Enhanced Design */}
      <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 8,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            Features at Glance
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      '& .feature-icon': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section with Enhanced Design */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container>
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 8,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            Why Choose Us?
          </Typography>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <List>
                  {[
                    {
                      primary: "GST Compliant",
                      secondary: "Send GST compliant invoices, generate reports, and file returns without hassles",
                      icon: <VerifiedIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    },
                    {
                      primary: "Easy Implementation",
                      secondary: "Local support centers, tutorial videos, and dedicated customer care",
                      icon: <SpeedIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    },
                    {
                      primary: "Customizable",
                      secondary: "Automate workflows, personalize invoices, and configure as per your needs",
                      icon: <SyncIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    }
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        sx={{ 
                          py: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(10px)',
                          }
                        }}
                      >
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                              {item.primary}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                              {item.secondary}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < 2 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <List>
                  {[
                    {
                      primary: "Collaborative",
                      secondary: "Connect with suppliers, send orders, and manage invoices seamlessly",
                      icon: <PeopleIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    },
                    {
                      primary: "Mobile Access",
                      secondary: "Manage your business from anywhere with our mobile apps",
                      icon: <BusinessIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    },
                    {
                      primary: "Regular Updates",
                      secondary: "Continuous improvements and new features to enhance your experience",
                      icon: <SupportIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    }
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        sx={{ 
                          py: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(10px)',
                          }
                        }}
                      >
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                              {item.primary}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                              {item.secondary}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < 2 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section with Enhanced Design */}
      <Box 
        sx={{ 
          py: 10, 
          bgcolor: '#f8f9fa',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), transparent)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 8,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            What Our Customers Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 3 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} sx={{ color: '#ffc107', fontSize: 24 }} />
                      ))}
                    </Box>
                    <Typography 
                      color="text.secondary" 
                      sx={{ 
                        mb: 4,
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        fontStyle: 'italic',
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={testimonial.image}
                        sx={{ 
                          width: 64,
                          height: 64,
                          border: '3px solid',
                          borderColor: 'primary.main',
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Integration Partners Section */}
      <Box sx={{ py: 10, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 8,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            Seamless Integrations
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 8,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Connect with your favorite tools and services to streamline your workflow
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { name: 'Payment Gateway', icon: 'https://placehold.co/64x64/1976d2/white?text=PG' },
              { name: 'Accounting Software', icon: 'https://placehold.co/64x64/1976d2/white?text=AS' },
              { name: 'E-commerce Platform', icon: 'https://placehold.co/64x64/1976d2/white?text=EP' },
              { name: 'CRM System', icon: 'https://placehold.co/64x64/1976d2/white?text=CRM' }
            ].map((partner, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={partner.icon}
                    alt={partner.name}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '12px',
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {partner.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Achievement Section */}
      <Box sx={{ py: 10, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 8,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                borderRadius: 2,
                bgcolor: 'primary.main',
              },
            }}
          >
            Our Achievements
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 8,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Recognition and awards that demonstrate our commitment to excellence
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Best SaaS Solution',
                year: '2023',
                organization: 'Tech Excellence Awards'
              },
              {
                title: 'Innovation in Business',
                year: '2023',
                organization: 'Business Technology Forum'
              },
              {
                title: 'Customer Choice Award',
                year: '2023',
                organization: 'Industry Leaders'
              }
            ].map((achievement, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <StarIcon sx={{ color: '#ffd700', fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {achievement.title}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {achievement.year}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {achievement.organization}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Enhanced CTA Section */}
      <Box
        sx={{
          py: 10,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(/pattern.png) repeat',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            Ready to Transform Your Business?
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 6, 
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Join thousands of businesses already using SmartShop to streamline operations and boost growth
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                backgroundColor: '#fff',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                borderColor: '#fff',
                color: '#fff',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#e3f2fd',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Contact Sales
            </Button>
          </Stack>
        </Container>
      </Box>

      <LandingFooter />
    </Box>
  );
};

export default LandingPage; 