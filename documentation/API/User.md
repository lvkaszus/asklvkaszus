<div align="center">
<h1>Ask @lvkaszus!</h1>
<h3>REST API Documentation</h3>
<p style="font-size: 24px">User Endpoints</p>
</div>

<p style="font-size: 20px;">To use these endpoints, the Public User API must be enabled by the administrator, as it is disabled by default!</p>


### Application Settings

#### **HTTP Method(s)**:
```
GET
```

#### **Endpoint URI**:
```
/api/v3/user/app_settings
```

#### **Endpoint Description**:
This endpoint is used to retrieve global application settings.

#### **HTTP Headers**:
- **No request headers required.**  
  No special headers are needed for the request.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_USER_RATELIMIT` (user-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK** (GET):
   If the request is successful, it will return the current application settings.

   **Example Response**:
   ```json
   {
     "markdown_admin_enabled": true,
     "markdown_frontend_enabled": false,
     "approve_questions_first": true
   }
   ```

2. **HTTP 404 - Not Found**:
   If the application settings are not yet set, it will return a 404 error.

   **Example Response**:
   ```json
   {
     "error": "App Settings are not set yet!"
   }
   ```

3. **HTTP 500 - Internal Server Error**:
   If a server error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "An error occurred while loading application settings! Try again later."
   }
   ```

#### **Functionality**:
1. The endpoint fetches the current application settings stored in the database.
2. If the settings exist, they are returned as a JSON response.
3. If the settings do not exist, a 404 error is returned.


### Fetch All Questions

#### **HTTP Method(s)**:
```
GET
```

#### **Endpoint URI**:
```
/api/v3/user/fetch_all_questions
```

#### **Endpoint Description**:
This endpoint allows users to fetch all questions stored in the database, ordered by date in descending order (newest first).

#### **HTTP Headers**:
- **No request headers required.**  
  No special headers are needed for the request.

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_USER_RATELIMIT` (user-specific rate limit).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If questions exist, returns a list of all questions.

   **Example Response**:
   ```json
   [
     {
       "id": "abea6464-43af-4fc2-9ae4-392678466788",
       "date": "2025-02-07 12:34:56",
       "question": "Hi!",
       "answer": "Hello there!"
     },
     {
       "id": "30f9692e-3f3a-4499-b6a9-4aa26491a703",
       "date": "2025-02-06 10:20:30",
       "question": "How does this application work?",
       "answer": "This application works with some Python and JavaScript magic!"
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

3. **HTTP 500 - Internal Server Error**:
   If an error occurs while retrieving questions from the database.

   **Example Response**:
   ```json
   {
     "error": "An error occurred while fetching questions list! Try again later."
   }
   ```

#### **Functionality**:
1. Queries all records from the `Questions` table, ordering by date in descending order.
2. Iterates through the results, formatting each question into a structured JSON format.
3. If no questions are found, returns a `"message": "No questions yet!"` response.
4. If any errors occur, logs the error and returns a `500` response.
5. Ensures proper closing of the SQL session in the `finally` block.


### Submit New Question

#### **HTTP Method(s)**:
```
POST
```

#### **Endpoint URI**:
```
/api/v3/user/submit_question
```

#### **Endpoint Description**:
This endpoint allows users to submit a new question. Depending on the application settings, questions may need to be approved by an administrator before they are visible to others. The endpoint ensures that only non-empty messages are accepted, and it handles the blocking of users with previously flagged IP addresses.

#### **HTTP Headers**:
- **No request headers required.**  
  No special headers are needed for the request.

#### **Request Body**:
- `question` (string, required): The question that the user wants to submit.

   **Example Request Body**:
   ```json
   {
     "question": "How are you doing?"
   }
   ```

#### **Ratelimiting**:
- Request limit: Defined by `Config.API_USER_RATELIMIT` (user-specific rate limit).

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the question is submitted successfully, it will return a success message. The question may either be immediately visible or await administrator approval.

   **Example Response**:
   ```json
   {
     "success": "Your message has been sent successfully!"
   }
   ```
   Or if approval is required:
   ```json
   {
     "success": "Your message has been sent successfully, but administrator needs to approve it before it will be visible!"
   }
   ```

2. **HTTP 400 - Bad Request**:
   If the question is empty or invalid, it will return a message indicating the error.

   **Example Response**:
   ```json
   {
     "error": "Sending question failed. Empty messages are not allowed!"
   }
   ```

3. **HTTP 403 - Forbidden**:
   If the sender's IP address is blocked, it will return a message indicating that the sender is blocked from submitting questions.

   **Example Response**:
   ```json
   {
     "error": "Sending question failed. You have been blocked!"
   }
   ```

4. **HTTP 500 - Internal Server Error**:
   If an error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "An error occurred while sending your message! Try again later."
   }
   ```

#### **Functionality**:
1. The endpoint accepts a `POST` request with a `question` in the request body.
2. It checks if the question is empty; if so, it returns a `400` error.
3. It checks if the sender's IP address is blocked; if so, it returns a `403` error.
4. The question is assigned a unique `UUID` and added to the `Questions` table.
5. If the `approve_questions_first` setting is enabled, the question is marked as hidden until approved by the administrator.
6. Notifications are sent to the administrator (via push and Telegram) whenever a new question is submitted.
7. If any error occurs during processing, it logs the error and returns a `500` error response.


<div align="center">

[Back to Documentation Homepage](../Main.md)

</div>
