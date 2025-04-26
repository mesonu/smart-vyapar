import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import LandingNav from "../components/home/LandingNav";
import LandingFooter from "../components/home/LandingFooter";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSnackbar({
      open: true,
      message: "Thank you for your message. We will get back to you soon!",
      severity: "success",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const contactInfo = [
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: "Email",
      details: ["support@smartshop.com", "sales@smartshop.com"],
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40 }} />,
      title: "Address",
      details: ["123 Business Avenue", "Suite 456", "New York, NY 10001"],
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        overflowX: "hidden",
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
            background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              sx={{ maxWidth: 800, mx: "auto", opacity: 0.9 }}
            >
              We're here to help and answer any questions you might have
            </Typography>
          </Container>
        </Box>

        {/* Contact Information */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {contactInfo.map((info, index) => (
              <Grid size={{xs:12, sm:6, md:3}} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 4,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ color: "primary.main", mb: 2 }}>{info.icon}</Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 700 }}
                  >
                    {info.title}
                  </Typography>
                  {info.details.map((detail, idx) => (
                    <Typography
                      key={idx}
                      variant="body1"
                      color="text.secondary"
                    >
                      {detail}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Contact Form Section */}
        <Box sx={{ bgcolor: "#f8f9fa", py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid size={{xs:12, md:6}}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                  Get in Touch
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ color: "text.secondary", mb: 4 }}
                >
                  Have a question or need assistance? Fill out the form below
                  and we'll get back to you as soon as possible.
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: 400,
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564749872!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Office Location"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <LandingFooter />
    </Box>
  );
};

export default ContactUs;
