
import { useState, useRef, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, InputBase, Paper, Fade, Avatar,
  ListItemIcon, Divider, Tooltip, useMediaQuery, useTheme, Drawer, List, ListItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TranslateIcon from '@mui/icons-material/Translate';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const FUNCTION_LABELS = {
  kaathu_kuthu:           { ta: 'காத்து குத்து',            en: 'Ear Piercing',    icon: '💍', color: '#E91E63' },
  kalyanam:               { ta: 'கல்யாணம்',                 en: 'Wedding',          icon: '💒', color: '#9C27B0' },
  veetu_punniyahavasanam: { ta: 'வீட்டு புண்ணியாஹவசனம்',   en: 'House Warming',    icon: '🏠', color: '#FF5722' },
  valaikappu:             { ta: 'வளைகாப்பு',                en: 'Baby Shower',      icon: '🤱', color: '#2196F3' },
  virundhu:               { ta: 'விருந்து',                  en: 'Feast',            icon: '🍽️', color: '#4CAF50' }
};

const Navbar = ({ onLogin, onRegister }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const lang = i18n.language;

  const [langAnchor, setLangAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchQuery.trim() || !user) { setSearchResults([]); return; }
      setSearching(true);
      try {
        const res = await axios.get('/api/records');
        const all = res.data.records || [];
        const filtered = all.filter(r =>
          r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.address?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 6));
      } catch { setSearchResults([]); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, user]);

  const handleSearchClose = () => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); };

  const setLang = (l) => { i18n.changeLanguage(l); setLangAnchor(null); };

  const logoText = lang === 'ta' ? 'விழா மேலாண்மை' : 'Vizha Management';

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ zIndex: 1200 }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, minHeight: { xs: 60, md: 68 } }}>
          {/* Logo */}
          <Typography variant="h6" onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', fontFamily: "'Noto Serif Tamil', serif", letterSpacing: 0.5, color: '#FFF8E7',
                  fontSize: { xs: '1rem', md: '1.2rem' }, flexShrink: 0,
                  textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            🪔 {logoText}
          </Typography>

          {/* Desktop Actions */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search (only when logged in) */}
              {user && (
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    bgcolor: 'rgba(255,248,231,0.12)', borderRadius: 3, px: 2, py: 0.6,
                    border: '1px solid rgba(255,248,231,0.2)', transition: 'all 0.3s',
                    '&:hover': { bgcolor: 'rgba(255,248,231,0.18)' },
                    minWidth: searchOpen ? 260 : 140
                  }}>
                    <SearchIcon sx={{ color: 'rgba(255,248,231,0.8)', fontSize: 18 }} />
                    <InputBase
                      inputRef={searchRef}
                      placeholder="Search name / பெயர் தேடு"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                      onFocus={() => setSearchOpen(true)}
                      sx={{ color: '#FFF8E7', fontSize: '0.85rem', '& input::placeholder': { color: 'rgba(255,248,231,0.6)', fontSize: '0.82rem' } }}
                    />
                    {searchQuery && (
                      <IconButton size="small" onClick={handleSearchClose} sx={{ color: 'rgba(255,248,231,0.7)', p: 0.2 }}>
                        <CloseIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Search Dropdown */}
                  {searchOpen && searchQuery && (
                    <Paper elevation={8} sx={{
                      position: 'absolute', top: '110%', right: 0, left: 0, minWidth: 300, zIndex: 9999,
                      borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(139,26,26,0.12)',
                      boxShadow: '0 16px 48px rgba(139,26,26,0.18)'
                    }}>
                      {searching ? (
                        <Box sx={{ px: 3, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textAlign: 'center' }}>
                          🔍 Searching...
                        </Box>
                      ) : searchResults.length === 0 ? (
                        <Box sx={{ px: 3, py: 2.5, color: 'text.secondary', fontSize: '0.85rem', textAlign: 'center' }}>
                          பதிவு இல்லை / No records found
                        </Box>
                      ) : (
                        searchResults.map((r, i) => (
                          <Box key={r._id || i} sx={{
                            px: 2.5, py: 1.8, borderBottom: i < searchResults.length - 1 ? '1px solid rgba(139,26,26,0.06)' : 'none',
                            '&:hover': { bgcolor: 'rgba(139,26,26,0.04)' }, cursor: 'default',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2
                          }}>
                            <Box>
                              <Typography variant="body2" fontWeight={700} color="primary.main">{r.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{r.address}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                              <Typography variant="body2" fontWeight={700} color="secondary.dark">
                                ₹{Number(r.amount).toLocaleString()}
                              </Typography>
                              <Typography variant="caption" sx={{ color: FUNCTION_LABELS[r.functionType]?.color, fontSize: '0.68rem' }}>
                                {FUNCTION_LABELS[r.functionType]?.icon} {lang === 'ta' ? FUNCTION_LABELS[r.functionType]?.ta : FUNCTION_LABELS[r.functionType]?.en}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      )}
                    </Paper>
                  )}
                </Box>
              )}

              {/* Language Toggle */}
              <Tooltip title="Language / மொழி">
                <IconButton onClick={(e) => setLangAnchor(e.currentTarget)} sx={{ color: '#FFF8E7', bgcolor: 'rgba(255,248,231,0.1)', '&:hover': { bgcolor: 'rgba(255,248,231,0.2)' } }}>
                  <TranslateIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}
                PaperProps={{ sx: { borderRadius: 2, mt: 1 } }}>
                <MenuItem onClick={() => setLang('ta')} selected={lang === 'ta'}>🇮🇳 தமிழ்</MenuItem>
                <MenuItem onClick={() => setLang('en')} selected={lang === 'en'}>🇬🇧 English</MenuItem>
              </Menu>

              {user ? (
                <>
                  <Button startIcon={<DashboardIcon />} variant="outlined"
                    sx={{ color: '#FFF8E7', borderColor: 'rgba(255,248,231,0.4)', '&:hover': { borderColor: '#FFF8E7', bgcolor: 'rgba(255,255,255,0.08)' } }}
                    onClick={() => navigate('/dashboard')}>
                    {t('nav.dashboard')}
                  </Button>
                  <Tooltip title={user.username}>
                    <IconButton onClick={(e) => setUserAnchor(e.currentTarget)}
                      sx={{ bgcolor: 'rgba(255,248,231,0.15)', '&:hover': { bgcolor: 'rgba(255,248,231,0.25)' } }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#C8860A', fontSize: '0.85rem', fontWeight: 700 }}>
                        {user.username?.[0]?.toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={() => setUserAnchor(null)}
                    PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 200 } }}>
                    <Box sx={{ px: 2.5, py: 1.5 }}>
                      <Typography variant="body2" fontWeight={700} color="primary.main">{user.username}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {FUNCTION_LABELS[user.functionType]?.icon} {lang === 'ta' ? FUNCTION_LABELS[user.functionType]?.ta : FUNCTION_LABELS[user.functionType]?.en}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { logout(); setUserAnchor(null); navigate('/'); }}>
                      <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                      {t('nav.logout')} / வெளியேறு
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button variant="outlined"
                    sx={{ color: '#FFF8E7', borderColor: 'rgba(255,248,231,0.4)', '&:hover': { borderColor: '#FFF8E7', bgcolor: 'rgba(255,255,255,0.08)' } }}
                    onClick={onLogin}>
                    உள்நுழை / Login
                  </Button>
                  <Button variant="contained"
                    sx={{ bgcolor: '#C8860A', background: 'linear-gradient(135deg, #C8860A, #E6A020)', fontWeight: 600 }}
                    onClick={onRegister}>
                    பதிவு செய் / Register
                  </Button>
                </>
              )}
            </Box>
          ) : (
            /* Mobile */
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {user && (
                <IconButton onClick={() => setSearchOpen(!searchOpen)} sx={{ color: '#FFF8E7' }}>
                  <SearchIcon />
                </IconButton>
              )}
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#FFF8E7' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {/* Mobile search bar */}
        {isMobile && searchOpen && user && (
          <Box sx={{ px: 2, pb: 1.5, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,248,231,0.15)', borderRadius: 3, px: 2, py: 0.8, border: '1px solid rgba(255,248,231,0.25)' }}>
              <SearchIcon sx={{ color: 'rgba(255,248,231,0.7)', fontSize: 18, mr: 1 }} />
              <InputBase
                autoFocus
                placeholder="Search / தேடு..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                sx={{ color: '#FFF8E7', '& input::placeholder': { color: 'rgba(255,248,231,0.6)' } }}
              />
              {searchQuery && <IconButton size="small" onClick={handleSearchClose} sx={{ color: 'rgba(255,248,231,0.7)', p: 0.2 }}><CloseIcon sx={{ fontSize: 15 }} /></IconButton>}
            </Box>
            {searchQuery && searchResults.length > 0 && (
              <Paper sx={{ position: 'absolute', left: 16, right: 16, top: '100%', zIndex: 9999, borderRadius: 2, overflow: 'hidden' }}>
                {searchResults.map((r, i) => (
                  <Box key={r._id || i} sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(139,26,26,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} color="primary.main">{r.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{r.address}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="secondary.dark">₹{Number(r.amount).toLocaleString()}</Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 270, bgcolor: 'background.paper' } }}>
        <Box sx={{ p: 2, background: 'linear-gradient(135deg, #5C0F0F, #8B1A1A)', color: '#FFF8E7' }}>
          <Typography variant="h6" sx={{ fontFamily: "'Noto Serif Tamil', serif" }}>🪔 விழா மேலாண்மை</Typography>
          {user && <Typography variant="caption" sx={{ opacity: 0.8 }}>@{user.username}</Typography>}
        </Box>
        <List sx={{ pt: 1 }}>
          <ListItem>
            <Button fullWidth startIcon={<TranslateIcon />} variant="outlined" onClick={() => { i18n.changeLanguage(lang === 'ta' ? 'en' : 'ta'); }}>
              {lang === 'ta' ? 'Switch to English' : 'தமிழிற்கு மாறு'}
            </Button>
          </ListItem>
          {user ? (
            <>
              <ListItem>
                <Button fullWidth startIcon={<DashboardIcon />} variant="contained" onClick={() => { navigate('/dashboard'); setDrawerOpen(false); }}>
                  Dashboard / டாஷ்போர்டு
                </Button>
              </ListItem>
              <ListItem>
                <Button fullWidth startIcon={<LogoutIcon />} variant="outlined" color="error" onClick={() => { logout(); setDrawerOpen(false); navigate('/'); }}>
                  Logout / வெளியேறு
                </Button>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem>
                <Button fullWidth variant="outlined" onClick={() => { onLogin(); setDrawerOpen(false); }}>Login / உள்நுழை</Button>
              </ListItem>
              <ListItem>
                <Button fullWidth variant="contained" onClick={() => { onRegister(); setDrawerOpen(false); }}>Register / பதிவு செய்</Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
