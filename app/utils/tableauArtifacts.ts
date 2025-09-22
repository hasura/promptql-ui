import { TableauContext } from '../hooks/useTableauContext';

export interface Artifact {
  identifier: string;
  title: string;
  artifact_type: string;
  data: Array<Record<string, unknown>>;
}

export function createTableauArtifacts(tableauContext: TableauContext): Artifact[] {
  console.log('🔧 Creating Tableau artifacts from context:', {
    initialized: tableauContext.isInitialized,
    worksheetCount: tableauContext.worksheetData.length,
    filterCount: tableauContext.filters.length,
    user: tableauContext.user?.displayName
  });

  const artifacts: Artifact[] = [];

  // Create artifacts for worksheet data
  tableauContext.worksheetData.forEach((worksheet) => {
    if (worksheet.data.length > 0) {
      // Main worksheet data artifact
      artifacts.push({
        identifier: `tableau_worksheet_${worksheet.worksheetName.toLowerCase().replace(/\s+/g, '_')}`,
        title: `Tableau Worksheet: ${worksheet.worksheetName} (${worksheet.data.length} rows)`,
        artifact_type: 'table',
        data: worksheet.data
      });

      // Create a detailed data summary for this worksheet
      const dataSummary = [{
        worksheet_name: worksheet.worksheetName,
        total_rows: worksheet.data.length,
        total_columns: worksheet.columns.length,
        column_names: worksheet.columns.map(col => col.fieldName).join(', '),
        column_types: worksheet.columns.map(col => `${col.fieldName}:${col.dataType}`).join(', '),
        sample_data: worksheet.data.length > 0 ? JSON.stringify(worksheet.data[0]) : 'No data available'
      }];

      artifacts.push({
        identifier: `tableau_worksheet_summary_${worksheet.worksheetName.toLowerCase().replace(/\s+/g, '_')}`,
        title: `Data Summary: ${worksheet.worksheetName}`,
        artifact_type: 'table',
        data: dataSummary
      });
    } else {
      // Even if no data, show the worksheet exists but is empty
      const emptyWorksheet = [{
        worksheet_name: worksheet.worksheetName,
        status: 'No data available',
        columns: worksheet.columns.map(col => col.fieldName).join(', ') || 'No columns defined',
        note: 'This worksheet exists but contains no data rows'
      }];

      artifacts.push({
        identifier: `tableau_worksheet_empty_${worksheet.worksheetName.toLowerCase().replace(/\s+/g, '_')}`,
        title: `Empty Worksheet: ${worksheet.worksheetName}`,
        artifact_type: 'table',
        data: emptyWorksheet
      });
    }
  });

  // Create artifact for column metadata across all worksheets
  if (tableauContext.worksheetData.length > 0) {
    const columnMetadata: Array<Record<string, unknown>> = [];
    
    tableauContext.worksheetData.forEach((worksheet) => {
      worksheet.columns.forEach((column) => {
        columnMetadata.push({
          worksheet_name: worksheet.worksheetName,
          column_name: column.fieldName,
          data_type: column.dataType,
          row_count: worksheet.data.length,
          has_data: worksheet.data.length > 0
        });
      });
    });

    artifacts.push({
      identifier: 'tableau_column_metadata',
      title: 'Tableau Column Metadata',
      artifact_type: 'table',
      data: columnMetadata
    });
  }

  // Create artifact for filters (if any are applied)
  if (tableauContext.filters.length > 0) {
    const filterData = tableauContext.filters.map(filter => ({
      worksheet: filter.worksheetName,
      field: filter.fieldName,
      type: filter.filterType,
      applied_values: filter.appliedValues.join(', '),
      value_count: filter.appliedValues.length
    }));

    artifacts.push({
      identifier: 'tableau_active_filters',
      title: 'Tableau Active Filters',
      artifact_type: 'table',
      data: filterData
    });
  }

  // Create artifact for dashboard context with enhanced debugging
  const totalRows = tableauContext.worksheetData.reduce((sum, ws) => sum + ws.data.length, 0);
  const worksheetDetails = tableauContext.worksheetData.map(ws => 
    `${ws.worksheetName} (${ws.data.length} rows, ${ws.columns.length} cols)`
  ).join('; ');

  const contextData = [{
    dashboard_info: 'Current Tableau Dashboard Context',
    total_worksheets: tableauContext.worksheetData.length,
    total_rows_across_worksheets: totalRows,
    worksheet_details: worksheetDetails || 'No worksheets available',
    total_filters: tableauContext.filters.length,
    user: tableauContext.user?.displayName || 'Unknown User',
    data_loaded: tableauContext.isInitialized,
    has_errors: tableauContext.error ? 'Yes' : 'No',
    error_message: tableauContext.error || 'None',
    timestamp: new Date().toISOString()
  }];

  artifacts.push({
    identifier: 'tableau_dashboard_context',
    title: 'Tableau Dashboard Context',
    artifact_type: 'table',
    data: contextData
  });

  console.log('✨ Generated', artifacts.length, 'Tableau artifacts:', artifacts.map(a => ({
    identifier: a.identifier,
    title: a.title,
    dataRows: a.data.length
  })));

  return artifacts;
}

export function createTableauSummary(tableauContext: TableauContext): string {
  if (!tableauContext.isInitialized) {
    return 'Tableau dashboard context is not available or still loading.';
  }

  const summary: string[] = [];
  
  summary.push(`Dashboard Context: ${tableauContext.worksheetData.length} worksheets available`);
  
  if (tableauContext.filters.length > 0) {
    summary.push(`Active Filters: ${tableauContext.filters.length} filters applied`);
    tableauContext.filters.forEach(filter => {
      summary.push(`  - ${filter.worksheetName}: ${filter.fieldName} = ${filter.appliedValues.join(', ')}`);
    });
  }

  tableauContext.worksheetData.forEach(worksheet => {
    summary.push(`Worksheet "${worksheet.worksheetName}": ${worksheet.summary.numberOfRows} rows, ${worksheet.columns.length} columns`);
  });

  if (tableauContext.user) {
    summary.push(`User: ${tableauContext.user.displayName}`);
  }

  return summary.join('\n');
}