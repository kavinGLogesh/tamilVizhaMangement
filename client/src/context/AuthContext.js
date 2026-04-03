import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vizha_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('vizha_user');
    if (stored && token) {
      setUser(JSON.parse(stored));
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('vizha_token', newToken);
    localStorage.setItem('vizha_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    await axios.post('/api/auth/register', data);
  };

  const logout = () => {
    localStorage.removeItem('vizha_token');
    localStorage.removeItem('vizha_user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
