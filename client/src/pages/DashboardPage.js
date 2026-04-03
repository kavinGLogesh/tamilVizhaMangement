import { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Tooltip,
  CircularProgress, Alert, Fade, useMediaQuery, useTheme,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CreditModal from '../components/CreditModal';
import DebitModal from '../components/DebitModal';
import AddRecordModal from '../components/AddRecordModal';

// ─── Constants ──────────────────────────────────────────────────────────────
const GOLD_RATE   = 7500;   // ₹ per gram (24 carat basis)
const SILVER_RATE = 90;     // ₹ per gram

const FN = {
  kaathu_kuthu:           { ta:'காத்து குத்து',           en:'Ear Piercing',  color:'#E91E63', icon:'💍' },
  kalyanam:               { ta:'கல்யாணம்',                en:'Wedding',        color:'#9C27B0', icon:'💒' },
  veetu_punniyahavasanam: { ta:'வீட்டு புண்ணியாஹவசனம்',  en:'House Warming',  color:'#FF5722', icon:'🏠' },
  valaikappu:             { ta:'வளைகாப்பு',               en:'Baby Shower',    color:'#2196F3', icon:'🤱' },
  virundhu:               { ta:'விருந்து',                 en:'Feast',          color:'#4CAF50', icon:'🍽️' }
};

function calcGoldValue(carats, grams) {
  if (!grams || grams <= 0) return 0;
  return ((carats || 22) / 24) * grams * GOLD_RATE;
}

function fmt(n) {
  return Math.round(n).toLocaleString('en-IN');
}

// ─── Finish Summary Dialog ───────────────────────────────────────────────────
function FinishDialog({ open, onClose, credits, debits }) {
  const totalCash      = credits.reduce((s, c) => s + (c.cashAmount || 0), 0);
  const totalGoldVal   = credits.reduce((s, c) => s + calcGoldValue(c.goldCarats, c.goldGrams), 0);
  const totalSilverVal = credits.reduce((s, c) => s + ((c.silverGrams || 0) * SILVER_RATE), 0);
  const totalCredit    = totalCash + totalGoldVal + totalSilverVal;
  const totalDebit     = debits.reduce((s, d) => s + (d.amount || 0), 0);
  const balance        = totalCredit - totalDebit;
  const isProfit       = balance >= 0;

  const totalGoldGrams   = credits.reduce((s, c) => s + (c.goldGrams || 0), 0);
  const totalSilverGrams = credits.reduce((s, c) => s + (c.silverGrams || 0), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx:{ borderRadius:4, overflow:'hidden' } }}>
      <Box sx={{ height:5, background: isProfit ? 'linear-gradient(90deg,#1B5E20,#66BB6A)' : 'linear-gradient(90deg,#7F0000,#EF5350)' }} />

      <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', pt:2.5, px:3 }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <EmojiEventsIcon sx={{ color: isProfit ? '#1B5E20' : '#7F0000', fontSize:28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ fontFamily:"'Noto Serif Tamil',serif", color: isProfit ? '#1B5E20' : '#7F0000', lineHeight:1.2 }}>
              விழா முடிவு / Function Summary
            </Typography>
            <Typography variant="caption" color="text.secondary">Credit vs Debit comparison</Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ px:3, pb:2 }}>
        {/* Credit vs Debit cards */}
        <Grid container spacing={2} sx={{ mb:2.5 }}>
          <Grid item xs={6}>
            <Box sx={{ p:2, borderRadius:3, bgcolor:'rgba(27,94,32,0.07)', border:'1.5px solid rgba(27,94,32,0.2)', textAlign:'center' }}>
              <TrendingUpIcon sx={{ color:'#1B5E20', fontSize:26, mb:0.5 }} />
              <Typography variant="h5" fontWeight={800} color="#1B5E20">₹{fmt(totalCredit)}</Typography>
              <Typography variant="caption" color="text.secondary">Total Credit / மொத்த வரவு</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p:2, borderRadius:3, bgcolor:'rgba(127,0,0,0.07)', border:'1.5px solid rgba(127,0,0,0.2)', textAlign:'center' }}>
              <TrendingDownIcon sx={{ color:'#C62828', fontSize:26, mb:0.5 }} />
              <Typography variant="h5" fontWeight={800} color="#C62828">₹{fmt(totalDebit)}</Typography>
              <Typography variant="caption" color="text.secondary">Total Debit / மொத்த செலவு</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Breakdown table */}
        <Paper sx={{ borderRadius:3, overflow:'hidden', mb:2.5, border:'1px solid rgba(139,26,26,0.08)' }}>
          <Box sx={{ px:2, py:1.2, bgcolor:'rgba(139,26,26,0.03)', borderBottom:'1px solid rgba(139,26,26,0.07)' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform:'uppercase', letterSpacing:1 }}>
              Credit Breakdown
            </Typography>
          </Box>
          {[
            ['💵 Cash Received',         `₹${fmt(totalCash)}`],
            [`🥇 Gold (${fmt(totalGoldGrams)}g total)`, `≈ ₹${fmt(totalGoldVal)}`],
            [`🥈 Silver (${fmt(totalSilverGrams)}g total)`, `≈ ₹${fmt(totalSilverVal)}`],
            ['📊 Total Credit',           `₹${fmt(totalCredit)}`],
            ['💸 Total Debit',            `₹${fmt(totalDebit)}`],
          ].map(([label, val], i) => (
            <Box key={i} sx={{
              px:2.5, py:1.3, display:'flex', justifyContent:'space-between', alignItems:'center',
              borderBottom: i < 4 ? '1px solid rgba(139,26,26,0.06)' : 'none',
              bgcolor: i === 4 ? 'rgba(127,0,0,0.03)' : i === 3 ? 'rgba(27,94,32,0.03)' : 'transparent'
            }}>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
              <Typography variant="body2" fontWeight={700}
                sx={{ color: i===3 ? '#1B5E20' : i===4 ? '#C62828' : 'text.primary' }}>
                {val}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Result banner */}
        <Box sx={{
          p:3, borderRadius:3, textAlign:'center',
          background: isProfit ? 'linear-gradient(135deg,rgba(27,94,32,0.1),rgba(67,160,71,0.08))' : 'linear-gradient(135deg,rgba(127,0,0,0.09),rgba(239,83,80,0.07))',
          border:`2px solid ${isProfit ? 'rgba(27,94,32,0.25)' : 'rgba(127,0,0,0.25)'}`
        }}>
          <Typography sx={{ fontSize:'2.8rem', mb:0.5 }}>{isProfit ? '🎉' : '😔'}</Typography>
          <Typography variant="h5" fontWeight={800} color={isProfit ? '#1B5E20' : '#7F0000'}
            sx={{ fontFamily:"'Noto Serif Tamil',serif", mb:0.3 }}>
            {isProfit ? 'லாபம் / Profit' : 'நஷ்டம் / Loss'}
          </Typography>
          <Typography variant="h4" fontWeight={900} color={isProfit ? '#1B5E20' : '#C62828'}>
            {isProfit ? '+' : '-'}₹{fmt(Math.abs(balance))}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display:'block', mt:1 }}>
            Gold rate: ₹{GOLD_RATE}/g · Silver: ₹{SILVER_RATE}/g (approximate market rates)
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px:3, pb:3 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ borderRadius:3, py:1.2 }}>
          மூடு / Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ value, sub, label, gradient, icon }) {
  return (
    <Card sx={{ background:gradient, color:'#FFF8E7', height:'100%', position:'relative', overflow:'hidden', borderRadius:'16px !important' }}>
      <Box sx={{ position:'absolute', right:-10, top:-10, fontSize:'3.5rem', opacity:0.1, userSelect:'none', pointerEvents:'none' }}>{icon}</Box>
      <CardContent sx={{ position:'relative', zIndex:1, pb:'12px !important' }}>
        <Typography variant="h4" fontWeight={800} sx={{ lineHeight:1.1, fontSize:{ xs:'1.4rem', md:'1.7rem' } }}>{value}</Typography>
        {sub && <Typography variant="caption" sx={{ opacity:0.8, display:'block', mb:0.2 }}>{sub}</Typography>}
        <Typography variant="caption" sx={{ opacity:0.72, fontSize:'0.72rem' }}>{label}</Typography>
      </CardContent>
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const muiTheme    = useTheme();
  const isMobile    = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const lang        = i18n.language;
  const viewRef     = useRef(null);

  const [tab, setTab]         = useState(0);   // 0=Guests 1=Credit 2=Debit
  const [records, setRecords] = useState([]);
  const [credits, setCredits] = useState([]);
  const [debits,  setDebits]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');

  const [guestOpen,  setGuestOpen]  = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const [debitOpen,  setDebitOpen]  = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);

  const [editGuest,  setEditGuest]  = useState(null);
  const [editCredit, setEditCredit] = useState(null);
  const [editDebit,  setEditDebit]  = useState(null);

  const userFn   = user?.functionType || '';
  const userDate = user?.registeredDate ? dayjs(user.registeredDate).format('YYYY-MM-DD') : '';
  const fnInfo   = FN[userFn];

  // ── Fetch all data ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchAll();
  }, [user]); // eslint-disable-line

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rRes, cRes, dRes] = await Promise.all([
        axios.get('/api/records').catch(() => ({ data:{ records:[] } })),
        axios.get('/api/credits').catch(() => ({ data:{ entries:[] } })),
        axios.get('/api/debits').catch(() => ({ data:{ entries:[] } })),
      ]);
      setRecords(rRes.data.records || []);
      setCredits(cRes.data.entries  || []);
      setDebits( dRes.data.entries  || []);
    } catch { setError('Failed to load data. Please refresh.'); }
    finally { setLoading(false); }
  };

  // ── Guest CRUD ──────────────────────────────────────────────────────────────
  const saveGuest = async (data) => {
    if (editGuest) {
      const r = await axios.put('/api/records/' + editGuest._id, data);
      setRecords(p => p.map(x => x._id === editGuest._id ? r.data.record : x));
      setEditGuest(null);
    } else {
      const r = await axios.post('/api/records', data);
      setRecords(p => [r.data.record, ...p]);
    }
  };
  const deleteGuest = async (id) => {
    if (!window.confirm('Delete this guest record?')) return;
    await axios.delete('/api/records/' + id);
    setRecords(p => p.filter(x => x._id !== id));
  };

  // ── Credit CRUD ─────────────────────────────────────────────────────────────
  const saveCredit = async (data) => {
    const payload = { ...data, functionType: userFn };
    if (editCredit) {
      const r = await axios.put('/api/credits/' + editCredit._id, payload);
      setCredits(p => p.map(x => x._id === editCredit._id ? r.data.entry : x));
      setEditCredit(null);
    } else {
      const r = await axios.post('/api/credits', payload);
      setCredits(p => [r.data.entry, ...p]);
    }
  };
  const deleteCredit = async (id) => {
    if (!window.confirm('Delete this credit entry?')) return;
    await axios.delete('/api/credits/' + id);
    setCredits(p => p.filter(x => x._id !== id));
  };

  // ── Debit CRUD ──────────────────────────────────────────────────────────────
  const saveDebit = async (data) => {
    const payload = { ...data, functionType: userFn };
    if (editDebit) {
      const r = await axios.put('/api/debits/' + editDebit._id, payload);
      setDebits(p => p.map(x => x._id === editDebit._id ? r.data.entry : x));
      setEditDebit(null);
    } else {
      const r = await axios.post('/api/debits', payload);
      setDebits(p => [r.data.entry, ...p]);
    }
  };
  const deleteDebit = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await axios.delete('/api/debits/' + id);
    setDebits(p => p.filter(x => x._id !== id));
  };

  // ── Totals ───────────────────────────────────────────────────────────────────
  const totalCash      = credits.reduce((s, c) => s + (c.cashAmount || 0), 0);
  const totalGoldVal   = credits.reduce((s, c) => s + calcGoldValue(c.goldCarats, c.goldGrams), 0);
  const totalSilverVal = credits.reduce((s, c) => s + ((c.silverGrams || 0) * SILVER_RATE), 0);
  const totalCredit    = totalCash + totalGoldVal + totalSilverVal;
  const totalDebit     = debits.reduce((s, d) => s + (d.amount || 0), 0);
  const balance        = totalCredit - totalDebit;

  // ── Search filter ────────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filtGuests  = records.filter(r  => (r.name||'').toLowerCase().includes(q) || (r.address||'').toLowerCase().includes(q));
  const filtCredits = credits.filter(c  => (c.name||'').toLowerCase().includes(q) || (c.address||'').toLowerCase().includes(q));
  const filtDebits  = debits.filter( d  => (d.purpose||'').toLowerCase().includes(q));

  // ── CSV Export ───────────────────────────────────────────────────────────────
  const exportCSV = () => {
    let rows;
    if (tab === 0) {
      rows = [['Name','Address','Amount','Function','Date'],
        ...filtGuests.map(r => [r.name, r.address, r.amount, FN[r.functionType]?.en||r.functionType, dayjs(r.date).format('DD/MM/YYYY')])];
    } else if (tab === 1) {
      rows = [['Name','Address','Cash','Gold Carats','Gold Grams','Silver Grams','Gold Value','Date','Note'],
        ...filtCredits.map(c => [c.name, c.address, c.cashAmount, c.goldCarats, c.goldGrams, c.silverGrams,
          Math.round(calcGoldValue(c.goldCarats, c.goldGrams)), dayjs(c.date).format('DD/MM/YYYY'), c.note||''])];
    } else {
      rows = [['Purpose','Amount','Date','Note'],
        ...filtDebits.map(d => [d.purpose, d.amount, dayjs(d.date).format('DD/MM/YYYY'), d.note||''])];
    }
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `vizha-${['guests','credit','debit'][tab]}.csv`;
    a.click();
  };

  if (!user) return null;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight:'100vh', bgcolor:'background.default' }}>
      <Navbar />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ background:'linear-gradient(145deg,#4A0A0A 0%,#8B1A1A 60%,#9A6508 100%)', pt:{ xs:3, md:4 }, pb:{ xs:7, md:9 }, px:2, position:'relative', overflow:'hidden' }}>
        {[300,520].map((s,i) => (
          <Box key={i} sx={{ position:'absolute', borderRadius:'50%', border:'1px solid rgba(255,248,231,0.05)', width:s, height:s, top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
        ))}
        <Container maxWidth="lg" sx={{ position:'relative', zIndex:1 }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:2 }}>
            <Box>
              <Typography variant="h4" sx={{ color:'#FFF8E7', fontFamily:"'Noto Serif Tamil',serif", fontWeight:700, fontSize:{ xs:'1.3rem', md:'1.8rem' }, mb:1 }}>
                🙏 வணக்கம், {user.username}!
              </Typography>
              <Typography variant="body2" sx={{ color:'rgba(255,248,231,0.65)', mb:1.5 }}>
                {dayjs().format('dddd, DD MMMM YYYY')}
              </Typography>
              <Box sx={{ display:'flex', gap:1, flexWrap:'wrap' }}>
                {fnInfo && (
                  <Chip label={`${fnInfo.icon} ${lang==='ta' ? fnInfo.ta : fnInfo.en}`} size="small"
                    sx={{ bgcolor:'rgba(255,248,231,0.15)', color:'#FFF8E7', fontFamily:"'Noto Serif Tamil',serif", fontWeight:600 }} />
                )}
                {userDate && (
                  <Chip label={`📅 ${dayjs(userDate).format('DD MMM YYYY')}`} size="small"
                    sx={{ bgcolor:'rgba(200,134,10,0.25)', color:'#FFF8E7', fontWeight:600 }} />
                )}
              </Box>
            </Box>

            <Box sx={{ display:'flex', gap:1.5, flexWrap:'wrap' }}>
              <Button variant="outlined" startIcon={<VisibilityIcon />}
                onClick={() => viewRef.current?.scrollIntoView({ behavior:'smooth' })}
                sx={{ color:'#FFF8E7', borderColor:'rgba(255,248,231,0.4)', borderWidth:1.5, '&:hover':{ borderColor:'#FFF8E7', bgcolor:'rgba(255,255,255,0.08)' } }}>
                {isMobile ? 'View' : 'View Dashboard'}
              </Button>
              <Button variant="contained" startIcon={<CheckCircleIcon />}
                onClick={() => setFinishOpen(true)}
                sx={{ background:'linear-gradient(135deg,#1B5E20,#43A047)', '&:hover':{ background:'linear-gradient(135deg,#0d3b10,#1B5E20)' }, fontWeight:700, boxShadow:'0 4px 18px rgba(27,94,32,0.45)' }}>
                {isMobile ? 'Finish' : 'Finish / முடிந்தது'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Stat Cards (overlap hero) ───────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ mt:{ xs:-4, md:-5 }, position:'relative', zIndex:10, px:{ xs:2, md:3 } }}>
        <Grid container spacing={{ xs:1.5, md:2 }}>
          <Grid item xs={6} md={3}>
            <StatCard
              value={records.length}
              label="Guests / விருந்தினர்"
              gradient="linear-gradient(135deg,#5C0F0F,#8B1A1A)"
              icon="👥"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              value={`₹${fmt(totalCredit)}`}
              sub={`Cash: ₹${fmt(totalCash)}`}
              label="Total Credit / மொத்த வரவு"
              gradient="linear-gradient(135deg,#1B5E20,#2E7D32)"
              icon="💰"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              value={`₹${fmt(totalDebit)}`}
              label="Total Debit / மொத்த செலவு"
              gradient="linear-gradient(135deg,#7F0000,#C62828)"
              icon="💸"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              value={`${balance >= 0 ? '+' : '-'}₹${fmt(Math.abs(balance))}`}
              label={balance >= 0 ? 'Profit / லாபம் 📈' : 'Loss / நஷ்டம் 📉'}
              gradient={balance >= 0 ? 'linear-gradient(135deg,#9A6508,#C8860A)' : 'linear-gradient(135deg,#4A148C,#6A1B9A)'}
              icon={balance >= 0 ? '🏆' : '⚠️'}
            />
          </Grid>
        </Grid>
      </Container>

      {/* ── Main Table Card ─────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py:4, px:{ xs:2, md:3 } }} ref={viewRef}>
        {error && (
          <Alert severity="error" sx={{ mb:3, borderRadius:3 }} onClose={() => setError('')}>{error}</Alert>
        )}

        <Paper sx={{ borderRadius:4, overflow:'hidden', boxShadow:'0 4px 30px rgba(139,26,26,0.09)', border:'1px solid rgba(139,26,26,0.08)' }}>

          {/* Toolbar */}
          <Box sx={{ px:{ xs:2, md:3 }, py:2, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:1.5, borderBottom:'1px solid rgba(139,26,26,0.07)' }}>
            <Typography variant="h6" sx={{ fontFamily:"'Noto Serif Tamil',serif", color:'primary.main', fontWeight:700, fontSize:{ xs:'1rem', md:'1.1rem' } }}>
              📊 Dashboard / பதிவுகள்
            </Typography>
            <Box sx={{ display:'flex', gap:1, flexWrap:'wrap', alignItems:'center' }}>
              <TextField size="small" placeholder="Search..." value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment:<InputAdornment position="start"><SearchIcon sx={{ fontSize:17, color:'text.secondary' }}/></InputAdornment> }}
                sx={{ width:{ xs:120, sm:180 }, '& .MuiOutlinedInput-root':{ borderRadius:3 } }} />
              <Tooltip title="Export CSV">
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCSV} size="small" sx={{ borderRadius:3 }}>
                  CSV
                </Button>
              </Tooltip>
              {tab === 0 && (
                <Button variant="contained" startIcon={<AddIcon />} size="small"
                  onClick={() => { setEditGuest(null); setGuestOpen(true); }}
                  sx={{ borderRadius:3, whiteSpace:'nowrap' }}>
                  {isMobile ? 'Add' : 'Add Guest / சேர்'}
                </Button>
              )}
              {tab === 1 && (
                <Button variant="contained" startIcon={<AddIcon />} size="small"
                  onClick={() => { setEditCredit(null); setCreditOpen(true); }}
                  sx={{ borderRadius:3, whiteSpace:'nowrap', background:'linear-gradient(135deg,#1B5E20,#2E7D32)', '&:hover':{ background:'linear-gradient(135deg,#0d3b10,#1B5E20)' } }}>
                  {isMobile ? 'Credit' : 'Add Credit / வரவு'}
                </Button>
              )}
              {tab === 2 && (
                <Button variant="contained" startIcon={<AddIcon />} size="small"
                  onClick={() => { setEditDebit(null); setDebitOpen(true); }}
                  sx={{ borderRadius:3, whiteSpace:'nowrap', background:'linear-gradient(135deg,#7F0000,#C62828)', '&:hover':{ background:'linear-gradient(135deg,#500000,#7F0000)' } }}>
                  {isMobile ? 'Debit' : 'Add Debit / செலவு'}
                </Button>
              )}
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setSearch(''); }}
            sx={{
              px:{ xs:1, md:2 },
              borderBottom:'1px solid rgba(139,26,26,0.07)',
              '& .MuiTab-root':{ fontWeight:600, fontSize:{ xs:'0.76rem', md:'0.85rem' }, minWidth:{ xs:'auto', md:130 }, textTransform:'none' },
              '& .MuiTabs-indicator':{ height:3, borderRadius:2 }
            }}>
            <Tab label={`👥 Guests (${records.length})`} sx={{ '&.Mui-selected':{ color:'primary.main' } }} />
            <Tab label={`✅ Credit (${credits.length})`} sx={{ '&.Mui-selected':{ color:'#1B5E20' } }} />
            <Tab label={`❌ Debit (${debits.length})`}   sx={{ '&.Mui-selected':{ color:'#C62828' } }} />
          </Tabs>

          {/* Table content */}
          {loading ? (
            <Box sx={{ textAlign:'center', py:10 }}>
              <CircularProgress sx={{ color:'primary.main' }} size={44} />
            </Box>
          ) : (
            <Box sx={{ overflowX:'auto' }}>

              {/* ── GUESTS TAB ────────────────────────────────────────────────── */}
              {tab === 0 && (
                <Table sx={{ minWidth:580 }}>
                  <TableHead>
                    <TableRow sx={{ '& th':{ bgcolor:'#5C0F0F', color:'#FFF8E7', fontWeight:700, fontSize:'0.82rem', py:1.8 } }}>
                      <TableCell sx={{ width:42 }}>#</TableCell>
                      <TableCell>பெயர் / Name</TableCell>
                      <TableCell>முகவரி / Address</TableCell>
                      <TableCell>தொகை / Amount</TableCell>
                      <TableCell>விழா</TableCell>
                      <TableCell>தேதி</TableCell>
                      <TableCell align="center" sx={{ width:90 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtGuests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py:7, color:'text.secondary' }}>
                          <PeopleIcon sx={{ fontSize:36, opacity:0.3, mb:1, display:'block', mx:'auto' }} />
                          No guests yet. Click "Add Guest" to start.
                        </TableCell>
                      </TableRow>
                    ) : filtGuests.map((r, i) => (
                      <Fade in key={r._id} timeout={100 + i * 25}>
                        <TableRow sx={{ '&:hover':{ bgcolor:'rgba(200,134,10,0.04)' }, bgcolor: i%2===0 ? 'rgba(139,26,26,0.015)' : 'background.paper' }}>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.77rem' }}>{i+1}</TableCell>
                          <TableCell sx={{ fontWeight:700, color:'primary.main', whiteSpace:'nowrap' }}>{r.name}</TableCell>
                          <TableCell sx={{ color:'text.secondary', maxWidth:200, fontSize:'0.82rem' }}>{r.address}</TableCell>
                          <TableCell>
                            <Typography fontWeight={800} color="secondary.dark" sx={{ whiteSpace:'nowrap' }}>
                              ₹{Number(r.amount||0).toLocaleString('en-IN')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {r.functionType && FN[r.functionType] && (
                              <Chip size="small"
                                label={`${FN[r.functionType].icon} ${lang==='ta' ? FN[r.functionType].ta : FN[r.functionType].en}`}
                                sx={{ bgcolor:`${FN[r.functionType].color}18`, color:FN[r.functionType].color, fontWeight:700, fontSize:'0.7rem', fontFamily:"'Noto Serif Tamil',serif", maxWidth:160 }} />
                            )}
                          </TableCell>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.8rem', whiteSpace:'nowrap' }}>
                            {dayjs(r.date).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display:'flex', justifyContent:'center', gap:0.5 }}>
                              <Tooltip title="Edit">
                                <IconButton size="small" sx={{ color:'#1565C0', '&:hover':{ bgcolor:'rgba(21,101,192,0.1)' } }}
                                  onClick={() => { setEditGuest(r); setGuestOpen(true); }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" sx={{ '&:hover':{ bgcolor:'rgba(198,40,40,0.1)' } }}
                                  onClick={() => deleteGuest(r._id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                    {filtGuests.length > 0 && (
                      <TableRow sx={{ bgcolor:'rgba(139,26,26,0.04)' }}>
                        <TableCell colSpan={3} sx={{ fontWeight:700, color:'primary.main', fontSize:'0.84rem' }}>
                          மொத்தம் / TOTAL ({filtGuests.length} guests)
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={900} color="secondary.dark">
                            ₹{filtGuests.reduce((s,r) => s+(r.amount||0),0).toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={3} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {/* ── CREDIT TAB ────────────────────────────────────────────────── */}
              {tab === 1 && (
                <Table sx={{ minWidth:750 }}>
                  <TableHead>
                    <TableRow sx={{ '& th':{ bgcolor:'#1B5E20', color:'#fff', fontWeight:700, fontSize:'0.82rem', py:1.8 } }}>
                      <TableCell sx={{ width:42 }}>#</TableCell>
                      <TableCell>பெயர் / Name</TableCell>
                      <TableCell>முகவரி</TableCell>
                      <TableCell>Cash (₹)</TableCell>
                      <TableCell>Gold Carats</TableCell>
                      <TableCell>Gold Grams</TableCell>
                      <TableCell>Silver (g)</TableCell>
                      <TableCell>Gold Value</TableCell>
                      <TableCell>தேதி</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell align="center" sx={{ width:90 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtCredits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} align="center" sx={{ py:7, color:'text.secondary' }}>
                          No credit entries yet. Click "Add Credit" to record cash/gold/silver received.
                        </TableCell>
                      </TableRow>
                    ) : filtCredits.map((c, i) => (
                      <Fade in key={c._id} timeout={100 + i * 25}>
                        <TableRow sx={{ '&:hover':{ bgcolor:'rgba(27,94,32,0.04)' }, bgcolor: i%2===0 ? 'rgba(27,94,32,0.015)' : 'background.paper' }}>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.77rem' }}>{i+1}</TableCell>
                          <TableCell sx={{ fontWeight:700, color:'#1B5E20', whiteSpace:'nowrap' }}>{c.name}</TableCell>
                          <TableCell sx={{ color:'text.secondary', maxWidth:150, fontSize:'0.8rem' }}>{c.address||'—'}</TableCell>
                          <TableCell>
                            <Typography fontWeight={800} color="#1B5E20" sx={{ whiteSpace:'nowrap' }}>
                              {c.cashAmount > 0 ? `₹${Number(c.cashAmount).toLocaleString('en-IN')}` : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {c.goldGrams > 0 ? (
                              <Chip size="small" label={`${c.goldCarats || 22}ct`}
                                sx={{ bgcolor:'rgba(200,134,10,0.12)', color:'#9A6508', fontWeight:700, fontSize:'0.72rem' }} />
                            ) : <Typography variant="body2" color="text.disabled">—</Typography>}
                          </TableCell>
                          <TableCell>
                            {c.goldGrams > 0 ? (
                              <Typography variant="body2" fontWeight={700} color="#9A6508">{c.goldGrams}g</Typography>
                            ) : <Typography variant="body2" color="text.disabled">—</Typography>}
                          </TableCell>
                          <TableCell>
                            {c.silverGrams > 0 ? (
                              <Typography variant="body2" fontWeight={700} color="#757575">{c.silverGrams}g</Typography>
                            ) : <Typography variant="body2" color="text.disabled">—</Typography>}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" fontWeight={700} color="#9A6508">
                              {calcGoldValue(c.goldCarats, c.goldGrams) > 0
                                ? `≈ ₹${fmt(calcGoldValue(c.goldCarats, c.goldGrams))}`
                                : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.8rem', whiteSpace:'nowrap' }}>
                            {dayjs(c.date).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.77rem', maxWidth:100 }}>
                            {c.note || '—'}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display:'flex', justifyContent:'center', gap:0.5 }}>
                              <Tooltip title="Edit">
                                <IconButton size="small" sx={{ color:'#1565C0', '&:hover':{ bgcolor:'rgba(21,101,192,0.1)' } }}
                                  onClick={() => { setEditCredit(c); setCreditOpen(true); }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => deleteCredit(c._id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                    {filtCredits.length > 0 && (
                      <TableRow sx={{ bgcolor:'rgba(27,94,32,0.06)' }}>
                        <TableCell colSpan={3} sx={{ fontWeight:700, color:'#1B5E20', fontSize:'0.84rem' }}>
                          மொத்தம் / TOTAL ({filtCredits.length})
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={900} color="#1B5E20">₹{fmt(totalCash)}</Typography>
                        </TableCell>
                        <TableCell />
                        <TableCell>
                          <Typography variant="caption" fontWeight={700} color="#9A6508">
                            {fmt(credits.reduce((s,c)=>s+(c.goldGrams||0),0))}g
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={700} color="#757575">
                            {fmt(credits.reduce((s,c)=>s+(c.silverGrams||0),0))}g
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={900} color="#9A6508">≈ ₹{fmt(totalGoldVal)}</Typography>
                        </TableCell>
                        <TableCell colSpan={3} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {/* ── DEBIT TAB ─────────────────────────────────────────────────── */}
              {tab === 2 && (
                <Table sx={{ minWidth:520 }}>
                  <TableHead>
                    <TableRow sx={{ '& th':{ bgcolor:'#7F0000', color:'#fff', fontWeight:700, fontSize:'0.82rem', py:1.8 } }}>
                      <TableCell sx={{ width:42 }}>#</TableCell>
                      <TableCell>நோக்கம் / Purpose</TableCell>
                      <TableCell>தொகை / Amount</TableCell>
                      <TableCell>தேதி / Date</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell align="center" sx={{ width:90 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtDebits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py:7, color:'text.secondary' }}>
                          No expenses yet. Click "Add Debit" to record expenses.
                        </TableCell>
                      </TableRow>
                    ) : filtDebits.map((d, i) => (
                      <Fade in key={d._id} timeout={100 + i * 25}>
                        <TableRow sx={{ '&:hover':{ bgcolor:'rgba(127,0,0,0.04)' }, bgcolor: i%2===0 ? 'rgba(127,0,0,0.015)' : 'background.paper' }}>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.77rem' }}>{i+1}</TableCell>
                          <TableCell sx={{ fontWeight:700, color:'#7F0000' }}>{d.purpose}</TableCell>
                          <TableCell>
                            <Typography fontWeight={800} color="#C62828" sx={{ whiteSpace:'nowrap' }}>
                              ₹{Number(d.amount||0).toLocaleString('en-IN')}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.8rem', whiteSpace:'nowrap' }}>
                            {dayjs(d.date).format('DD/MM/YYYY')}
                          </TableCell>
                          <TableCell sx={{ color:'text.secondary', fontSize:'0.77rem', maxWidth:160 }}>
                            {d.note || '—'}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display:'flex', justifyContent:'center', gap:0.5 }}>
                              <Tooltip title="Edit">
                                <IconButton size="small" sx={{ color:'#1565C0', '&:hover':{ bgcolor:'rgba(21,101,192,0.1)' } }}
                                  onClick={() => { setEditDebit(d); setDebitOpen(true); }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => deleteDebit(d._id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
                    {filtDebits.length > 0 && (
                      <TableRow sx={{ bgcolor:'rgba(127,0,0,0.06)' }}>
                        <TableCell colSpan={2} sx={{ fontWeight:700, color:'#7F0000', fontSize:'0.84rem' }}>
                          மொத்தம் / TOTAL ({filtDebits.length})
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={900} color="#C62828">₹{fmt(totalDebit)}</Typography>
                        </TableCell>
                        <TableCell colSpan={3} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

            </Box>
          )}

          {/* Footer */}
          <Box sx={{ px:3, py:2, bgcolor:'rgba(139,26,26,0.02)', borderTop:'1px solid rgba(139,26,26,0.07)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:1 }}>
            <Typography variant="caption" color="text.secondary">
              {[filtGuests.length, filtCredits.length, filtDebits.length][tab]} records
              {search && ` (filtered from ${[records.length, credits.length, debits.length][tab]})`}
            </Typography>
            <Typography variant="caption" fontWeight={700} color={balance >= 0 ? 'success.main' : 'error.main'}>
              Balance: {balance >= 0 ? '+' : '-'}₹{fmt(Math.abs(balance))} ({balance >= 0 ? 'Profit 📈' : 'Loss 📉'})
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <AddRecordModal
        open={guestOpen}
        onClose={() => { setGuestOpen(false); setEditGuest(null); }}
        onSave={saveGuest}
        userFunctionType={userFn}
        userDate={userDate}
        editData={editGuest}
      />
      <CreditModal
        open={creditOpen}
        onClose={() => { setCreditOpen(false); setEditCredit(null); }}
        onSave={saveCredit}
        editData={editCredit}
      />
      <DebitModal
        open={debitOpen}
        onClose={() => { setDebitOpen(false); setEditDebit(null); }}
        onSave={saveDebit}
        editData={editDebit}
      />
      <FinishDialog
        open={finishOpen}
        onClose={() => setFinishOpen(false)}
        credits={credits}
        debits={debits}
      />
    </Box>
  );
}
