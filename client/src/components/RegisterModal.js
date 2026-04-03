
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, Box,
  Typography, IconButton, Alert, Divider, MenuItem, Select,
  FormControl, InputLabel, CircularProgress, InputAdornment, Stepper, Step, StepLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const FUNCTIONS = [
  { key: 'kaathu_kuthu',           ta: 'காத்து குத்து',            en: 'Ear Piercing (Kaathu Kuthu)', icon: '💍' },
  { key: 'kalyanam',               ta: 'கல்யாணம்',                 en: 'Wedding (Kalyanam)',           icon: '💒' },
  { key: 'veetu_punniyahavasanam', ta: 'வீட்டு புண்ணியாஹவசனம்',   en: 'House Warming',                icon: '🏠' },
  { key: 'valaikappu',             ta: 'வளைகாப்பு',                en: 'Baby Shower (Valaikappu)',     icon: '🤱' },
  { key: 'virundhu',               ta: 'விருந்து',                  en: 'Feast / Dinner (Virundhu)',    icon: '🍽️' }
];

const RegisterModal = ({ open, onClose, onSwitchToLogin }) => {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const lang = i18n.language;

  const [form, setForm] = useState({ username: '', password: '', registeredDate: '', functionType: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.username || !form.password || !form.registeredDate || !form.functionType) {
      setError(t('errors.required')); return;
    }
    setLoading(true); setError('');
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => { onClose(); onSwitchToLogin(); setSuccess(false); }, 2200);
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.registerFailed'));
    } finally { setLoading(false); }
  };

  const handleClose = () => { setForm({ username: '', password: '', registeredDate: '', functionType: '' }); setError(''); setSuccess(false); onClose(); };
  const selectedFn = FUNCTIONS.find(f => f.key === form.functionType);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 0.5, overflow: 'hidden' } }}>
      <Box sx={{ height: 5, background: 'linear-gradient(90deg, #C8860A, #8B1A1A)' }} />
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, pt: 2.5, px: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: "'Noto Serif Tamil', serif", color: 'primary.main', fontWeight: 700, lineHeight: 1.2 }}>
            {t('register.title')} / பதிவு
          </Typography>
          <Typography variant="caption" color="text.secondary">புதிய கணக்கு உருவாக்கு</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ bgcolor: 'rgba(139,26,26,0.06)', '&:hover': { bgcolor: 'rgba(139,26,26,0.1)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mx: 3, borderColor: 'rgba(139,26,26,0.1)' }} />
      <DialogContent sx={{ pt: 3, px: 3, pb: 3 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 1.5 }} />
            <Typography variant="h5" color="primary.main" fontWeight={700} sx={{ fontFamily: "'Noto Serif Tamil', serif", mb: 0.5 }}>
              {t('register.success')}
            </Typography>
            <Typography variant="body2" color="text.secondary">பதிவு வெற்றிகரமாக முடிந்தது!</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>உள்நுழைவு பக்கத்திற்கு செல்கிறோம்...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

            <TextField fullWidth label={t('register.username') + ' / பயனர் பெயர்'} name="username"
              value={form.username} onChange={handleChange} autoComplete="off"
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }} />

            <TextField fullWidth label={t('register.password') + ' / கடவுச்சொல்'} name="password"
              type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} autoComplete="new-password"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)} size="small">{showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}</IconButton></InputAdornment>
              }} />

            <TextField fullWidth label={t('register.date') + ' / விழா தேதி'} name="registeredDate" type="date"
              value={form.registeredDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />

            <FormControl fullWidth>
              <InputLabel id="fn-label">{t('register.functionType')} / விழா தேர்வு</InputLabel>
              <Select labelId="fn-label" name="functionType" value={form.functionType} onChange={handleChange}
                label={t('register.functionType') + ' / விழா தேர்வு'}>
                {FUNCTIONS.map((fn) => (
                  <MenuItem key={fn.key} value={fn.key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography sx={{ fontSize: '1.1rem' }}>{fn.icon}</Typography>
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ fontFamily: "'Noto Serif Tamil', serif", lineHeight: 1.2 }}>{fn.ta}</Typography>
                        <Typography variant="caption" color="text.secondary">{fn.en}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Preview selected function */}
            {selectedFn && (
              <Box sx={{ p: 1.5, bgcolor: 'rgba(139,26,26,0.04)', borderRadius: 2.5, border: '1px solid rgba(139,26,26,0.1)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontSize: '1.5rem' }}>{selectedFn.icon}</Typography>
                <Box>
                  <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ fontFamily: "'Noto Serif Tamil', serif" }}>
                    {selectedFn.ta}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{selectedFn.en}</Typography>
                </Box>
              </Box>
            )}

            <Button variant="contained" size="large" fullWidth onClick={handleSubmit} disabled={loading}
              sx={{ py: 1.4, fontSize: '1rem', borderRadius: 3, mt: 0.5 }}>
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : `✨ ${t('register.submit')} / பதிவு செய்`}
            </Button>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('register.hasAccount')}{' '}
              <Box component="span" sx={{ color: 'secondary.main', cursor: 'pointer', fontWeight: 700, '&:hover': { textDecoration: 'underline' } }} onClick={onSwitchToLogin}>
                {t('register.loginLink')}
              </Box>
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
