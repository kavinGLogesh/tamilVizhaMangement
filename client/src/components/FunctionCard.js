
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const FUNCTION_IMAGES = {
  kaathu_kuthu: "/image/kathukuthu.jpeg",
  kalyanam: "/image/wedding.jpeg",
  veetu_punniyahavasanam: "/image/housewarmming.jpeg",
  valaikappu: "/image/babyshower.jpeg",
  virundhu: "/image/virunthu.jpeg",
};

const FUNCTION_META = {
  kaathu_kuthu:           { icon: '💍', color: '#E91E63', gradient: 'linear-gradient(135deg,#E91E6322,#E91E6308)' },
  kalyanam:               { icon: '💒', color: '#9C27B0', gradient: 'linear-gradient(135deg,#9C27B022,#9C27B008)' },
  veetu_punniyahavasanam: { icon: '🏠', color: '#FF5722', gradient: 'linear-gradient(135deg,#FF572222,#FF572208)' },
  valaikappu:             { icon: '🤱', color: '#2196F3', gradient: 'linear-gradient(135deg,#2196F322,#2196F308)' },
  virundhu:               { icon: '🍽️', color: '#4CAF50', gradient: 'linear-gradient(135deg,#4CAF5022,#4CAF5008)' },
};

const FunctionCard = ({ functionKey }) => {
  const { t } = useTranslation();
  const meta = FUNCTION_META[functionKey];

  return (
    <Card sx={{
      height: '100%', cursor: 'pointer',
      transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
      '&:hover': { transform: 'translateY(-10px) scale(1.02)', boxShadow: '0 20px 50px rgba(139,26,26,0.18)' },
      overflow: 'hidden', borderRadius: '18px !important',
    }}>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia component="img" height="180" image={FUNCTION_IMAGES[functionKey]}
          alt={t('functions.' + functionKey)}
          sx={{ objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.08)' } }} />
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to top, rgba(44,24,16,0.6), transparent)'
        }} />
        <Box sx={{
          position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {meta.icon}
        </Box>
      </Box>
      <CardContent sx={{ textAlign: 'center', p: 2, background: meta.gradient }}>
        <Typography variant="body1" sx={{
          fontFamily: "'Noto Serif Tamil', serif", color: meta.color, fontWeight: 700,
          fontSize: { xs: '0.85rem', md: '0.95rem' }, lineHeight: 1.4
        }}>
          {t('functions.' + functionKey)}
        </Typography>
        <Box sx={{ width: 32, height: 3, borderRadius: 2, bgcolor: meta.color, mx: 'auto', mt: 1, opacity: 0.6 }} />
      </CardContent>
    </Card>
  );
};

export default FunctionCard;
