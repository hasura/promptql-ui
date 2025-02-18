## PromptQL API Stream Response

```
Received messages: [
  {
    role: 'user',
    content: 'Show me information about my Snowflake Chinook schema'
  }
]
Transformed interactions: [
  {
    user_message: { text: 'Show me information about my Snowflake Chinook schema' },
    assistant_actions: []
  }
]
Stream started
Received chunk: data: {"message":"I'll help you explore the Chi","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"nook database schema, which ap","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"pears to be a music store database. Let me create a su","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"mmary of the main ta","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"bles and their rel","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"ationships.","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"1.","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":" Query the tables to get a hig","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"h-level overview of the data ","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"volume in each table\n2. Create ","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"a summary showing:\n   - ","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"Table name\n   - Number of rows\n   - Key","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":" columns\n3. Store this information in an artifact for easy reference","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"# Ge","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"t row counts fo","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"r each main table\ntables","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" = [\n    'AL","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"BUM', 'ARTIST', 'CUSTOM","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ER', 'EMPLOYEE', 'GENR","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"E', \n    'INVOICE","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"', 'INVOICELINE', 'ME","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"DIATYPE', 'PLAYLIST', 'TRACK'","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"\n]\n\ntable_stats = []\nfor","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" table in tables:\n    sql ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"= f\"\"\"\n    SELECT COUNT","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"(1) as count \n    FROM app.CHI","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"NOOK_PUBLIC_{","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"table}\n    \"\"\"\n    resul","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"t = executor.run_sql(sql","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":")\n    count = result[0]['count","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"'] if result else 0\n    \n    tabl","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"e_stats.append({\n  ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"      'Table': table,\n   ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"     'Row Count': count,\n      ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"  'Description': {\n            'ALBUM","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"': 'Contains album information inc","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"luding title and artist',\n            '","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ARTIST': 'List of artists',\n          ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"  'CUSTOMER': 'Customer details includin","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"g contact information',\n            'EMPLOYEE': 'Employee informat","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ion including reporti","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ng hierarchy',\n            'GENR","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"E': 'Music genres',\n            'INV","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"OICE': 'Sales invoi","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ces',\n            'INVOICELINE': 'Indi","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"vidual line items ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"of each invoice'","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":",\n            'MEDIATYPE': 'Types of m","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"edia (e.g., MPEG audio","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":", AAC audio)',\n            'PLAYLIST':","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" 'Playlists in the system',\n ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"           'TRACK': 'Individual so","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ngs/tracks with details","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"'\n        }.get(table,","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" '')\n    })\n\nexec","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"utor.store_artifact(\n    'schema_overvi","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ew',\n    'Chinook Databa","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"se Schema Overview',\n    'table',\n    table_stats\n)","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"SQL statement returned 1 rows.\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"type":"artifact_update_chunk","artifact":{"identifier":"schema_overview","title":"Chinook Database Schema Overview","artifact_type":"table","data":[{"Table":"ALBUM","Row Count":347,"Description":"Contains album information including title and artist"},{"Table":"ARTIST","Row Count":275,"Description":"List of artists"},{"Table":"CUSTOMER","Row Count":109,"Description":"Customer details including contact information"},{"Table":"EMPLOYEE","Row Count":8,"Description":"Employee information including reporting hierarchy"},{"Table":"GENRE","Row Count":26,"Description":"Music genres"},{"Table":"INVOICE","Row Count":614,"Description":"Sales invoices"},{"Table":"INVOICELINE","Row Count":2240,"Description":"Individual line items of each invoice"},{"Table":"MEDIATYPE","Row Count":5,"Description":"Types of media (e.g., MPEG audio, AAC audio)"},{"Table":"PLAYLIST","Row Count":18,"Description":"Playlists in the system"},{"Table":"TRACK","Row Count":3503,"Description":"Individual songs/tracks with details"}]}}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"Stored table artifact: identifier = 'schema_overview', title = 'Chinook Database Schema Overview', number of rows = 10, sample rows = [{'Table': 'ALBUM', 'Row Count': 347, 'Description': 'Contains album information including title and artist'}, {'Table': 'ARTIST', 'Row Count': 275, 'Description': 'List of artists'}]\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"Here'","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"s an overview of your Chinook databas","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"e:\n<artifact identifier","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"='schema_overview' warni","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ng='I cannot see the","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":" full data so I m","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ust not make up observations' />\n\nThis is a","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":" music store database ","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"with interconnected ","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"tables:\n- The core music ","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"data is stored in ALBUM, ARTIST, TRACK, an","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"d GENRE tables\n- Customer tr","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ansactions are tracked in INVOICE and INVOICE","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"LINE tables\n- CUSTOM","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ER and EMPLOYEE tables handle the bus","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"iness side\n- PLAYLIST and MEDIATYPE tab","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"les manage the digital aspects of the mus","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ic\n\nWould you like to explore a","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ny specific aspect of this schema in more detail?","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}
```
