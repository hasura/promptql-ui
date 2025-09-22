"use client";

import { useEffect } from 'react';
import { Thread } from "@assistant-ui/react-ui";
import { SimplePlanToolUI } from "../components/SimplePlanToolUI";
import { SimpleCodeToolUI } from "../components/SimpleCodeToolUI";
import { ArtifactToolUI } from "../components/ArtifactToolUI";
import { TableauProvider } from "../components/TableauProvider";
import { LocalRuntimeProvider } from "../components/LocalRuntimeProvider";
import { TableauStatus } from "../components/TableauStatus";

// Mock Tableau API for testing
const mockTableauAPI = {
  extensions: {
    initializeAsync: () => Promise.resolve(),
    dashboardContent: {
      dashboard: {
        worksheets: [
          {
            name: 'Sales Overview',
            getFiltersAsync: () => Promise.resolve([
              {
                fieldName: 'Region',
                filterType: 'categorical',
                appliedValues: [
                  { value: 'North America' },
                  { value: 'Europe' }
                ]
              },
              {
                fieldName: 'Date',
                filterType: 'range',
                appliedValues: [
                  { value: '2024-01-01' },
                  { value: '2024-12-31' }
                ]
              }
            ]),
            getSummaryDataAsync: () => Promise.resolve({
              name: 'Sales Overview',
              data: [
                [
                  { value: 'North America', formattedValue: 'North America' },
                  { value: 150000, formattedValue: '$150,000' },
                  { value: 25, formattedValue: '25' }
                ],
                [
                  { value: 'Europe', formattedValue: 'Europe' },
                  { value: 120000, formattedValue: '$120,000' },
                  { value: 18, formattedValue: '18' }
                ],
                [
                  { value: 'Asia', formattedValue: 'Asia' },
                  { value: 95000, formattedValue: '$95,000' },
                  { value: 12, formattedValue: '12' }
                ]
              ],
              columns: [
                { fieldName: 'Region', dataType: 'string' },
                { fieldName: 'Sales', dataType: 'number' },
                { fieldName: 'Orders', dataType: 'number' }
              ]
            }),
            addEventListener: (eventType: string, handler: () => void) => {
              console.log(`📡 Mock: Added event listener for ${eventType} on Sales Overview`);
              // Simulate filter change after 5 seconds
              if (eventType.includes('FilterChanged')) {
                setTimeout(() => {
                  console.log('🔥 Mock: Simulating filter change...');
                  handler();
                }, 5000);
              }
            },
            removeEventListener: (eventType: string, handler: () => void) => {
              console.log(`🚫 Mock: Removed event listener for ${eventType} on Sales Overview`);
            }
          },
          {
            name: 'Customer Analysis',
            getFiltersAsync: () => Promise.resolve([
              {
                fieldName: 'Customer Segment',
                filterType: 'categorical',
                appliedValues: [
                  { value: 'Enterprise' },
                  { value: 'SMB' }
                ]
              }
            ]),
            getSummaryDataAsync: () => Promise.resolve({
              name: 'Customer Analysis',
              data: [
                [
                  { value: 'Enterprise', formattedValue: 'Enterprise' },
                  { value: 450, formattedValue: '450' },
                  { value: 85.5, formattedValue: '85.5%' }
                ],
                [
                  { value: 'SMB', formattedValue: 'SMB' },
                  { value: 1250, formattedValue: '1,250' },
                  { value: 72.3, formattedValue: '72.3%' }
                ]
              ],
              columns: [
                { fieldName: 'Segment', dataType: 'string' },
                { fieldName: 'Customer Count', dataType: 'number' },
                { fieldName: 'Satisfaction Rate', dataType: 'number' }
              ]
            }),
            addEventListener: (eventType: string, handler: () => void) => {
              console.log(`📡 Mock: Added event listener for ${eventType} on Customer Analysis`);
            },
            removeEventListener: (eventType: string, handler: () => void) => {
              console.log(`🚫 Mock: Removed event listener for ${eventType} on Customer Analysis`);
            }
          }
        ]
      }
    },
    settings: {
      get: (key: string) => {
        if (key === 'user_display_name') return 'Test User';
        return undefined;
      }
    },
    environment: {
      tableauVersion: '2024.1'
    }
  },
  TableauEventType: {
    FilterChanged: 'tableau.FilterChanged',
    MarkSelectionChanged: 'tableau.MarkSelectionChanged',
    ParameterChanged: 'tableau.ParameterChanged'
  }
};

export default function TestTableauPage() {
  useEffect(() => {
    // Inject mock Tableau API into window
    (window as any).tableau = mockTableauAPI;
    console.log('🧪 Mock Tableau API injected for testing');

    return () => {
      // Cleanup
      delete (window as any).tableau;
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-yellow-100 p-2 text-sm text-yellow-800 border-b border-yellow-200">
        🧪 <strong>TEST MODE:</strong> This page simulates Tableau context with mock data. 
        Check your browser console to see the real-time logging in action!
      </div>
      
      <div className="flex-1">
        <TableauProvider>
          <LocalRuntimeProvider>
            <main className="h-full flex flex-col">
              <div className="flex-shrink-0">
                <TableauStatus />
              </div>
              <div className="flex-1 min-h-0">
                <Thread
                  tools={[SimplePlanToolUI, SimpleCodeToolUI, ArtifactToolUI]}
                  assistantAvatar={{
                    src: "/promptql.svg",
                    alt: "PromptQL Logo",
                  }}
                />
              </div>
            </main>
          </LocalRuntimeProvider>
        </TableauProvider>
      </div>
    </div>
  );
}