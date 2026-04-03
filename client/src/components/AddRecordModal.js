import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Chip,
  Alert, CircularProgress, Divider, InputAdornment, IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';

const FN = {
  kaathu_kuthu:           { ta:'காத்து குத்து', en:'Ear Piercing', icon:'💍', color:'#E91E63' },
  kalyanam:               { ta:'கல்யாணம்',      en:'Wedding',       icon:'💒', color:'#9C27B0' },
  veetu_punniyahavasanam: { ta:'வீட்டு புண்ணியாஹவசனம்', en:'House Warming', icon:'🏠', color:'#FF5722' },
  valaikappu:             { ta:'வளைகாப்பு',     en:'Baby Shower',   icon:'🤱', color:'#2196F3' },
  virundhu:               { ta:'விருந்து',       en:'Feast',         icon:'🍽️', color:'#4CAF50' }
};

export default function AddRecordModal({ open, onClose, onSave, userFunctionType, userDate, editData }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [form, setForm] = useState({ name:'', address:'', amount:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(editData
      ? { name: editData.name||'', address: editData.address||'', amount: editData.amount||'' }
      : { name:'', address:'', amount:'' }
    );
  }, [open, editData]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.address.trim() || !form.amount) {
      setError('All fields are required / அனைத்து புலங்களும் தேவை'); return;
    }
    setLoading(true); setError('');
    try {
      await onSave({
        name: form.name, address: form.address,
        amount: Number(form.amount),
        functionType: userFunctionType,
        date: userDate || new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed. Please try again.');
    } finally { setLoading(false); }
  };

  const fnInfo = FN[userFunctionType];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx:{ borderRadius:4, overflow:'hidden' } }}>
      <Box sx={{ height:5, background: fnInfo ? `linear-gradient(90deg,${fnInfo.color}80,${fnInfo.color})` : 'linear-gradient(90deg,#8B1A1A,#C8860A)' }} />
      <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', pt:2.5, px:3, pb:1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontFamily:"'Noto Serif Tamil',serif", color:'primary.main', fontWeight:700 }}>
            {editData ? '✏️ Edit Guest' : '➕ Add Guest'} / விருந்தினர்
          </Typography>
          <Typography variant="caption" color="text.secondary">Guest name, address & gift amount</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ bgcolor:'rgba(139,26,26,0.06)' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mx:3, borderColor:'rgba(139,26,26,0.1)' }} />
      <DialogContent sx={{ pt:2.5, px:3 }}>
        <Box sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
          {error && <Alert severity="error" sx={{ borderRadius:3 }}>{error}</Alert>}

          {fnInfo && (
            <Box sx={{ p:1.8, borderRadius:3, bgcolor:`${fnInfo.color}0d`, border:`1.5px solid ${fnInfo.color}30`, display:'flex', flexWrap:'wrap', gap:1, alignItems:'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ width:'100%', textTransform:'uppercase', letterSpacing:0.8, fontSize:'0.67rem' }}>
                Auto-filled Event / உங்கள் விழா
              </Typography>
              <Chip
                icon={<span style={{ fontSize:'0.9rem', marginLeft:6 }}>{fnInfo.icon}</span>}
                label={lang === 'ta' ? fnInfo.ta : fnInfo.en}
                sx={{ bgcolor:`${fnInfo.color}20`, color:fnInfo.color, fontWeight:700, fontFamily:"'Noto Serif Tamil',serif" }}
              />
              {userDate && (
                <Chip
                  label={`📅 ${new Date(userDate).toLocaleDateString('en-IN',{ day:'2-digit', month:'short', year:'numeric' })}`}
                  variant="outlined"
                  sx={{ color:'text.secondary', borderColor:'rgba(0,0,0,0.12)', fontWeight:600 }}
                />
              )}
            </Box>
          )}

          <TextField fullWidth label="Name / பெயர் *" name="name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} autoFocus
            InputProps={{ startAdornment:<InputAdornment position="start"><PersonIcon sx={{ color:'text.secondary', fontSize:20 }}/></InputAdornment> }} />

          <TextField fullWidth label="Address / முகவரி *" name="address" value={form.address}
            onChange={e => setForm({...form, address: e.target.value})} multiline rows={2}
            InputProps={{ startAdornment:<InputAdornment position="start"><LocationOnIcon sx={{ color:'text.secondary', fontSize:20, mt:'2px' }}/></InputAdornment> }} />

          <TextField fullWidth label="Gift Amount / பரிசு தொகை *" name="amount" type="number" value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            inputProps={{ min:0, step:1 }}
            InputProps={{ startAdornment:<InputAdornment position="start"><CurrencyRupeeIcon sx={{ color:'text.secondary', fontSize:20 }}/></InputAdornment> }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px:3, pb:3, pt:2, gap:1 }}>
        <Button onClick={onClose} variant="outlined" color="primary" sx={{ borderRadius:3, px:3 }}>
          Cancel / ரத்து
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading} sx={{ borderRadius:3, minWidth:140 }}>
          {loading ? <CircularProgress size={20} sx={{ color:'#fff' }}/> : `💾 ${editData ? 'Update' : 'Save'} / சேமி`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
