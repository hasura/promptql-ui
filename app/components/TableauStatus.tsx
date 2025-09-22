"use client";

import { useTableau } from "./TableauProvider";
import { createTableauSummary } from "../utils/tableauArtifacts";

export function TableauStatus() {
  const tableauContext = useTableau();

  if (tableauContext.error) {
    return (
      <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Tableau Connection Error</h3>
        <p className="text-red-600 text-sm mt-1">{tableauContext.error}</p>
        <button
          onClick={tableauContext.refreshData}
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded border border-red-300"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!tableauContext.isInitialized) {
    return (
      <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-blue-800 font-medium">Connecting to Tableau...</h3>
        <p className="text-blue-600 text-sm mt-1">
          Loading dashboard context and data.
        </p>
      </div>
    );
  }

  const summary = createTableauSummary(tableauContext);

  return (
    <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-md">
      <h3 className="text-green-800 font-medium flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Tableau Connected
      </h3>
      <div className="mt-2 text-green-700 text-sm">
        <pre className="whitespace-pre-wrap font-mono text-xs">{summary}</pre>
      </div>
      <button
        onClick={tableauContext.refreshData}
        className="mt-2 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-sm rounded border border-green-300"
      >
        Refresh Data
      </button>
    </div>
  );
}