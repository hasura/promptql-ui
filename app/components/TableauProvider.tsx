"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useTableauContext, TableauContext as TableauContextType } from '../hooks/useTableauContext';

const TableauContext = createContext<TableauContextType | null>(null);

interface TableauProviderProps {
  children: ReactNode;
}

export function TableauProvider({ children }: TableauProviderProps) {
  const tableauContext = useTableauContext();

  return (
    <TableauContext.Provider value={tableauContext}>
      {children}
    </TableauContext.Provider>
  );
}

export function useTableau(): TableauContextType {
  const context = useContext(TableauContext);
  if (!context) {
    throw new Error('useTableau must be used within a TableauProvider');
  }
  return context;
}