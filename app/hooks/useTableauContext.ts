import { useEffect, useState, useCallback } from 'react';

interface TableauFilterValue {
  value: string;
}

interface TableauFilterObject {
  fieldName: string;
  filterType: string;
  appliedValues?: TableauFilterValue[];
}

interface TableauWorksheet {
  name: string;
  getFiltersAsync(): Promise<TableauFilterObject[]>;
  getSummaryDataAsync(): Promise<{
    name: string;
    data: Array<Array<{ value: unknown; formattedValue: string }>>;
    columns: Array<{ fieldName: string; dataType: string }>;
  }>;
  addEventListener(eventType: string, handler: () => void): void;
  removeEventListener(eventType: string, handler: () => void): void;
}

interface TableauDashboard {
  worksheets: TableauWorksheet[];
  addEventListener?(eventType: string, handler: () => void): void;
  removeEventListener?(eventType: string, handler: () => void): void;
}

interface TableauExtensions {
  initializeAsync(): Promise<void>;
  dashboardContent: {
    dashboard: TableauDashboard;
  };
  settings: {
    get(key: string): string | undefined;
  };
  environment: {
    tableauVersion: string;
  };
}

interface TableauAPI {
  extensions: TableauExtensions;
  TableauEventType: {
    FilterChanged: string;
    MarkSelectionChanged: string;
    ParameterChanged: string;
  };
}

declare global {
  interface Window {
    tableau?: TableauAPI;
  }
}

export interface TableauFilter {
  worksheetName: string;
  fieldName: string;
  appliedValues: string[];
  filterType: string;
}

export interface TableauUser {
  username: string;
  displayName: string;
}

export interface TableauWorksheetData {
  worksheetName: string;
  summary: {
    name: string;
    numberOfRows: number;
  };
  columns: Array<{
    fieldName: string;
    dataType: string;
  }>;
  data: Array<Record<string, unknown>>;
}

export interface TableauContext {
  isInitialized: boolean;
  filters: TableauFilter[];
  user: TableauUser | null;
  worksheetData: TableauWorksheetData[];
  refreshData: () => Promise<void>;
  error: string | null;
}

