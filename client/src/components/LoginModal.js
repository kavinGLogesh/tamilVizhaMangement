
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, Box,
  Typography, IconButton, Alert, Divider, CircularProgress, InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const FUNCTION_LABELS = {
  kaathu_kuthu:           { ta: 'காத்து குத்து',            en: 'Ear Piercing',    icon: '💍' },
  kalyanam:               { ta: 'கல்யாணம்',                 en: 'Wedding',          icon: '💒' },
  veetu_punniyahavasanam: { ta: 'வீட்டு புண்ணியாஹவசனம்',   en: 'House Warming',    icon: '🏠' },
  valaikappu:             { ta: 'வளைகாப்பு',                en: 'Baby Shower',      icon: '🤱' },
  virundhu:               { ta: 'விருந்து',                  en: 'Feast / Dinner',   icon: '🍽️' }
};

const LoginModal = ({ open, onClose, onSwitchToRegister }) => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const lang = i18n.language;

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.username || !form.password) { setError(t('errors.required')); return; }
    setLoading(true); setError('');
    try {
      const user = await login(form.username, form.password);
      setSuccess({ username: user.username, date: dayjs().format('DD MMMM YYYY'), functionType: user.functionType });
      setTimeout(() => { onClose(); navigate('/dashboard'); }, 2200);
    } catch { setError(t('errors.loginFailed')); }
    finally { setLoading(false); }
  };

  const handleClose = () => { setForm({ username: '', password: '' }); setError(''); setSuccess(null); onClose(); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 0.5, overflow: 'hidden' } }}>
      {/* Colored top bar */}
      <Box sx={{ height: 5, background: 'linear-gradient(90deg, #8B1A1A, #C8860A)' }} />
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, pt: 2.5, px: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Noto Serif Tamil', serif", color: 'primary.main', fontWeight: 700, lineHeight: 1.2 }}>
            {t('login.title')} / உள்நுழைவு
          </Typography>
          <Typography variant="caption" color="text.secondary">விழா மேலாண்மை</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ bgcolor: 'rgba(139,26,26,0.06)', '&:hover': { bgcolor: 'rgba(139,26,26,0.1)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mx: 3, borderColor: 'rgba(139,26,26,0.1)' }} />
      <DialogContent sx={{ pt: 3, px: 3, pb: 3 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ fontSize: '3.5rem', mb: 1.5 }}>🎉</Box>
            <Typography variant="h5" color="primary.main" fontWeight={700} sx={{ fontFamily: "'Noto Serif Tamil', serif", mb: 0.5 }}>
              {t('login.welcome')}, {success.username}!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('login.loginDate')}: {success.date}
            </Typography>
            {success.functionType && FUNCTION_LABELS[success.functionType] && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1, bgcolor: 'rgba(139,26,26,0.06)', borderRadius: 3, border: '1px solid rgba(139,26,26,0.12)' }}>
                <Typography sx={{ fontSize: '1.3rem' }}>{FUNCTION_LABELS[success.functionType].icon}</Typography>
                <Typography variant="body2" color="primary.main" fontWeight={700} sx={{ fontFamily: "'Noto Serif Tamil', serif" }}>
                  {lang === 'ta' ? FUNCTION_LABELS[success.functionType].ta : FUNCTION_LABELS[success.functionType].en}
                </Typography>
              </Box>
            )}
            <Box sx={{ mt: 2.5 }}>
              <CircularProgress size={22} sx={{ color: 'primary.main' }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Dashboard க்கு செல்கிறோம்...</Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
            <TextField fullWidth label={t('login.username') + ' / பயனர் பெயர்'} name="username"
              value={form.username} onChange={handleChange} autoComplete="username"
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }} />
            <TextField fullWidth label={t('login.password') + ' / கடவுச்சொல்'} name="password"
              type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} autoComplete="current-password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} size="small">{showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></InputAdornment>
              }} />
            <Button variant="contained" size="large" fullWidth onClick={handleSubmit} disabled={loading}
              sx={{ py: 1.4, fontSize: '1rem', borderRadius: 3, mt: 0.5 }}>
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : `🔑 ${t('login.submit')} / உள்நுழை`}
            </Button>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('login.noAccount')}{' '}
              <Box component="span" sx={{ color: 'secondary.main', cursor: 'pointer', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }} onClick={onSwitchToRegister}>
                {t('login.registerLink')}
              </Box>
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
