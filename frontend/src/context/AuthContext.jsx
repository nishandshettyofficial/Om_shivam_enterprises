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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('register'); // 'register' | 'login' | 'reset'
  const [pendingAction, setPendingAction] = useState(null);
  
  // Navigation View: 'catalog' | 'user-dashboard' | 'shopkeeper-dashboard'
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
    setIsAuthModalOpen(false);

    // Auto-redirect based on role
    if (userData.role === 'shopkeeper') {
      setCurrentView('shopkeeper-dashboard');
    } else {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    }
  };

  // Register handler
  const register = (userData) => {
    setCurrentUser(userData);
    setIsAuthModalOpen(false);

    if (userData.role === 'shopkeeper') {
      setCurrentView('shopkeeper-dashboard');
    } else {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    }
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    setCurrentView('catalog');
  };

  // Gatekeeper: if logged in, do action; if guest, open auth modal and queue action
  const requireAuth = (callback) => {
    if (currentUser) {
      callback();
    } else {
      setPendingAction(() => callback);
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
    }
  };

  // Skip auth for now
  const skipForNow = () => {
    setIsAuthModalOpen(false);
    if (pendingAction) {
      // Execute the pending action even in guest mode!
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

  // 1-Tap Google Sign-In handler (100% Free Lifetime)
  const loginWithGoogle = (googleUserData = {}) => {
    const email = googleUserData.email || 'patron@gmail.com';
    const cleanHandle = googleUserData.handle || `@${email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')}`;
    
    const user = {
      id: googleUserData.id || `goog_${Date.now()}`,
      name: googleUserData.name || 'Valued Patron',
      email: email,
      photo: googleUserData.picture || '',
      handle: cleanHandle,
      phone: googleUserData.phone || '',
      role: (email === 'omshivam.stationery@gmail.com' || googleUserData.role === 'shopkeeper') ? 'shopkeeper' : 'customer',
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        currentView,
        setCurrentView,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
        requireAuth,
        skipForNow
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
