'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MockUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: 'USER' | 'ADMIN';
}

interface UserContextType {
  currentUser: MockUser | null;
  setCurrentUser: (user: MockUser | null) => void;
  users: MockUser[];
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Test users for development
const TEST_USERS: MockUser[] = [
  {
    id: 'admin',
    email: 'admin@sharingiscaring.app',
    name: 'Admin User',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'ADMIN',
  },
  {
    id: 'emma',
    email: 'emma.wilson@test.com',
    name: 'Emma Wilson',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    role: 'USER',
  },
  {
    id: 'james',
    email: 'james.chen@test.com',
    name: 'James Chen',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    role: 'USER',
  },
  {
    id: 'nina',
    email: 'nina.petrov@test.com',
    name: 'Nina Petrov',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina',
    role: 'USER',
  },
  {
    id: 'max',
    email: 'max.mueller@test.com',
    name: 'Max Müller',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=max',
    role: 'USER',
  },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved user from localStorage
    const savedUserId = localStorage.getItem('mockUserId');
    if (savedUserId) {
      const user = TEST_USERS.find((u) => u.id === savedUserId);
      if (user) setCurrentUser(user);
    } else {
      // Default to Emma for testing
      const defaultUser = TEST_USERS[1];
      if (defaultUser) setCurrentUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = (user: MockUser | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('mockUserId', user.id);
    } else {
      localStorage.removeItem('mockUserId');
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetUser,
        users: TEST_USERS,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
