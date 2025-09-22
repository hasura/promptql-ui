# Tableau Extension Integration

This PromptQL web application has been configured as a Tableau Dashboard Extension to provide contextually aware AI assistance based on your dashboard data, filters, and user context.

## Setup Instructions

### 1. Extension Manifest

The extension manifest file is located at `/public/promptql-extension.trex`. This file defines the extension configuration for Tableau.

**Important**: Update the `<url>` in the manifest file to match your deployment URL:
- For development: `http://localhost:3000`
- For production: Your actual domain (e.g., `https://yourdomain.com`)

### 2. Add Extension to Tableau Dashboard

1. Open your Tableau Dashboard
2. In the dashboard, go to **Objects** > **Extension**
3. Drag the Extension object to your dashboard
4. When prompted, click **"My Extensions"**
5. Click **"Browse for Extension"** and select the `promptql-extension.trex` file
6. Grant the required permissions (Full Data access)

### 3. Configure Extension Permissions

The extension requires **Full Data** permission to access:
- Dashboard filters and their applied values
- Worksheet data and summaries
- User context information

Make sure to allow these permissions when Tableau prompts you.

### 4. Using the Extension

Once the extension is added to your dashboard:

1. **Connection Status**: The extension will show a connection status indicator at the top
2. **Automatic Context**: The AI will automatically have access to:
   - All active filters in the dashboard
   - Data from all worksheets
   - User information
   - Dashboard structure
3. **Contextual Queries**: You can ask questions like:
   - "What insights can you provide about the current filtered data?"
   - "Explain the trends I'm seeing in this dashboard"
   - "What recommendations do you have based on the current filters?"

### 5. Data Flow

The extension automatically sends the following context to PromptQL API as artifacts:

1. **Worksheet Data Artifacts**: Table data from each worksheet
   ```json
   {
     "identifier": "tableau_worksheet_[name]",
     "title": "Tableau Worksheet: [Name]",
     "artifact_type": "table",
     "data": [/* worksheet data */]
   }
   ```

2. **Filter Artifacts**: Currently applied filters
   ```json
   {
     "identifier": "tableau_active_filters",
     "title": "Tableau Active Filters",
     "artifact_type": "table",
     "data": [/* filter information */]
   }
   ```

3. **Dashboard Context**: General dashboard information
   ```json
   {
     "identifier": "tableau_dashboard_context",
     "title": "Tableau Dashboard Context",
     "artifact_type": "table",
     "data": [/* dashboard metadata */]
   }
   ```

## Development

### Environment Variables

Make sure you have the following environment variables set:
- `PROMPTQL_API_URL`: Your PromptQL API endpoint
- `PROMPTQL_API_KEY`: Your PromptQL API key
- `DDN_URL`: Your DDN URL
- `DDN_TOKEN`: Your DDN token

### Testing Locally

1. Start the development server: `npm run dev`
2. In Tableau, use `http://localhost:3000` as the extension URL
3. The extension will automatically detect the Tableau environment and initialize

### Troubleshooting

1. **Extension not loading**: Check that the URL in the manifest matches your deployment URL
2. **No data appearing**: Ensure Full Data permissions are granted
3. **Connection errors**: Check the browser console for error messages
4. **Filters not updating**: The extension listens for filter changes automatically, but you can manually refresh using the "Refresh Data" button

## Architecture

The extension consists of:

- **TableauProvider**: React context provider for Tableau integration
- **useTableauContext**: Hook for accessing Tableau data
- **LocalRuntimeProvider**: Modified to include Tableau artifacts in API calls
- **TableauStatus**: UI component showing connection status
- **tableauArtifacts.ts**: Utilities for converting Tableau data to PromptQL artifacts

The extension automatically refreshes data when filters change and provides real-time context to the AI assistant.