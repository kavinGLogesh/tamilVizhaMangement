
import { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Fade, Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import FunctionCard from '../components/FunctionCard';

const FUNCTION_KEYS = ['kaathu_kuthu', 'kalyanam', 'veetu_punniyahavasanam', 'valaikappu', 'virundhu'];

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const openLogin    = () => { setRegisterOpen(false); setLoginOpen(true); };
  const openRegister = () => { setLoginOpen(false);    setRegisterOpen(true); };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onLogin={openLogin} onRegister={openRegister} />

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(145deg, #4A0A0A 0%, #8B1A1A 45%, #B5660A 80%, #C8860A 100%)',
        py: { xs: 7, md: 13 }, px: 3, textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        {[...Array(4)].map((_, i) => (
          <Box key={i} sx={{
            position: 'absolute', borderRadius: '50%', border: '1px solid rgba(255,248,231,0.06)',
            width: [300, 500, 700, 900][i], height: [300, 500, 700, 900][i],
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none'
          }} />
        ))}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(200,134,10,0.08)', filter: 'blur(40px)' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(255,248,231,0.05)', filter: 'blur(30px)' }} />

        <Fade in timeout={800}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,248,231,0.1)', borderRadius: 5, px: 2.5, py: 0.8, mb: 3, border: '1px solid rgba(255,248,231,0.15)' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,248,231,0.9)', fontSize: '0.82rem', letterSpacing: 1 }}>
                🪔 தமிழ் கலாச்சார விழா மேலாண்மை
              </Typography>
            </Box>
            <Typography variant="h2" sx={{
              color: '#FFF8E7', fontFamily: "'Noto Serif Tamil', serif", fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.6rem' }, mb: 2, lineHeight: 1.2,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)'
            }}>
              {i18n.language === 'ta' ? 'விழா மேலாண்மை' : 'Vizha Management'}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,248,231,0.75)', mb: 5, fontWeight: 300, fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 560, mx: 'auto' }}>
              {t('home.subtitle')}
            </Typography>
            {!user ? (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button size="large" onClick={openLogin}
                  sx={{ bgcolor: '#FFF8E7', color: '#8B1A1A', background: '#FFF8E7', fontWeight: 700,
                        px: { xs: 3.5, md: 5 }, py: 1.6, fontSize: '1rem', borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                        '&:hover': { bgcolor: '#F5E6C8', transform: 'translateY(-2px)', boxShadow: '0 12px 36px rgba(0,0,0,0.3)' } }}>
                  🔑 உள்நுழை / Login
                </Button>
                <Button size="large" onClick={openRegister} variant="outlined"
                  sx={{ color: '#FFF8E7', borderColor: 'rgba(255,248,231,0.5)', borderWidth: 2, fontWeight: 600,
                        px: { xs: 3.5, md: 5 }, py: 1.5, fontSize: '1rem', borderRadius: 3,
                        '&:hover': { borderColor: '#FFF8E7', bgcolor: 'rgba(255,255,255,0.08)', transform: 'translateY(-2px)' } }}>
                  ✨ பதிவு செய் / Register
                </Button>
              </Box>
            ) : (
              <Button size="large" onClick={() => navigate('/dashboard')}
                sx={{ bgcolor: '#FFF8E7', color: '#8B1A1A', background: '#FFF8E7', fontWeight: 700, px: 5, py: 1.6, fontSize: '1rem', borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.2)', '&:hover': { bgcolor: '#F5E6C8', transform: 'translateY(-2px)' } }}>
                📊 Go to Dashboard / டாஷ்போர்டு
              </Button>
            )}
          </Box>
        </Fade>
      </Box>

      {/* Stats strip */}
      <Box sx={{ bgcolor: '#FFF8E7', borderBottom: '1px solid rgba(139,26,26,0.08)' }}>
        <Container maxWidth="md">
          <Grid container sx={{ py: 2.5 }}>
            {[['5+', 'விழா வகைகள் / Function Types'], ['100%', 'இலவச பயன்பாடு / Free to Use'], ['📱💻', 'Mobile & Desktop']].map(([val, label]) => (
              <Grid item xs={4} key={label} sx={{ textAlign: 'center', px: 2, borderRight: '1px solid rgba(139,26,26,0.1)', '&:last-child': { borderRight: 'none' } }}>
                <Typography variant="h5" fontWeight={700} color="primary.main">{val}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>{label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Function Cards */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 9 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Noto Serif Tamil', serif", color: 'primary.main', mb: 1.5, fontSize: { xs: '1.6rem', md: '2.1rem' } }}>
            {t('home.functions')}
          </Typography>
          <Box sx={{ width: 64, height: 4, borderRadius: 2, mx: 'auto', background: 'linear-gradient(90deg, #8B1A1A, #C8860A)' }} />
        </Box>
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
          {FUNCTION_KEYS.map((key, i) => (
            <Grid item xs={6} sm={4} md={2.4} key={key}>
              <Zoom in timeout={400 + i * 100}>
                <Box><FunctionCard functionKey={key} /></Box>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ background: 'linear-gradient(135deg, #2C1810, #4A0A0A)', color: '#FFF8E7', textAlign: 'center', py: 4 }}>
        <Typography variant="body1" sx={{ fontFamily: "'Noto Serif Tamil', serif", mb: 0.5 }}>🪔 விழா மேலாண்மை</Typography>
        <Typography variant="caption" sx={{ opacity: 0.5 }}>© 2024 Vizha Management. All rights reserved.</Typography>
      </Box>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSwitchToRegister={openRegister} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchToLogin={openLogin} />
    </Box>
  );
};

export default HomePage;
