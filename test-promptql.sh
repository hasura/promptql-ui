#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found"
    exit 1
fi

# Check required environment variables
if [ -z "$PROMPTQL_API_KEY" ] || [ -z "$DDN_URL" ] || [ -z "$DDN_TOKEN" ]; then
    echo "Error: Required environment variables are missing"
    echo "Please ensure PROMPTQL_API_KEY, DDN_URL, and DDN_TOKEN are set in .env"
    exit 1
fi

# Show usage if --help is passed
if [ "$1" == "--help" ]; then
  echo "Usage: ./test-promptql.sh <message> [--stream]"
  echo "  <message>   The message to send to the API"
  echo "  --stream    Optional: Stream the response (default: false)"
  exit 0
fi

# Get message from command line argument or use default
MESSAGE="${1:-Hello, how are you?}"
# Check if --stream flag is present
STREAM="false"
if [ "$2" == "--stream" ]; then
  STREAM="true"
fi

# Sample message payload
DATA='{
  "version": "v1",
  "promptql_api_key": "'"$PROMPTQL_API_KEY"'",
  "llm": {
    "provider": "hasura"
  },
  "ddn": {
    "url": "'"$DDN_URL"'",
    "headers": {
      "x-hasura-ddn-token": "'"$DDN_TOKEN"'"
    }
  },
  "artifacts": [],
  "system_instructions": "",
  "timezone": "'"$(date +%Z)"'",
  "interactions": [
    {
      "user_message": {
        "text": "'"$MESSAGE"'"
      },
      "assistant_actions": []
    }
  ],
  "stream": '"$STREAM"'
}'

# Send the curl request with appropriate handling for streaming
if [ "$STREAM" = "true" ]; then
  # For streaming, process the response line by line
  curl -N "https://api.promptql.pro.hasura.io/query" \
    -H "Content-Type: application/json" \
    -H "x-hasura-ddn-token: $DDN_TOKEN" \
    -d "$DATA" | while read -r line; do
      echo "$line"
    done
else
  # Non-streaming request (original behavior)
  curl -v "https://api.promptql.pro.hasura.io/query" \
    -H "Content-Type: application/json" \
    -H "x-hasura-ddn-token: $DDN_TOKEN" \
    -d "$DATA"
fi 