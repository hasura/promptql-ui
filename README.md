# PromptQL Chat UI

A React client demonstrating PromptQL Natural Language API integration with Assistant UI.

## Overview

This project integrates:

- [PromptQL Natural Language API](https://hasura.io/docs/promptql/promptql-apis/natural-language-api/) - Database interaction via natural language
- [Assistant UI](https://www.assistant-ui.com/) - Open source React chat interface

## Integration Details

### Response Processing

The client processes PromptQL responses through two key functions:

1. `accumulatePromptQLContent()` - Aggregates streaming chunks into structured content:

```typescript
interface PromptQLContent {
  text: string;
  plan: string;
  code: string;
  codeOutput: string;
  codeError: string;
  artifacts: Artifact[];
}
```

2. `convertToAssistantContent()` - Transforms PromptQL content into Assistant UI widgets:

- Text messages
- Code blocks with syntax highlighting
- Plan displays
- Data artifacts (tables, JSON)

### UI Components

1. `ArtifactToolUI` - Renders data artifacts:

- Tables with sorting and filtering
- JSON data with syntax highlighting
- Fullscreen mode support

2. `SimpleCodeToolUI` - Displays code execution:

- Syntax highlighting
- Execution state (implementing/executing/executed)
- Output and error displays

3. `SimplePlanToolUI` - Shows execution plans:

- Markdown formatting
- Progress indicators
- Collapsible sections

### Response Format

PromptQL responses are streamed as chunks:

```typescript
interface PromptQLChunk {
  type:
    | "client_init"
    | "user_message"
    | "assistant_message_response"
    | "assistant_code_response"
    | "artifact_update"
    | "code_output";
  message?: string;
  code?: string;
  plan?: string;
  artifact?: Artifact;
  code_output?: string;
  code_error?: string;
}
```

## Setup

1. Clone and install:

```bash
git clone https://github.com/hasura/promptql-ui.git
cd promptql-ui
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```env
PROMPTQL_API_KEY=your_api_key_here
DDN_URL=your_ddn_url_here
DDN_TOKEN=your_ddn_token_here
```

### Environment Variables

#### PROMPTQL_API_KEY

Go to PromptQL Settings and Generate a new API Key

#### DDN_URL

Get it from your project and build, and append `/v1/sql`. Should have a format similar to:

```
https://trusted-pangolin-1323-6093310712.ddn.hasura.app/v1/sql
```

#### DDN_TOKEN

Go to GraphiQL Playground, and copy it from the auth section. It expires periodically, so be sure to update it if you see auth errors.

3. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [PromptQL Natural Language API](https://hasura.io/docs/promptql/promptql-apis/natural-language-api/)
- [Assistant UI](https://www.assistant-ui.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

```

```
