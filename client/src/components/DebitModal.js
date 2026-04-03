import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Divider,
  Alert, CircularProgress, InputAdornment, Grid, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import NotesIcon from '@mui/icons-material/Notes';
import AssignmentIcon from '@mui/icons-material/Assignment';

const PURPOSES = [
  'Catering / சாப்பாடு',
  'Decoration / அலங்காரம்',
  'Photography / புகைப்படம்',
  'Videography / வீடியோ',
  'Music / இசை',
  'Venue / மண்டபம்',
  'Flowers / பூக்கள்',
  'Invitation / அழைப்பிதழ்',
  'Transport / போக்குவரத்து',
  'Clothes / ஆடை',
  'Priest / குருக்கள்',
  'Sweets / இனிப்பு',
  'Generator / ஜெனரேட்டர்',
  'Tent / கூடாரம்',
  'Other / மற்றவை',
];

const EMPTY = { purpose:'', amount:'', note:'', date:'' };

export default function DebitModal({ open, onClose, onSave, editData }) {
  const [form, setForm]     = useState(EMPTY);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    if (editData) {
      setForm({
        purpose: editData.purpose || '',
        amount:  editData.amount  != null ? String(editData.amount) : '',
        note:    editData.note    || '',
        date:    editData.date    ? editData.date.slice(0, 10) : ''
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, editData]);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.purpose.trim()) { setError('Purpose is required / நோக்கம் தேவை'); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError('Enter a valid amount / சரியான தொகை தேவை'); return; }
    setLoading(true); setError('');
    try {
      await onSave({
        purpose: form.purpose,
        amount:  Number(form.amount),
        note:    form.note,
        date:    form.date || new Date().toISOString().split('T')[0]
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx:{ borderRadius:4, overflow:'hidden' } }}>
      <Box sx={{ height:5, background:'linear-gradient(90deg,#7F0000,#EF5350)' }} />
      <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', pt:2.5, px:3, pb:1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ fontFamily:"'Noto Serif Tamil',serif", color:'#7F0000', lineHeight:1.2 }}>
            ❌ {editData ? 'Edit Expense' : 'Add Expense'} / செலவு
          </Typography>
          <Typography variant="caption" color="text.secondary">Purpose, amount & date of expense</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ bgcolor:'rgba(127,0,0,0.06)' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mx:3, borderColor:'rgba(127,0,0,0.15)' }} />

      <DialogContent sx={{ pt:2.5, px:3 }}>
        <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          {error && <Alert severity="error" sx={{ borderRadius:3 }}>{error}</Alert>}

          <TextField fullWidth label="Purpose / நோக்கம் *" value={form.purpose} onChange={set('purpose')} autoFocus
            InputProps={{ startAdornment:<InputAdornment position="start"><AssignmentIcon sx={{ color:'#7F0000', fontSize:20 }}/></InputAdornment> }}
            helperText="Type or pick below" />

          {/* Quick-pick chips */}
          <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.75 }}>
            {PURPOSES.map(p => (
              <Box key={p} onClick={() => setForm(prev => ({ ...prev, purpose: p }))}
                sx={{
                  px:1.5, py:0.4, borderRadius:5, cursor:'pointer', fontSize:'0.74rem', fontWeight:600,
                  border:`1.5px solid ${form.purpose === p ? '#7F0000' : 'rgba(127,0,0,0.2)'}`,
                  bgcolor: form.purpose === p ? 'rgba(127,0,0,0.1)' : 'transparent',
                  color: '#7F0000', transition:'all 0.15s',
                  '&:hover': { bgcolor:'rgba(127,0,0,0.07)' }
                }}>
                {p}
              </Box>
            ))}
          </Box>

          <Divider sx={{ borderColor:'rgba(127,0,0,0.1)' }} />

          <TextField fullWidth label="Amount / தொகை (₹) *" value={form.amount} onChange={set('amount')} type="number"
            inputProps={{ min:0, step:1 }}
            InputProps={{ startAdornment:<InputAdornment position="start"><CurrencyRupeeIcon sx={{ color:'#7F0000', fontSize:20 }}/></InputAdornment> }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Date / தேதி" value={form.date} onChange={set('date')} type="date" InputLabelProps={{ shrink:true }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Note (optional)" value={form.note} onChange={set('note')}
                InputProps={{ startAdornment:<InputAdornment position="start"><NotesIcon sx={{ color:'text.secondary', fontSize:18 }}/></InputAdornment> }} />
            </Grid>
          </Grid>

          {/* Preview */}
          {Number(form.amount) > 0 && form.purpose && (
            <Box sx={{ p:2, borderRadius:3, bgcolor:'rgba(127,0,0,0.06)', border:'1.5px solid rgba(127,0,0,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <Typography variant="body2" color="#7F0000" fontWeight={600} sx={{ maxWidth:'60%' }}>{form.purpose}</Typography>
              <Typography variant="h6" fontWeight={900} color="#C62828">
                ₹{Number(form.amount).toLocaleString('en-IN')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px:3, pb:3, pt:2, gap:1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius:3, px:3, borderColor:'#7F0000', color:'#7F0000' }}>
          Cancel / ரத்து
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}
          sx={{ borderRadius:3, minWidth:140, background:'linear-gradient(135deg,#7F0000,#C62828)', '&:hover':{ background:'linear-gradient(135deg,#500000,#7F0000)' } }}>
          {loading ? <CircularProgress size={20} sx={{ color:'#fff' }}/> : `💾 ${editData ? 'Update' : 'Save'} / சேமி`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
