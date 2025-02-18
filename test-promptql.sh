#!/bin/bash

# Load environment variables
source .env

curl -X POST \
  https://api.promptql.pro.hasura.io/query \
  -H "Content-Type: application/json" \
  -d '{
    "version": "v1",
    "promptql_api_key": "'"$PROMPTQL_API_KEY"'",
    "llm": {
      "provider": "hasura"
    },
    "ddn": {
      "url": "'"$DDN_URL"'",
      "headers": {}
    },
    "artifacts": [],
    "system_instructions": null,
    "timezone": "America/Los_Angeles",
    "interactions": [
      {
        "user_message": {
          "text": "Hello, how can you help me today?"
        },
        "assistant_actions": []
      }
    ],
    "stream": false
  }' 