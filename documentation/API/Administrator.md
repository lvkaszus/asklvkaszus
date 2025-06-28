<div align="center">
<h1>Ask @lvkaszus!</h1>
<h3>REST API Documentation</h3>
<p style="font-size: 24px">Administrator Endpoints</p>
</div>

<p style="font-size: 20px;">To use these endpoints, the Administrator API must be enabled by the administrator, as it is disabled by default!</p>


### Answer a Question

#### **HTTP Method(s)**:
```
PUT
```

#### **Endpoint URI**:
```
/api/v3/admin/answer_question
```

#### **Endpoint Description**:
This endpoint allows the admin to update the answer for a specific question.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (api_key) for authorization (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
The request must contain JSON data with the following fields:
- `question_id` (string, required): The UUID of the question to update.
- `question_answer` (string, required): The answer to the question.

**Example Request**:
```json
{
  "question_id": "943da622-0442-43e7-bc01-53ea18774d90",
  "question_answer": "This is the answer."
}
```

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the answer is successfully updated, it will return a success message.

   **Example Response**:
   ```json
   {
     "success": "Your answer has been updated successfully!"
   }
   ```

2. **HTTP 400 - Bad Request**:
   If the request contains incorrect JSON data or an empty answer, it will return an error message with a 400 status code.

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response when question ID is missing**:
   ```json
   {
     "error": "Please provide a Question ID!"
   }
   ```

  **Example Response when question with specified ID does not exist**:
   ```json
   {
     "error": "Question with selected ID does not exist."
   }
   ```

  **Example Response when answer to specified question is empty**:
   ```json
   {
     "error": "Sending question reply failed. Empty replies are not allowed!"
   }
   ```

  **Example Response when answer to specified question is too long (over 5000 characters)**:
   ```json
   {
     "error": "Sending question reply failed. Message is too long (maximum of 5000 characters)!"
   }
   ```

3. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

4. **HTTP 500 - Internal Server Error**:
   If a server error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. The endpoint is secured using the `@require_api_key` decorator, meaning every request must include a valid API key.
2. The request body must include the `question_id` and the `question_answer`.
3. The endpoint checks if the question exists using the provided `question_id`. If not, it returns an error.
4. If the answer is empty, it will return an error.
5. If the question exists and the answer is valid, the `question.answer` is updated, and the changes are committed to the database.
6. In case of any exception, a 500 error is returned with an appropriate message.


### Application Settings

#### **HTTP Method(s)**:
```
GET, POST
```

#### **Endpoint URI**:
```
/api/v3/admin/app_settings
```

#### **Endpoint Description**:
This endpoint is used to retrieve or update global application settings.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (api_key) for authorization (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
For `POST` requests, the request must contain JSON data with the following fields:
- `global_api_enabled` (boolean): Toggles Application API enable state.
- `markdown_frontend_enabled` (boolean): Toggles Markdown support for the frontend.
- `markdown_admin_enabled` (boolean): Toggles Markdown support for the admin panel.
- `approve_questions_first` (boolean): Toggles whether questions need to be approved before being shown.

**Example Request for `POST`**:
```json
{
  "global_api_enabled": true,
  "markdown_admin_enabled": true,
  "markdown_frontend_enabled": false,
  "approve_questions_first": false
}
```

#### **Possible Responses**:

1. **HTTP 200 - OK** (GET):
   If the request is successful, it will return the current application settings.

   **Example Response for `GET`**:
   ```json
   {
     "global_api_enabled": true,
     "markdown_admin_enabled": true,
     "markdown_frontend_enabled": false,
     "approve_questions_first": true,
     "captcha_enabled": true,
     "captcha_provider": "cf-turnstile",
     "captcha_site_key": "captchapublickey"
   }
   ```

2. **HTTP 200 - OK** (POST):
   If the request to update the application settings is successful, it will return a success message.

   **Example Response for `POST`**:
   ```json
   {
     "success": "App Settings has been updated."
   }
   ```

3. **HTTP 400 - Bad Request** (POST):
   If any required field has incorrect data during the `POST` request, it will return a 400 error with an appropriate message.

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response when data type is invalid**:
   ```json
   {
     "error": "markdown_frontend_enabled must be boolean!"
   }
   ```

4. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

5. **HTTP 500 - Internal Server Error**:
   If a server error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:

- **GET Request**:
  1. The endpoint fetches the current application settings stored in the database.

- **POST Request**:
  1. The request body contains multiple settings to update.
  2. After validating and updating the settings in the database, the changes are committed and a success message is returned.


### Block Sender

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/admin/block_sender
```

#### **Endpoint Description**:
This endpoint allows an admin to block a sender's IP address, preventing them from submitting further questions.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (api_key) for authorization (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
The request must contain JSON data with the following field:
- `sender_ip` (string, required): The IP address of the sender to be blocked.

**Example Request for `POST`**:
```json
{
  "sender_ip": "172.16.0.100"
}
```

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the sender is successfully blocked, the response will confirm the action.

   **Example Response**:
   ```json
   {
     "success": "Sender with IP Address 172.16.0.100 banned successfully!"
   }
   ```

2. **HTTP 400 - Bad Request**:
   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response for missing IP**:
   ```json
   {
     "error": "Sender IP Address cannot be empty!"
   }
   ```

   **Example Response for incorrect IP address format**:
   ```json
   {
     "error": "Invalid Sender IP Address format!"
   }
   ```

   **Example Response for already banned IP**:
   ```json
   {
     "error": "Sender with IP Address 172.16.0.100 is already banned!"
   }
   ```

3. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

4. **HTTP 500 - Internal Server Error**:
   If a server error occurs while processing the request, it will return a 500 error.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. The endpoint extracts the `sender_ip` from the request body.
2. It checks if the provided `sender_ip` is empty; if so, it returns a 400 error.
3. It verifies whether the sender is already blocked; if it is, it returns a 400 error.
4. It retrieves the last question submitted by the sender (if any).
5. It records the block event in the database with:
   - `ip_address`: The blocked IP.
   - `last_question`: The last question submitted by the sender.
   - `date`: The timestamp of when the sender was blocked.
6. The new blocked sender record is saved to the database, and a success message is returned.


### CAPTCHA Settings

#### **HTTP Method(s)**:
```
GET, PUT
```

#### **Endpoint URI**:
```
/api/v3/admin/configure_captcha
```

#### **Endpoint Description**:
This endpoint is used to retrieve or update application CAPTCHA protection settings.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (api_key) for authorization (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
For `PUT` requests, the request must contain JSON data with the following fields:
- `captcha_enabled` (boolean): Toggles Application CAPTCHA protection enable state.
- `captcha_provider` (string: `cf-turnstile` or `google-recaptcha-v2` only, required if `captcha_enabled` is `true`): Describes the current CAPTCHA service provider.
- `captcha_site_key` (string, required if `captcha_enabled` is `true`): Site key required by CAPTCHA service provider to generate matching verification tokens.
- `captcha_secret_key` (string, required if `captcha_enabled` is `true`): Secret key required by the CAPTCHA service provider to verify a request that is protected by a CAPTCHA challenge.

**Example Request for `PUT`**:
```json
{
  "captcha_enabled": true,
  "captcha_provider": "cf-turnstile",
  "captcha_site_key": "ABCDEF123456",
  "captcha_secret_key": "123456abcdef"
}
```

#### **Possible Responses**:

1. **HTTP 200 - OK** (GET):
   If the request is successful, it will return the current CAPTCHA settings.

   **Example Response for `GET`**:
   ```json
   {
     "captcha_enabled": true,
     "captcha_provider": "google-recaptcha-v2",
     "captcha_site_key": "ABCDEF123456",
     "captcha_secret_key": "123456abcdef"
   }
   ```

2. **HTTP 200 - OK** (PUT):
   If the request to update the application settings is successful, it will return a success message.

   **Example Response for `PUT`**:
   ```json
   {
     "success": "CAPTCHA Settings have been updated."
   }
   ```

3. **HTTP 400 - Bad Request** (PUT):
   If any required field has incorrect data during the `PUT` request, it will return a 400 error with an appropriate message.

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response when Enable Captcha data type is invalid**:
   ```json
   {
     "error": "captcha_enabled must be boolean!"
   }
   ```

   **Example Response when required fields are missing**:
   ```json
   {
     "error": "All CAPTCHA fields are required when enabling!"
   }
   ```

   **Example Response when specified Captcha Provider is unsupported**:
   ```json
   {
     "error": "Unsupported CAPTCHA Provider!"
   }
   ```

   **Example Response when Captcha Site Key data type is invalid**:
   ```json
   {
     "error": "captcha_site_key must be string!"
   }
   ```

   **Example Response when Captcha Secret Key data type is invalid**:
   ```json
   {
     "error": "captcha_secret_key must be string!"
   }
   ```

4. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

5. **HTTP 500 - Internal Server Error**:
   If a server error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:

- **GET Request**:
  1. The endpoint fetches the current application CAPTCHA settings stored in the database.

- **PUT Request**:
  1. The request body contains multiple CAPTCHA settings to update.
  2. After validating and updating the CAPTCHA settings in the database, the changes are committed and a success message is returned.


### Configure Notifications

#### **HTTP Method(s)**:
```
PUT
```

#### **Endpoint URI**:
```
/api/v3/admin/configure_notifications
```

#### **Endpoint Description**:
This endpoint allows an admin to configure notification settings, including Web Push and Telegram notifications.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
The request must contain JSON data with optional fields for enabling/disabling notifications.
- `webpush_enabled` (boolean): Enables or disables Web Push notifications.
- `telegram_enabled` (boolean): Enables or disables Telegram notifications.
- `telegram_bot_token` (string, required if `telegram_enabled` is `true`): Telegram Bot Token.
- `telegram_bot_chat_id` (string, required if `telegram_enabled` is `true`): Telegram Chat ID.

**Example Request for `PUT`**:
```json
{
  "webpush_enabled": false,
  "telegram_enabled": true,
  "telegram_bot_token": "123456789:ABCDEFGHI",
  "telegram_bot_chat_id": "123456789"
}
```

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the notification settings are successfully updated.

   **Example Response**:
   ```json
   {
     "success": "Notifications Settings have been updated."
   }
   ```

2. **HTTP 400 - Bad Request**:
   If any required field has incorrect data during the `PUT` request, it will return a 400 error with an appropriate message.

   **Example Response when the username taken from the API key is empty**:
   ```json
   {
     "error": "Invalid session username!"
   }
   ```

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response for invalid Web Push Enabled parameter data type**:
   ```json
   {
     "error": "webpush_enabled must be boolean!"
   }
   ```

   **Example Response for invalid Telegram Enabled parameter data type**:
   ```json
   {
     "error": "telegram_enabled must be boolean!"
   }
   ```

   **Example Response for missing bot token**:
   ```json
   {
     "error": "telegram_bot_token cannot be empty!"
   }
   ```

   **Example Response when Telegram bot token is invalid**:
   ```json
   {
     "error": "Invalid Telegram Bot Token!"
   }
   ```

   **Example Response when Telegram bot token verification unexpectedly fails**:
   ```json
   {
     "error": "Failed to verify provided Telegram Bot Token! Try again later."
   }
   ```

   **Example Response for missing chat ID**:
   ```json
   {
     "error": "telegram_bot_chat_id cannot be empty!"
   }
   ```

   **Example Response for invalid Telegram chat ID parameter data type**:
   ```json
   {
     "error": "telegram_bot_chat_id must be a number!"
   }
   ```

   **Example Response when Telegram chat ID is equal to zero**:
   ```json
   {
     "error": "telegram_bot_chat_id cannot be zero!"
   }
   ```

   **Example Response when Telegram chat ID is too long**:
   ```json
   {
     "error": "telegram_bot_chat_id cannot be longer than 20 characters!"
   }
   ```

3. **HTTP 404 - Not Found**:
   If the user does not exist.

   **Example Response**:
   ```json
   {
     "error": "User not found!"
   }
   ```

4. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

5. **HTTP 500 - Internal Server Error**:  
   If a server error occurs while generating required Web Push keypair.

   **Example Response**:
   ```json
   {
     "error": "An error occurred while generating VAPID Keys!"
   }
   ```

   If a server error occurs while processing the request.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

6. **HTTP 502 - Bad Gateway**:
   If Telegram API returns an error.

   **Example Response**:
   ```json
   {
     "error": "Failed to verify provided Telegram Bot Token because Telegram API returned an error!"
   }
   ```

7. **HTTP 504 - Gateway Timeout**:
   If request to Telegram API times out.

   **Example Response**:
   ```json
   {
     "error": "Failed to verify provided Telegram Bot Token because of Telegram API Timeout Error!"
   }
   ```

#### **Functionality**:
1. Retrieves the API key information from `g.api_key_result` to determine the admin user.
2. Fetches the admin user's data from the `RegisteredUsers` table.
3. Checks if VAPID (Web Push) keys exist:
   - If not, generates new keys using `generate_vapid_keys()`.
   - If new keys are generated, all push notification subscribers are deleted to ensure proper re-registration.
4. Processes the `webpush_enabled` setting:
   - If set to `false`, all Web Push subscribers are deleted.
5. Processes Telegram notification settings:
   - Ensures `telegram_bot_token` and `telegram_bot_chat_id` are provided if Telegram is enabled.
6. Updates the user’s notification settings and commits changes to the database.


### Fetch All Questions

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/admin/fetch_all_questions
```

#### **Endpoint Description**:
This endpoint allows an admin to fetch all questions stored in the database, ordered by date in descending order (newest first).

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If questions exist, returns a list of all questions.  
   Sender IP Address is only visible to administrator!

   **Example Response**:
   ```json
   [
     {
       "id": "abea6464-43af-4fc2-9ae4-392678466788",
       "date": "2025-02-07 12:34:56",
       "question": "Hi!",
       "answer": "Hello there!",
       "hidden": false,
       "ip_address": "192.168.1.100"
     },
     {
       "id": "30f9692e-3f3a-4499-b6a9-4aa26491a703",
       "date": "2025-02-06 10:20:30",
       "question": "How does this application work?",
       "answer": "This application works with some Python and JavaScript magic!",
       "hidden": false,
       "ip_address": "192.168.1.101"
     }
   ]
   ```

2. **HTTP 200 - No Questions**:
   If no questions exist in the database.

   **Example Response**:
   ```json
   {
     "message": "No questions yet!"
   }
   ```

3. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

4. **HTTP 500 - Internal Server Error**:
   If an error occurs while retrieving questions from the database.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. Queries all records from the `Questions` table, ordering by date in descending order.
2. Iterates through the results, formatting each question into a structured JSON format.
3. If no questions are found, returns a `"message": "No questions yet!"` response.
4. If any errors occur, returns a `500` response.


### Fetch Blocked Senders

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/admin/fetch_blocked_senders
```

#### **Endpoint Description**:
This endpoint allows an admin to retrieve a list of all blocked senders (IP addresses), ordered by the date they were blocked (newest first).

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If blocked senders exist, returns a list of all blocked IP addresses.

   **Example Response**:
   ```json
   [
     {
       "id": 2,
       "date": "2025-02-07 12:34:56",
       "ip_address": "192.168.1.100"
     },
     {
       "id": 1,
       "date": "2025-02-06 10:20:30",
       "ip_address": "192.168.1.101"
     }
   ]
   ```

2. **HTTP 200 - No Blocked Senders**:
   If no blocked senders exist in the database.

   **Example Response**:
   ```json
   {
     "message": "No blocked senders yet!"
   }
   ```

3. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

4. **HTTP 500 - Internal Server Error**:
   If an error occurs while retrieving blocked senders from the database.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. Queries all records from the `BlockedSenders` table, ordering by date in descending order.
2. Iterates through the results, formatting each blocked sender into a structured JSON format.
3. If no blocked senders are found, returns a `"message": "No blocked senders yet!"` response.
4. If any errors occur, returns a `500` response.


### Fetch Available Updates

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/admin/fetch_updates
```

#### **Endpoint Description**:
This endpoint allows an admin to check if a newer version of the application is available by querying the GitHub API.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - Updates Available or Up to Date**
The response depends on the result of the `check_for_updates()` function:

   **Already Up-to-Date**
   ```json
   {
     "success": "You are running the latest version."
   }
   ```

   **New Update Available**
   ```json
   {
     "warning": "A newer version of this application is available. Please upgrade!",
     "latest_version": "3.5.0",
     "current_version": "3.0.0"
   }
   ```

2. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

3. **HTTP 500 - Internal Server Error**
If an error occurs while fetching the update information.

   **GitHub API Failure**
   ```json
   {
     "error": "Failed to fetch data from the GitHub API! Try again later."
   }
   ```

   **Internal Server Error**
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

### **Functionality**:
1. Calls the `check_for_updates()` function to fetch the latest release from GitHub.
2. If the response contains:
   - `"error"` → Returns a **500 Internal Server Error**.
   - `"success"` → Returns a **200 OK** (indicating no updates are available).
   - `"warning"` → Returns a **200 OK** (indicating an update is available).
3. If an exception occurs, returns a **500 Internal Server Error**.


### Fetch Public Key for Web Push Notifications

#### **HTTP Method(s)**:
```
GET
```

#### **Endpoint URI**:
```
/api/v3/admin/fetch_vapid_public_key
```

#### **Endpoint Description**:
This endpoint allows an admin to retrieve Public Key used for Web Push Notifications.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If Public Key exists, it is returned in the response.

   **Example Response**:
   ```json
   {
     "public_key": "ABCDEFG"
   }
   ```

2. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

3. **HTTP 500 - Internal Server Error**:
   If an error occurs while generating new Keypair for Web Push Notifications.

   **Generate Web Push Notifications Keypair Failure**:
   ```json
   {
     "error": "An error occurred while generating VAPID Keys!"
   }
   ```

   **Check Web Push Notifications Keypair Failure**:
   ```json
   {
     "error": "An error occurred while checking VAPID Keys!"
   }
   ```

   **Web Push Notifications Keypair is incomplete**:
   ```json
   {
     "error": "VAPID Keys are incomplete! Public or private key is missing."
   }
   ```

   **Internal Server Error**
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

### **Functionality**:
1. Checks if the Web Push Notifications Keypair is correct and valid.
2. If existing keypair is invalid or incorrect, it attempts to regenerate old keypair with a new one - clearing existing Web Push Notifications subscribers table.
3. It retrieves previously correct or newly generated keypair public key.
4. If something is wrong, it will return an error message.


### Purge All Questions

#### **HTTP Method(s)**:
```
DELETE
```

#### **Endpoint URI**:
```
/api/v3/admin/purge_all_questions
```

#### **Endpoint Description**:
This endpoint allows an admin to purge all questions from the database.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If all questions have been successfully purged.

   **Example Response**:
   ```json
   {
     "success": "All questions have been successfully purged!"
   }
   ```

2. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

3. **HTTP 500 - Internal Server Error**:
   If an error occurs while attempting to purge all questions from the database.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. Deletes all questions from the `Questions` table in the database.
2. Commits the changes to the database.
3. If an error occurs during the process, an error message is returned.


### Purge Specific Question

#### **HTTP Method(s)**:
```
DELETE
```

#### **Endpoint URI**:
```
/api/v3/admin/purge_question
```

#### **Endpoint Description**:
This endpoint allows an admin to purge a specific question from the database using its `question_id`.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Rate Limiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
The request must contain JSON data with the following fields:
- `question_id` (string, required): The UUID of the question to be purged.

  **Example Request Body**:
  ```json
  {
    "question_id": "21d4287c-a340-427f-963d-6ca9d804e0ab"
  }
  ```

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the question has been successfully purged.

   **Example Response**:
   ```json
   {
     "success": "Question has been purged successfully!"
   }
   ```

2. **HTTP 400 - Bad Request**:
   If any required field has incorrect data during the `DELETE` request, it will return a 400 error with an appropriate message.

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response when question ID is missing**:
   ```json
   {
     "error": "Please provide a Question ID!"
   }
   ```

3. **HTTP 404 - Not Found**:
   If the question with the provided `question_id` does not exist.

   **Example Response**:
   ```json
   {
     "error": "Question with selected ID does not exist."
   }
   ```

4. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

5. **HTTP 500 - Internal Server Error**:
   If an error occurs while attempting to purge the specified question from the database.

   **Example Response**:
   ```json
   {
     "error": "An error occurred while purging specified question! Try again later."
   }
   ```

#### **Functionality**:
1. Retrieves the question from the `Questions` table based on the provided `question_id`.
2. If the question does not exist, it returns a 404 error with an appropriate message.
3. If the question exists, it is deleted from the database, and changes are committed.
4. In case of an error during the process, an error message is returned.


### Subscribe to Push Notifications

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/admin/subscribe_to_push_notifications
```

#### **Endpoint Description**:
This endpoint allows an admin to subscribe to push notifications by providing the subscription data, including `endpoint` and `keys`.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
The request must contain JSON data with the following fields:
- `endpoint` (string, required): The endpoint URL for the subscription.
- `keys` (object, required): The `keys` object containing:
  - `auth` (string, required): The `auth` key.
  - `p256dh` (string, required): The `p256dh` key.

**Example Request Body**:
```json
{
  "endpoint": "https://example.com/endpoint",
  "keys": {
    "auth": "auth_key_value",
    "p256dh": "p256dh_key_value"
  }
}
```

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the subscription is successful.

   **Example Response**:
   ```json
   {
     "success": "Subscribed successfully!"
   }
   ```

   If the existing subscription has been updated.

   **Example Response**:
   ```json
   {
     "success": "Subscription updated successfully!"
   }
   ```

2. **HTTP 400 - Bad Request**:
   If the provided subscription data is invalid or missing required information.

   **Example Response when the username taken from the API key is empty**:
   ```json
   {
     "error": "Invalid session username!"
   }
   ```

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response when web push notifications endpoint is invalid**:
   ```json
   {
     "error": "Invalid endpoint!"
   }
   ```

   **Example Response when web push notifications auth key is invalid**:
   ```json
   {
     "error": "Invalid auth key!"
   }
   ```

   **Example Response when web push notifications P256DH key is invalid**:
   ```json
   {
     "error": "Invalid p256dh key!"
   }
   ```

3. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

4. **HTTP 500 - Internal Server Error**:
   If an error occurs while subscribing to push notifications.

   **Example Response**:
   ```json
   {
     "error": "An error occurred while subscribing to push notifications channel! Try again later."
   }
   ```

#### **Functionality**:
1. Validates the input data, ensuring that `endpoint`, `auth`, and `p256dh` are provided.
2. Checks if the subscription already exists in the database (based on `endpoint`, `auth`, or `p256dh`).
3. If an existing subscription is found, updates the `subscribed_date`.
4. If no subscription exists, creates a new subscription in the database.
5. If the total number of subscriptions exceeds 25, removes the oldest subscription.
6. Commits changes to the database and returns the appropriate success message.
7. In case of an error, returns a failure response.


### Toggle Visibility of All Questions

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/admin/toggle_all_questions_visibility
```

#### **Endpoint Description**:
This endpoint allows an admin to toggle the visibility of all questions in the database. It will either make all questions visible or hide them, depending on their current visibility state.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the visibility of all questions is successfully toggled.

   - If all questions were previously hidden and are now made visible:
   
     **Example Response**:
     ```json
     {
       "success": "All questions are now visible."
     }
     ```

   - If all questions were previously visible and are now hidden:
   
     **Example Response**:
     ```json
     {
       "success": "All questions are now hidden."
     }
     ```

2. **HTTP 404 - Not Found**:
   If there are no questions in the database to toggle visibility.

   **Example Response**:
   ```json
   {
     "error": "There are no questions yet!"
   }
   ```

3. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

4. **HTTP 500 - Internal Server Error**:
   If an error occurs while attempting to toggle the visibility of all questions.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. Retrieves all questions from the database.
2. If no questions exist, returns a 404 error.
3. If all questions are hidden, it sets them to visible.
4. If any questions are visible, it sets them to hidden.
5. Commits the changes to the database and returns a success message indicating the new visibility state.
6. If an error occurs during the process, returns a failure message.


### Toggle Visibility of a Specific Question

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/admin/toggle_question_visibility
```

#### **Endpoint Description**:
This endpoint allows an admin to toggle the visibility of a specific question based on its ID. The visibility of the question will be changed from visible to hidden or vice versa.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- `question_id` (string, required): The UUID of the question whose visibility is to be toggled.

   **Example Request Body**:
   ```json
   {
     "question_id": "0a4d96e8-2886-4b77-b3fa-15e2e455185d"
   }
   ```

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the visibility of the specified question is successfully toggled.

   - If the question was previously hidden and is now made visible:
   
     **Example Response**:
     ```json
     {
       "success": "Question is now visible."
     }
     ```

   - If the question was previously visible and is now hidden:
   
     **Example Response**:
     ```json
     {
       "success": "Question is now hidden."
     }
     ```

2. **HTTP 400 - Bad Request**:
   If any required field has incorrect data during the `POST` request, it will return a 400 error with an appropriate message.

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response when question ID is missing**:
   ```json
   {
     "error": "Please provide a Question ID!"
   }
   ```

3. **HTTP 404 - Not Found**:
   If the question with the provided ID does not exist in the database.

   **Example Response**:
   ```json
   {
     "error": "Question with selected ID does not exist."
   }
   ```

4. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

5. **HTTP 500 - Internal Server Error**:
   If an error occurs while attempting to toggle the visibility of the question.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. Retrieves the question from the database using the provided ID.
2. If the question does not exist, returns a 404 error.
3. If the question is hidden, it makes it visible; if it is visible, it hides the question.
4. Commits the change to the database and returns a success message indicating the new visibility state.
5. If an error occurs during the process, logs the error and returns a failure message.


### Unblock All Blocked Senders

#### **HTTP Method(s)**:
```
DELETE
```

#### **Endpoint URI**:
```
/api/v3/admin/unblock_all_senders
```

#### **Endpoint Description**:
This endpoint allows an admin to unblock all blocked senders by deleting all entries in the `BlockedSenders` table.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If all blocked senders are successfully unblocked.

   **Example Response**:
   ```json
   {
     "success": "All senders have been successfully unbanned!"
   }
   ```

2. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

3. **HTTP 500 - Internal Server Error**:
   If an error occurs while unblocking the senders.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. Deletes all entries in the `BlockedSenders` table to unblock all senders.
2. Commits the change to the database and returns a success message.
3. If an error occurs during the unblocking process, returns a failure message.


### Unblock Blocked Sender

#### **HTTP Method(s)**:
```
DELETE
```

#### **Endpoint URI**:
```
/api/v3/admin/unblock_sender
```

#### **Endpoint Description**:
This endpoint allows an admin to unblock a specific sender by their IP address.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- `sender_ip` (string, required): The IP address of the sender to unblock.

   **Example Request Body**:
   ```json
   {
     "sender_ip": "172.16.0.100"
   }
   ```

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the sender is successfully unblocked.

   **Example Response**:
   ```json
   {
     "success": "Sender with IP Address 172.16.0.100 unbanned successfully!"
   }
   ```

2. **HTTP 400 - Bad Request**:
   If any required field has incorrect data during the `DELETE` request, it will return a 400 error with an appropriate message.

   **Example Response when JSON data is invalid**:
   ```json
   {
     "error": "Invalid JSON payload!"
   }
   ```

   **Example Response when sender IP address is missing**:
   ```json
   {
     "error": "Sender IP Address cannot be empty!"
   }
   ```

   **Example Response when sender IP address is in invalid format**:
   ```json
   {
     "error": "Invalid Sender IP address format!"
   }
   ```

3. **HTTP 404 - Not Found**:
   If the sender with the provided IP address does not exist in the blocked senders table.

   **Example Response**:
   ```json
   {
     "error": "Sender with IP Address 172.16.0.100 not found!"
   }
   ```

4. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

5. **HTTP 500 - Internal Server Error**:
   If an error occurs while unblocking the sender.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. Checks if the sender's IP address is provided in the request body.
2. Searches for the sender's IP in the `BlockedSenders` table.
3. If the sender is found, deletes the entry to unblock the sender and commits the change.
4. If the sender is not found, returns an error message.
5. If any error occurs during the process, returns a failure message.


### Get Current User Info

#### **HTTP Method(s)**:
```
GET
```

#### **Endpoint URI**:
```
/api/v3/admin/user_info
```

#### **Endpoint Description**:
This endpoint allows an admin to retrieve detailed information about the currently authenticated user based on their API key.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`). Enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_ADMIN_RATELIMIT` (admin-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the user information is successfully retrieved.

   **Example Response**:
   ```json
   {
     "username": "lvkaszus",
     "last_password_change": "2025-01-10 15:30:00",
     "password_change_count": 4,
     "api_admin_enabled": false,
     "api_user_enabled": false,
     "api_key": null,
     "push_notifications_enabled": true,
     "telegram_enabled": true,
     "telegram_bot_token": "123456789:ABCDEFGHI",
     "telegram_bot_chat_id": "123456789"
   }
   ```

2. **HTTP 400 - Bad Request**:
   If no username was provided or found in the API key result.

   **Example Response**:
   ```json
   {
     "error": "Invalid session username!"
   }
   ```

3. **HTTP 404 - Not Found**:
   If the user does not exist.

   **Example Response**:
   ```json
   {
     "error": "User not found!"
   }
   ```

4. **HTTP 429 - Too Many Requests**:
   If too many requests have been already sent, it will return a 429 error.

   **Example Response**:
   ```json
   {
     "error": "Rate-limit exceeded! Try again later."
   }
   ```

5. **HTTP 500 - Internal Server Error**:
   If an error occurs while fetching the user information.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. The endpoint checks if an API key is provided and if the user associated with that key is authorized.
2. If the username is available from the API key result, it fetches the user information from the `RegisteredUsers` table.
3. The user info is returned as a JSON object with fields like username, password change count, API access, push notifications, and Telegram bot details.
4. If no username is found or an error occurs, it returns an appropriate error message.


<div align="center">

[Back to Documentation Homepage](../Main.md)

</div>
