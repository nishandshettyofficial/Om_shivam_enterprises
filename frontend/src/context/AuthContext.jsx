import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'ose_auth_user';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pendingAction, setPendingAction] = useState(null);
  
  // Navigation View: 'catalog' | 'user-dashboard' | 'shopkeeper-dashboard' | 'signin'
  const [currentView, setCurrentView] = useState('catalog');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // Login handler
  const login = (userData) => {
    setCurrentUser(userData);

    // Auto-redirect based on role
    if (userData.role === 'shopkeeper') {
      setCurrentView('shopkeeper-dashboard');
    } else {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
        setCurrentView('catalog');
      } else {
        setCurrentView('user-dashboard');
      }
    }
  };

  // Register handler
  const register = (userData) => {
    setCurrentUser(userData);

    if (userData.role === 'shopkeeper') {
      setCurrentView('shopkeeper-dashboard');
    } else {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
        setCurrentView('catalog');
      } else {
        setCurrentView('user-dashboard');
      }
    }
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    setCurrentView('catalog');
  };

  // Gatekeeper: if logged in, do action; if guest, navigate to professional sign in page
  const requireAuth = (callback) => {
    if (currentUser) {
      callback();
    } else {
      setPendingAction(() => callback);
      setCurrentView('signin');
    }
  };

  // Skip auth for now
  const skipForNow = () => {
    setCurrentView('catalog');
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Update profile (e.g. edit name, phone number, handle)
  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // 1-Tap Google Sign-In handler
  const loginWithGoogle = (googleUserData = {}) => {
    const email = googleUserData.email || 'customer@gmail.com';
    const customerName = googleUserData.name || 'Rahul Sharma';
    const cleanHandle = googleUserData.handle || `@${email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')}`;
    
    const user = {
      id: googleUserData.id || `goog_${Date.now()}`,
      name: customerName,
      email: email,
      photo: googleUserData.picture || googleUserData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      handle: cleanHandle,
      phone: googleUserData.phone || '',
      role: (email === 'admin@omshivam.com' || googleUserData.role === 'shopkeeper') ? 'shopkeeper' : 'customer',
      authProvider: 'google',
      createdAt: new Date().toISOString()
    };

    login(user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isShopkeeper: currentUser?.role === 'shopkeeper',
        currentView,
        setCurrentView,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
        requireAuth,
        skipForNow,
        // Legacy compatibility shims so older components do not break
        isAuthModalOpen: false,
        setIsAuthModalOpen: (val) => { if (val) setCurrentView('signin'); },
        authModalMode: 'login',
        setAuthModalMode: () => {}
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