export function useTableauContext(): TableauContext {
  const [isInitialized, setIsInitialized] = useState(false);
  const [filters, setFilters] = useState<TableauFilter[]>([]);
  const [user, setUser] = useState<TableauUser | null>(null);
  const [worksheetData, setWorksheetData] = useState<TableauWorksheetData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [parameterEventSupported, setParameterEventSupported] = useState(false);

  const extractFilters = useCallback(async (): Promise<TableauFilter[]> => {
    try {
      if (!window.tableau?.extensions) {
        return [];
      }
      const dashboard = window.tableau.extensions.dashboardContent.dashboard;
      const worksheets = dashboard.worksheets;
      const allFilters: TableauFilter[] = [];

      for (const worksheet of worksheets) {
        try {
          const filters = await worksheet.getFiltersAsync();
          for (const filter of filters) {
            allFilters.push({
              worksheetName: worksheet.name,
              fieldName: filter.fieldName,
              appliedValues: filter.appliedValues?.map((v: TableauFilterValue) => v.value) || [],
              filterType: filter.filterType
            });
          }
        } catch (err) {
          console.warn(`Failed to get filters for worksheet ${worksheet.name}:`, err);
        }
      }

      return allFilters;
    } catch (err) {
      console.error('Error extracting filters:', err);
      return [];
    }
  }, []);

  const extractUser = useCallback((): TableauUser | null => {
    try {
      if (!window.tableau?.extensions) {
        return null;
      }
      const settings = window.tableau.extensions.settings;
      const environment = window.tableau.extensions.environment;
      
      return {
        username: environment.tableauVersion || 'unknown',
        displayName: settings.get('user_display_name') || 'Tableau User'
      };
    } catch (err) {
      console.error('Error extracting user info:', err);
      return null;
    }
  }, []);

  const extractWorksheetData = useCallback(async (): Promise<TableauWorksheetData[]> => {
    try {
      if (!window.tableau?.extensions) {
        return [];
      }
      const dashboard = window.tableau.extensions.dashboardContent.dashboard;
      const worksheets = dashboard.worksheets;
      const allData: TableauWorksheetData[] = [];

      for (const worksheet of worksheets) {
        try {
          const summary = await worksheet.getSummaryDataAsync();
          
          const worksheetData: TableauWorksheetData = {
            worksheetName: worksheet.name,
            summary: {
              name: summary.name,
              numberOfRows: summary.data.length
            },
            columns: summary.columns.map((col: { fieldName: string; dataType: string }) => ({
              fieldName: col.fieldName,
              dataType: col.dataType
            })),
            data: summary.data.map((row: Array<{ value: unknown; formattedValue: string }>) => {
              const rowData: Record<string, unknown> = {};
              row.forEach((cell: { value: unknown; formattedValue: string }, index: number) => {
                const columnName = summary.columns[index].fieldName;
                rowData[columnName] = cell.formattedValue || cell.value;
              });
              return rowData;
            })
          };

          allData.push(worksheetData);
        } catch (err) {
          console.warn(`Failed to get data for worksheet ${worksheet.name}:`, err);
        }
      }

      return allData;
    } catch (err) {
      console.error('Error extracting worksheet data:', err);
      return [];
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      console.log('🔄 Refreshing Tableau data...');
      setError(null);
      const [filtersData, userData, worksheetDataResult] = await Promise.all([
        extractFilters(),
        Promise.resolve(extractUser()),
        extractWorksheetData()
      ]);

      console.log('📊 Tableau Data Update:', {
        timestamp: new Date().toISOString(),
        filters: filtersData,
        user: userData,
        worksheets: worksheetDataResult.map(ws => ({
          name: ws.worksheetName,
          rows: ws.summary.numberOfRows,
          columns: ws.columns.length
        }))
      });

      setFilters(filtersData);
      setUser(userData);
      setWorksheetData(worksheetDataResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error refreshing Tableau data:', err);
    }
  }, [extractFilters, extractUser, extractWorksheetData]);

  useEffect(() => {
    const initializeTableau = async () => {
      try {
        if (typeof window !== 'undefined' && window.tableau?.extensions) {
          await window.tableau.extensions.initializeAsync();
          setIsInitialized(true);
          await refreshData();

          // Listen for various dashboard changes
          const dashboard = window.tableau.extensions.dashboardContent.dashboard;
          console.log('🎧 Setting up real-time listeners for', dashboard.worksheets.length, 'worksheets');
          
          // Try to add dashboard-level parameter change listener
          // Note: Parameter events may not be supported in all Tableau versions
          const parameterChangeHandler = () => {
            console.log('⚙️ Parameter changed in dashboard at', new Date().toISOString());
            refreshData();
          };
          
          if (dashboard.addEventListener) {
            try {
              dashboard.addEventListener(window.tableau!.TableauEventType.ParameterChanged, parameterChangeHandler);
              setParameterEventSupported(true);
              console.log('✅ Parameter change events registered successfully');
            } catch (err) {
              console.warn('⚠️ Parameter change events not supported in this Tableau version:', err);
              setParameterEventSupported(false);
            }
          }

          dashboard.worksheets.forEach((worksheet: TableauWorksheet) => {
            console.log('📡 Adding event listeners for worksheet:', worksheet.name);
            
            // Filter changes
            const filterChangeHandler = () => {
              console.log('🔥 Filter changed in worksheet:', worksheet.name, 'at', new Date().toISOString());
              refreshData();
            };
            worksheet.addEventListener(window.tableau!.TableauEventType.FilterChanged, filterChangeHandler);
            
            // Mark selection changes  
            const markSelectionHandler = () => {
              console.log('🎯 Mark selection changed in worksheet:', worksheet.name, 'at', new Date().toISOString());
              // Note: Mark selections don't affect our data artifacts, but we log for visibility
            };
            worksheet.addEventListener(window.tableau!.TableauEventType.MarkSelectionChanged, markSelectionHandler);
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Tableau';
        setError(errorMessage);
        console.error('Tableau initialization error:', err);
      }
    };

    // Check if running in Tableau environment
    if (typeof window !== 'undefined') {
      if (window.tableau) {
        initializeTableau();
      } else {
        // Load Tableau Extensions API from local source if not already loaded
        const script = document.createElement('script');
        script.src = '/tableau.extensions.1.latest.min.js';
        script.onload = () => {
          console.log('📚 Tableau Extensions API loaded from local source');
          initializeTableau();
        };
        script.onerror = () => {
          console.error('❌ Failed to load Tableau Extensions API from local source');
          setError('Failed to load Tableau Extensions API from local source');
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      // Cleanup event listeners if initialized
      if (isInitialized && window.tableau?.extensions) {
        try {
          const dashboard = window.tableau.extensions.dashboardContent.dashboard;
          
          // Remove dashboard-level parameter listener only if it was supported
          if (parameterEventSupported && dashboard.removeEventListener) {
            try {
              dashboard.removeEventListener(window.tableau!.TableauEventType.ParameterChanged, refreshData);
              console.log('🧹 Removed parameter event listener');
            } catch (err) {
              console.warn('Error removing parameter event listener:', err);
            }
          }
          
          // Remove worksheet-level listeners
          dashboard.worksheets.forEach((worksheet: TableauWorksheet) => {
            try {
              worksheet.removeEventListener(window.tableau!.TableauEventType.FilterChanged, refreshData);
              worksheet.removeEventListener(window.tableau!.TableauEventType.MarkSelectionChanged, refreshData);
            } catch (err) {
              console.warn(`Error removing listeners for worksheet ${worksheet.name}:`, err);
            }
          });
        } catch (err) {
          console.error('Error cleaning up Tableau listeners:', err);
        }
      }
    };
  }, [isInitialized, refreshData, parameterEventSupported]);

  return {
    isInitialized,
    filters,
    user,
    worksheetData,
    refreshData,
    error
  };
}