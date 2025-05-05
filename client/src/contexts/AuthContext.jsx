import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    token: null,
    role: null,
    credits: 0,
  });

  // ✅ Load userData from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  // ✅ Sync userData to localStorage whenever it changes
  useEffect(() => {
    if (userData.token) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]);

  const logout = () => {
    setUserData({
      token: null,
      role: null,
      credits: 0,
    });
    localStorage.removeItem('userData'); // Optional: Clear storage on logout
  };

  return (
    <AuthContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
