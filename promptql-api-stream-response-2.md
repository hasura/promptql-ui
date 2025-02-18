# PromptQL API Stream Response

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


Received chunk: data: {"message":"nook database schema, which appears to be a music st","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"ore database. Let me create a summ","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"ary of the main tables and t","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"heir relationships.","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"1. Query the table","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"s to get a high-level overview of the data","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":" volume in each table\n2. Create ","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"a summary showing:\n   - ","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"Table name\n   - Number of rows\n   - Key columns\n3. Store th","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":"is information in an artifact for easy reference","code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"# Get row counts f","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"or each main table\nta","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"bles = [\n    'CHINOOK_","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"PUBLIC_ALBUM',\n    'CHINOOK_PU","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"BLIC_ARTIST',\n    'CHINOOK","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"_PUBLIC_CUSTOMER',\n  ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"  'CHINOOK_PUBLIC_EMPLOYEE'","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":",\n    'CHINOOK_PUBLIC_G","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ENRE',\n    'CHINOOK_PUBLIC","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"_INVOICE',\n    'CHINO","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"OK_PUBLIC_INVOICELINE',\n  ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"  'CHINOOK_PUBLIC_MEDIAT","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"YPE',\n    'CHINOOK_PUBLI","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"C_PLAYLIST',\n    'CHINOOK_PUBLI","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"C_TRACK'\n]\n\nschema_info =","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" []\nfor table in tabl","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"es:\n    sql = f\"SELECT COUNT(1)","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" as count FROM app.{tab","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"le}\"\n    result = executor.run_sql(sql","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":")\n    count = res","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ult[0]['count'] if result else 0\n    \n  ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"  # Get a sample row to see non-nu","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ll columns\n    sql_sample ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"= f\"SELECT * FROM app.{table} L","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"IMIT 1\"\n    sample = executor.run_s","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ql(sql_sample)\n    \n    # Create descript","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ion based on table name and key","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" columns\n    table_name = table.re","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"place('CHINOOK_PUBLIC_', '')\n    de","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"scription = \"\"\n    \n    if sample:\n ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"       sample_row = sample[0","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"]\n        key_columns = [k","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":" for k, v in sample_row.items() if v is not ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"None]\n        descr","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"iption = f\"Key columns: {', '.join(k","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ey_columns)}\"\n\n    schema_info.ap","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"pend({\n        'table_name': ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"table_name,\n        'row_count': count,\n  ","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"      'description': d","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"escription\n    })\n\nexec","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"utor.store_artifact(\n    'schema_overvi","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"ew',\n    'Chinook Databa","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":null,"plan":null,"code":"se Schema Overview',\n    'table',\n    schema_info\n)","code_output":null,"code_error":null,"type":"assistant_action_chunk","index":0}


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


Received chunk: data: {"type":"artifact_update_chunk","artifact":{"identifier":"schema_overview","title":"Chinook Database Schema Overview","artifact_type":"table","data":[{"table_name":"ALBUM","row_count":347,"description":"Key columns: ALBUMID, ARTISTID, TITLE"},{"table_name":"ARTIST","row_count":275,"description":"Key columns: ARTISTID, NAME"},{"table_name":"CUSTOMER","row_count":109,"description":"Key columns: ADDRESS, CITY, COMPANY, COUNTRY, CUSTOMERID, EMAIL, FAX, FIRSTNAME, LASTNAME, PHONE, POSTALCODE, STATE, SUPPORTREPID"},{"table_name":"EMPLOYEE","row_count":8,"description":"Key columns: ADDRESS, BIRTHDATE, CITY, COUNTRY, EMAIL, EMPLOYEEID, FAX, FIRSTNAME, HIREDATE, LASTNAME, PHONE, POSTALCODE, STATE, TITLE"},{"table_name":"GENRE","row_count":26,"description":"Key columns: GENREID, NAME"},{"table_name":"INVOICE","row_count":614,"description":"Key columns: BILLINGADDRESS, BILLINGCITY, BILLINGCOUNTRY, BILLINGPOSTALCODE, BILLINGSTATE, CUSTOMERID, INVOICEDATE, INVOICEID, TOTAL"},{"table_name":"INVOICELINE","row_count":2240,"description":"Key columns: INVOICEID, INVOICELINEID, QUANTITY, TRACKID, UNITPRICE"},{"table_name":"MEDIATYPE","row_count":5,"description":"Key columns: MEDIATYPEID, NAME"},{"table_name":"PLAYLIST","row_count":18,"description":"Key columns: NAME, PLAYLISTID"},{"table_name":"TRACK","row_count":3503,"description":"Key columns: ALBUMID, BYTES, CO
Failed to parse chunk: {"type":"artifact_update_chunk","artifact":{"identifier":"schema_overview","title":"Chinook Database Schema Overview","artifact_type":"table","data":[{"table_name":"ALBUM","row_count":347,"description":"Key columns: ALBUMID, ARTISTID, TITLE"},{"table_name":"ARTIST","row_count":275,"description":"Key columns: ARTISTID, NAME"},{"table_name":"CUSTOMER","row_count":109,"description":"Key columns: ADDRESS, CITY, COMPANY, COUNTRY, CUSTOMERID, EMAIL, FAX, FIRSTNAME, LASTNAME, PHONE, POSTALCODE, STATE, SUPPORTREPID"},{"table_name":"EMPLOYEE","row_count":8,"description":"Key columns: ADDRESS, BIRTHDATE, CITY, COUNTRY, EMAIL, EMPLOYEEID, FAX, FIRSTNAME, HIREDATE, LASTNAME, PHONE, POSTALCODE, STATE, TITLE"},{"table_name":"GENRE","row_count":26,"description":"Key columns: GENREID, NAME"},{"table_name":"INVOICE","row_count":614,"description":"Key columns: BILLINGADDRESS, BILLINGCITY, BILLINGCOUNTRY, BILLINGPOSTALCODE, BILLINGSTATE, CUSTOMERID, INVOICEDATE, INVOICEID, TOTAL"},{"table_name":"INVOICELINE","row_count":2240,"description":"Key columns: INVOICEID, INVOICELINEID, QUANTITY, TRACKID, UNITPRICE"},{"table_name":"MEDIATYPE","row_count":5,"description":"Key columns: MEDIATYPEID, NAME"},{"table_name":"PLAYLIST","row_count":18,"description":"Key columns: NAME, PLAYLISTID"},{"table_name":"TRACK","row_count":3503,"description":"Key columns: ALBUMID, BYTES, CO
Received chunk: MPOSER, GENREID, MEDIATYPEID, MILLISECONDS, NAME, TRACKID, UNITPRICE"}]}}


Received chunk: data: {"message":null,"plan":null,"code":null,"code_output":"Stored table artifact: identifier = 'schema_overview', title = 'Chinook Database Schema Overview', number of rows = 10, sample rows = [{'table_name': 'ALBUM', 'row_count': 347, 'description': 'Key columns: ALBUMID, ARTISTID, TITLE'}, {'table_name': 'ARTIST', 'row_count': 275, 'description': 'Key columns: ARTISTID, NAME'}]\n","code_error":null,"type":"assistant_action_chunk","index":0}


Received chunk: data: {"message":"Here's an overview of your Chinook databas","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"e:\n<artifact identifier='sch","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ema_overview' warning='I cannot see","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":" the full data so I must not make up o","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"bservations' />\n\nThis appears to be a music s","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"tore database with several interconnected","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":" tables:\n- Albums and Artists form the c","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ore music catalog\n- Tracks contain the ","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"individual songs\n- Custom","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ers and Employees manage th","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"e business side\n- Invoices ","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"and InvoiceLines track ","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"sales\n- Playlists organize the tracks\n- Genres and MediaTypes pro","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"vide additional classification\n\nWould you like to explore a","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Received chunk: data: {"message":"ny specific aspect of this schema in more detail?","plan":null,"code":null,"code_output":null,"code_error":null,"type":"assistant_action_chunk","index":1}


Stream completed
```
