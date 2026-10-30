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
