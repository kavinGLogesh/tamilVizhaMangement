import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Divider,
  Alert, CircularProgress, InputAdornment, Grid, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import NotesIcon from '@mui/icons-material/Notes';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const GOLD_RATE  = 7500;
const SILVER_RATE = 90;

const EMPTY = { name:'', address:'', cashAmount:'', goldCarats:'22', goldGrams:'', silverGrams:'', note:'', date:'' };

export default function CreditModal({ open, onClose, onSave, editData }) {
  const [form, setForm]     = useState(EMPTY);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editData) {
      setForm({
        name:        editData.name        || '',
        address:     editData.address     || '',
        cashAmount:  editData.cashAmount  != null ? String(editData.cashAmount)  : '',
        goldCarats:  editData.goldCarats  != null ? String(editData.goldCarats)  : '22',
        goldGrams:   editData.goldGrams   != null ? String(editData.goldGrams)   : '',
        silverGrams: editData.silverGrams != null ? String(editData.silverGrams) : '',
        note:        editData.note  || '',
        date:        editData.date  ? editData.date.slice(0, 10) : ''
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, editData]);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const goldVal   = ((Number(form.goldCarats) || 22) / 24) * (Number(form.goldGrams) || 0) * GOLD_RATE;
  const silverVal = (Number(form.silverGrams) || 0) * SILVER_RATE;
  const totalEst  = (Number(form.cashAmount) || 0) + goldVal + silverVal;

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required / பெயர் தேவை'); return; }
    const hasCash   = Number(form.cashAmount) > 0;
    const hasGold   = Number(form.goldGrams) > 0;
    const hasSilver = Number(form.silverGrams) > 0;
    if (!hasCash && !hasGold && !hasSilver) {
      setError('Enter cash, gold, or silver amount / ரொக்கம், தங்கம் அல்லது வெள்ளி தொகை தேவை'); return;
    }
    setLoading(true); setError('');
    try {
      await onSave({
        name:        form.name,
        address:     form.address,
        cashAmount:  Number(form.cashAmount)  || 0,
        goldCarats:  Number(form.goldCarats)  || 22,
        goldGrams:   Number(form.goldGrams)   || 0,
        silverGrams: Number(form.silverGrams) || 0,
        note:        form.note,
        date:        form.date || new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx:{ borderRadius:4, overflow:'hidden' } }}>
      <Box sx={{ height:5, background:'linear-gradient(90deg,#1B5E20,#43A047)' }} />
      <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', pt:2.5, px:3, pb:1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ fontFamily:"'Noto Serif Tamil',serif", color:'#1B5E20', lineHeight:1.2 }}>
            ✅ {editData ? 'Edit Credit' : 'Add Credit'} / வரவு
          </Typography>
          <Typography variant="caption" color="text.secondary">Cash, Gold (carats & grams), Silver</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ bgcolor:'rgba(27,94,32,0.06)' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mx:3, borderColor:'rgba(27,94,32,0.15)' }} />

      <DialogContent sx={{ pt:2.5, px:3 }}>
        <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          {error && <Alert severity="error" sx={{ borderRadius:3 }}>{error}</Alert>}

          {/* Person */}
          <Typography variant="overline" sx={{ color:'text.secondary', letterSpacing:1.2, fontSize:'0.67rem', lineHeight:1.5 }}>
            👤 Person / நபர் விவரங்கள்
          </Typography>
          <TextField fullWidth label="Name / பெயர் *" value={form.name} onChange={set('name')} autoFocus
            InputProps={{ startAdornment:<InputAdornment position="start"><PersonIcon sx={{ color:'text.secondary', fontSize:20 }}/></InputAdornment> }} />
          <TextField fullWidth label="Address / முகவரி" value={form.address} onChange={set('address')} multiline rows={2}
            InputProps={{ startAdornment:<InputAdornment position="start"><LocationOnIcon sx={{ color:'text.secondary', fontSize:20, mt:'2px' }}/></InputAdornment> }} />

          <Divider sx={{ borderColor:'rgba(27,94,32,0.1)' }} />

          {/* Cash */}
          <Typography variant="overline" sx={{ color:'text.secondary', letterSpacing:1.2, fontSize:'0.67rem', lineHeight:1.5 }}>
            💵 Cash / ரொக்கம்
          </Typography>
          <TextField fullWidth label="Cash Amount (₹)" value={form.cashAmount} onChange={set('cashAmount')} type="number"
            inputProps={{ min:0, step:1 }}
            InputProps={{ startAdornment:<InputAdornment position="start"><CurrencyRupeeIcon sx={{ color:'#1B5E20', fontSize:20 }}/></InputAdornment> }} />

          <Divider sx={{ borderColor:'rgba(27,94,32,0.1)' }} />

          {/* Gold */}
          <Typography variant="overline" sx={{ color:'text.secondary', letterSpacing:1.2, fontSize:'0.67rem', lineHeight:1.5 }}>
            🥇 Gold / தங்கம்
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Gold Carats / காரட்" value={form.goldCarats} onChange={set('goldCarats')} type="number"
                inputProps={{ min:1, max:24, step:1 }}
                helperText="e.g. 22, 24, 18" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Gold Grams / கிராம்" value={form.goldGrams} onChange={set('goldGrams')} type="number"
                inputProps={{ min:0, step:0.1 }}
                helperText={Number(form.goldGrams) > 0 ? `≈ ₹${Math.round(goldVal).toLocaleString('en-IN')}` : 'Weight in grams'} />
            </Grid>
          </Grid>

          <Divider sx={{ borderColor:'rgba(27,94,32,0.1)' }} />

          {/* Silver */}
          <Typography variant="overline" sx={{ color:'text.secondary', letterSpacing:1.2, fontSize:'0.67rem', lineHeight:1.5 }}>
            🥈 Silver / வெள்ளி
          </Typography>
          <TextField fullWidth label="Silver Grams / வெள்ளி கிராம்" value={form.silverGrams} onChange={set('silverGrams')} type="number"
            inputProps={{ min:0, step:0.1 }}
            helperText={Number(form.silverGrams) > 0 ? `≈ ₹${Math.round(silverVal).toLocaleString('en-IN')}` : `Rate: ₹${SILVER_RATE}/g`} />

          <Divider sx={{ borderColor:'rgba(27,94,32,0.1)' }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Date / தேதி" value={form.date} onChange={set('date')} type="date" InputLabelProps={{ shrink:true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Note (optional)" value={form.note} onChange={set('note')}
                InputProps={{ startAdornment:<InputAdornment position="start"><NotesIcon sx={{ color:'text.secondary', fontSize:18 }}/></InputAdornment> }} />
            </Grid>
          </Grid>

          {/* Estimated total */}
          {totalEst > 0 && (
            <Box sx={{ p:2, borderRadius:3, bgcolor:'rgba(27,94,32,0.07)', border:'1.5px solid rgba(27,94,32,0.2)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                <TrendingUpIcon sx={{ color:'#1B5E20', fontSize:20 }} />
                <Typography variant="body2" color="#1B5E20" fontWeight={600}>Estimated Total Value</Typography>
              </Box>
              <Typography variant="h6" fontWeight={900} color="#1B5E20">
                ₹{Math.round(totalEst).toLocaleString('en-IN')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px:3, pb:3, pt:2, gap:1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius:3, px:3, borderColor:'#1B5E20', color:'#1B5E20' }}>
          Cancel / ரத்து
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}
          sx={{ borderRadius:3, minWidth:140, background:'linear-gradient(135deg,#1B5E20,#2E7D32)', '&:hover':{ background:'linear-gradient(135deg,#0d3b10,#1B5E20)' } }}>
          {loading ? <CircularProgress size={20} sx={{ color:'#fff' }}/> : `💾 ${editData ? 'Update' : 'Save'} / சேமி`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
