import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/react';

const AuthContext = createContext();

const STORAGE_KEY = 'ose_auth_user';

export function AuthProvider({ children }) {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

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

  // Sync Clerk authentication state into currentUser
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const phone = clerkUser.primaryPhoneNumber?.phoneNumber || '';
      const name = clerkUser.fullName || clerkUser.firstName || 'Customer';
      const handle = clerkUser.username 
        ? `@${clerkUser.username}` 
        : (email ? `@${email.split('@')[0]}` : `@user_${clerkUser.id.slice(-4)}`);
      
      const role = clerkUser.publicMetadata?.role || 
        ((email === 'admin@omshivam.com' || phone.includes('8147228162') || handle === '@om_shivam_admin') ? 'shopkeeper' : 'customer');

      const syncedUser = {
        id: clerkUser.id,
        name,
        email,
        phone,
        handle,
        role,
        photo: clerkUser.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        authProvider: 'clerk',
        createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString()
      };

      setCurrentUser(syncedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedUser));
    } else if (!isSignedIn && currentUser?.authProvider === 'clerk') {
      setCurrentUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isSignedIn, clerkUser, isLoaded]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  // Login handler (direct / local)
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
  const logout = async () => {
    try {
      if (isSignedIn) {
        await signOut();
      }
    } catch (err) {
      console.error('[Clerk] signOut error:', err);
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setCurrentView('catalog');
  };

  // Gatekeeper: if logged in, do action; if guest, navigate to sign in page
  const requireAuth = (callback) => {
    if (currentUser || isSignedIn) {
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

  // Update profile
  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Google Sign-In handler (fallback)
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
        isLoggedIn: !!currentUser || !!isSignedIn,
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
