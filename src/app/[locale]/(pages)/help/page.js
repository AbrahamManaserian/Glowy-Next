'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

export default function HelpPage() {
  const t = useTranslations('HelpPage');

  return (
    <Container maxWidth="lg" sx={{ py: 6, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#333',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find answers to common questions or get in touch with us
        </Typography>
      </Box>

      {/* FAQ Section */}
      <Grid size={12}>
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: '12px 12px 0 0' }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center' }}
              >
                <HelpOutlineIcon sx={{ mr: 1, color: '#FE6B8B' }} />
                Common Questions
              </Typography>
            </Box>
            <Box>
              <Accordion sx={{ '&:before': { display: 'none' }, boxShadow: 'none' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#FE6B8B' }} />}
                  sx={{
                    backgroundColor: '#fafafa',
                    borderRadius: 0,
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    px: 3,
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>How do I track my order?</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                  <Typography color="text.secondary">
                    You can track your order by logging into your account and going to the "My Orders"
                    section. There, you'll find the tracking information provided by the shipping carrier.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ '&:before': { display: 'none' }, boxShadow: 'none' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#FE6B8B' }} />}
                  sx={{
                    backgroundColor: '#fafafa',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    px: 3,
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>How to make an order?</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                  <Typography color="text.secondary">
                    You can place an order whether you are signed in or not, but we recommend signing in to
                    make an order. This allows you to manage your orders more informatively, get a 20%
                    discount on your first purchase, and earn bonus points (starting from 3% for each
                    completed order), which you can use for future purchases.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ '&:before': { display: 'none' }, boxShadow: 'none' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#FE6B8B' }} />}
                  sx={{
                    backgroundColor: '#fafafa',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    px: 3,
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>How can I change my shipping address?</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                  <Typography color="text.secondary">
                    If you are signed in, you can update your shipping address in your profile settings. For
                    guest orders or if the order has already been processed, please contact our customer
                    service team as soon as possible. Changes cannot be guaranteed once the order has been
                    processed.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                sx={{ '&:before': { display: 'none' }, boxShadow: 'none', borderRadius: '0 0 12px 12px' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#FE6B8B' }} />}
                  sx={{
                    backgroundColor: '#fafafa',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    px: 3,
                    borderRadius: '0 0 12px 12px',
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Do you ship to all regions of Armenia?</Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: 3, py: 2, backgroundColor: '#fff', borderRadius: '0 0 12px 12px' }}
                >
                  <Typography color="text.secondary">
                    Yes, we ship to all regions of Armenia. Shipping costs and delivery times may vary by
                    location. Please check our{' '}
                    <Link href="#shipping-policy" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                      shipping policy
                    </Link>{' '}
                    for more details.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid container spacing={4}>
        {/* Contact Form Section */}
        <Grid size={{ xs: 12, sm: 7 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#fff' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <ContactMailIcon sx={{ mr: 1, color: '#FF8E53' }} />
              Contact Support
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              If you have any problems, leave a message, and our team will contact you as soon as possible.
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#FE6B8B' },
                    '&.Mui-focused fieldset': { borderColor: '#FE6B8B' },
                  },
                }}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#FE6B8B' },
                    '&.Mui-focused fieldset': { borderColor: '#FE6B8B' },
                  },
                }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#FE6B8B' },
                    '&.Mui-focused fieldset': { borderColor: '#FE6B8B' },
                  },
                }}
              />
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                maxRows={10}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': { borderColor: '#FE6B8B' },
                    '&.Mui-focused fieldset': { borderColor: '#FE6B8B' },
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: '#FE6B8B',
                      '&.Mui-checked': { color: '#FE6B8B' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    I agree to the{' '}
                    <Link href="/privacy-policy" style={{ color: '#FE6B8B', textDecoration: 'underline' }}>
                      privacy policy
                    </Link>
                  </Typography>
                }
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                  },
                }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Additional Contact Info */}
        <Grid size={{ xs: 12, sm: 5 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, backgroundColor: '#fff' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
              Contact Information
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Phone:</strong> +1 (123) 456-7890
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Email:</strong> support@glowy.com
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Address:</strong> 123 Beauty Street, Glow City, GC 12345
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Shipping Policy Section */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={12} id="shipping-policy" sx={{ scrollMarginTop: '100px' }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#fff' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <LocalShippingIcon sx={{ mr: 1, color: '#FF8E53' }} />
              Shipping Policy
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Domestic Shipping (Armenia):</strong> We offer free shipping on orders over 10,000 AMD
              within Armenia. For orders under this amount, standard shipping costs 1,000 AMD. Delivery
              typically takes 3-7 business days depending on your location.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>International Shipping:</strong> We ship to select countries outside Armenia. Shipping
              costs and delivery times vary by destination. International orders may be subject to customs
              duties and taxes.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Processing Time:</strong> Orders are processed within 1-2 business days. You will
              receive a tracking number via email once your order ships.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Delivery Issues:</strong> If you experience any issues with delivery, please contact our
              customer service team immediately. We are not responsible for delays caused by carriers or
              customs.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              For more detailed information or specific inquiries, please reach out to our support team.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
