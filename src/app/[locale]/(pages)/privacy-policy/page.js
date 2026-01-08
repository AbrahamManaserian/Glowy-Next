'use client';

import { Typography, Container, Box, Paper, Divider, Link } from '@mui/material';
import { useTranslations } from 'next-intl';

// Helper function to render text with glowy.am as a link
const renderTextWithLink = (text, sx = {}) => {
  if (!text) return text;

  const parts = text.split(/(glowy\.am)/g);

  return parts.map((part, index) => {
    if (part === 'glowy.am') {
      return (
        <Link
          key={index}
          href="https://glowy.am"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#1976d2',
            textDecoration: 'none',
            fontWeight: 600,
            '&:hover': {
              textDecoration: 'underline',
            },
            ...sx,
          }}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};

export default function PrivacyPolicyPage() {
  const t = useTranslations('PrivacyPolicyPage');

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 6,

        px: { xs: 2, sm: 3 },
        backgroundColor: '#fafafa',
        minHeight: '100vh',
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 2,
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            lineHeight: { xs: 1.2, md: 1.3 },
          }}
        >
          {t('title')}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            px: { xs: 1, sm: 0 },
          }}
        >
          {t('subtitle')}
        </Typography>
      </Box>

      {/* Content Section */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          mx: { xs: 0, sm: 'auto' },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: '#333',
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          {renderTextWithLink(t('goal'))}
        </Typography>

        <Divider sx={{ my: { xs: 3, md: 4 } }} />

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.6rem' },
          }}
        >
          {t('informationGathering')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: '#555',
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          {t('gatheringText')}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#f8f9fa',
            p: { xs: 2, sm: 3 },
            borderRadius: 1,
            mb: 4,
            mx: { xs: -1, sm: 0 },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#333',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            {t('gatheringList')}
          </Typography>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.6rem' },
          }}
        >
          {t('useOfInformation')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: '#555',
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          {t('useText')}
        </Typography>
        <Box
          sx={{
            backgroundColor: '#f8f9fa',
            p: { xs: 2, sm: 3 },
            borderRadius: 1,
            mb: 4,
            mx: { xs: -1, sm: 0 },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: '#333',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            {t('useList')}
          </Typography>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.6rem' },
          }}
        >
          {t('informationPrivacy')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: '#555',
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          {t('privacyText')}
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 3,
            fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.6rem' },
          }}
        >
          {t('accountProtection')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#555',
            lineHeight: 1.6,
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          {renderTextWithLink(t('protectionText'))}
        </Typography>
      </Paper>
    </Container>
  );
}
