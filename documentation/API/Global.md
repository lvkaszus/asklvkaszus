<div align="center">
<h1>Ask @lvkaszus!</h1>
<h3>REST API Documentation</h3>
<p style="font-size: 24px">Global Endpoints</p>
</div>


### Root API Endpoint

#### **HTTP Method(s)**:
```
GET
```

#### **Endpoint URI**:
```
/api/v3/
```

#### **Endpoint Description**:
This endpoint provides informational data about the application, including its name and the official creator's repository link. It is primarily intended for administrators and external services to access basic metadata about the application. This endpoint does not function as a health check or heartbeat mechanism for monitoring tools like Uptime Kuma or others.

#### **HTTP Headers**:
- **No request headers required.**  
  No special headers are needed for the request.

#### **Ratelimiting**:
- Request limit: 1000 requests per hour (enforced by `@limiter.limit('2000 per hour')`).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the request is successful, it will return the current backend version.

   **Example Response**:
   ```json
   {
     "application_name": "Ask @lvkaszus! - Backend",
     "repository_url": "https://github.com/lvkaszus/asklvkaszus"
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
   If an server error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. The endpoint provides basic metadata about the application, including its name and the official repository link.
2. No input data is required for the request, and no special headers are needed.
3. Upon a valid request, the endpoint will return the application's name and the official repository URL.
4. If there is an issue processing the request, such as a server error, a 500 error response will be returned with an appropriate error message.


### Health Check

#### **HTTP Method(s)**:
```
GET
```

#### **Endpoint URI**:
```
/api/v3/health_check
```

#### **Endpoint Description**:
This endpoint is used to fetch the current health status of the application backend and databases connected to it.

#### **HTTP Headers**:
- **No request headers required.**  
  No special headers are needed for the request.

#### **Ratelimiting**:
- None

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the request is successful, it will return the healthy status.

   **Example Response**:
   ```json
   {
     "status": "ok"
   }
   ```

2. **HTTP 503 - Service Unavailable**:
   If the backend, SQL or Redis database is not working properly, it will log current application state and return an error with 503 status code.

   **Example Response**:
   ```json
   {
     "status": "error"
   }
   ```

3. **HTTP 500 - Internal Server Error**:
   If an server error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. The endpoint is publicly accessible.
2. Upon request, it checks the availability of both the SQL database and the Redis server.
3. If both services are operational, it returns a status of "ok" with HTTP status code 200.
4. If either service is unavailable, it returns a status of "error" with HTTP status code 503.
5. In case of errors, critical information is logged to the application logs.


### Fetch currently running Backend version

#### **HTTP Method(s)**:
```
GET
```

#### **Endpoint URI**:
```
/api/v3/fetch_backend_version
```

#### **Endpoint Description**:
This endpoint is used to fetch the currenly running version of the application backend.

#### **HTTP Headers**:
- **Authorization**: Requires an API key (api_key) for authorization (`Authorization: Ask-lvkaszus-API-Key: xxxxxxxxxx`) This is enforced by the `@require_api_key` decorator.

#### **Ratelimiting**:
- Request limit: 50 requests per hour (enforced by `@limiter.limit('50 per hour')`).

#### **Request Body**:
- **No input data required.**  
  The request body should be empty.

#### **Possible Responses**:

1. **HTTP 200 - OK**:
   If the request is successful, it will return the current backend version.

   **Example Response**:
   ```json
   {
     "backend_version": "3.0.0"
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
   If an server error occurs while processing the request, it will return an error message with a 500 status code.

   **Example Response**:
   ```json
   {
     "error": "Internal Server Error!"
   }
   ```

#### **Functionality**:
1. The endpoint is secured using the `@require_api_key` decorator, meaning every request must include a valid API key.
2. Upon a valid request, the `fetch_backend_version()` function will return the backend version stored in the `backend_version` variable.
3. If an error occurs, such as an issue accessing the `backend_version` variable, a 500 error response will be returned with an appropriate error message.


<div align="center">

[Back to Documentation Homepage](../Main.md)

</div>
