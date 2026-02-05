'use client';

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { CustomerProfile } from '@/types/customer';
import type { CommunityProfile } from '@/types/community';

interface PersonaContextType {
  persona: string | null;
  setPersona: (persona: string) => void;
  customers: CustomerProfile[] | null;
  setCustomers: (customers: CustomerProfile[]) => void;
  communities: CommunityProfile[] | null;
  setCommunities: (communities: CommunityProfile[]) => void;
  clearAll: () => void;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const [persona, setPersona] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerProfile[] | null>(null);
  const [communities, setCommunities] = useState<CommunityProfile[] | null>(
    null,
  );

  const clearAll = (): void => {
    setPersona(null);
    setCustomers(null);
    setCommunities(null);
  };

  return (
    <PersonaContext.Provider
      value={{
        persona,
        setPersona,
        customers,
        setCustomers,
        communities,
        setCommunities,
        clearAll,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona(): PersonaContextType {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
