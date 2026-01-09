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
  const tCommon = useTranslations('Common');

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
          {t('title')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('subtitle')}
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
                {t('commonQuestions')}
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
                  <Typography sx={{ fontWeight: 500 }}>{t('faq_q1_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    <strong>{t('faq_q1_signed_label')}</strong> {t('faq_q1_signed_para1')}{' '}
                    <Link href="/user" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                      {tCommon('user.myOrders')}
                    </Link>{' '}
                    {t('faq_q1_signed_para2')}
                  </Typography>
                  <Typography color="text.secondary">
                    <strong>{t('faq_q1_guest_label')}</strong> {t('faq_q1_guest_para1')}{' '}
                    <Link href="/user" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                      {tCommon('user.myOrders')}
                    </Link>{' '}
                    {t('faq_q1_guest_para2')}
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
                  <Typography sx={{ fontWeight: 500 }}>{t('faq_q2_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                  <Typography color="text.secondary">{t('faq_q2_answer')}</Typography>
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
                  <Typography sx={{ fontWeight: 500 }}>{t('faq_q3_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 2, backgroundColor: '#fff' }}>
                  <Typography color="text.secondary">{t('faq_q3_answer')}</Typography>
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
                  <Typography sx={{ fontWeight: 500 }}>{t('faq_q4_question')}</Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: 3, py: 2, backgroundColor: '#fff', borderRadius: '0 0 12px 12px' }}
                >
                  <Typography color="text.secondary">
                    {t('faq_q4_answer')}{' '}
                    <Link href="#shipping-policy" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                      {t('shippingPolicy_title')}
                    </Link>{' '}
                    {''}
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
              {t('contactSupport_title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('contactSupport_desc')}
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('form_fullName')}
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
                label={t('form_phoneNumber')}
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
                label={t('form_email')}
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
                label={t('form_message')}
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
                    {t('form_agree_prefix')}{' '}
                    <Link href="/privacy-policy" style={{ color: '#FE6B8B', textDecoration: 'underline' }}>
                      {t('form_privacy_policy')}
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
                {t('form_send')}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Additional Contact Info */}
        <Grid size={{ xs: 12, sm: 5 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, backgroundColor: '#fff' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
              {t('contactInfo_title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>{t('contact_phone')}</strong> +1 (123) 456-7890
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>{t('contact_email')}</strong> support@glowy.com
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>{t('contact_hours')}</strong> Monday - Friday, 9 AM - 6 PM EST
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{t('contact_address')}</strong> 123 Beauty Street, Glow City, GC 12345
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
              {t('shippingPolicy_title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>{t('shipping_domestic_title')}</strong> {t('shipping_domestic_body')}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>{t('shipping_processing_title')}</strong> {t('shipping_processing_body')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              <strong>{t('shipping_issues_title')}</strong> {t('shipping_issues_body')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('shipping_more')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
