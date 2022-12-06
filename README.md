# SafeHome Mobile Android Backend API

## API Documentation:

The API documentation below shows how to access the `SafeHome API` and the required parameters for each method.

TODO: Implement message and notifications api features for mobile applications

```yaml
openapi: '3.1.0'
info:
  version: '1.0.0'
  title: 'SafeHome API'
  license:
    name: MIT
  description: "A backend API service providing continual support for all our customers. All alert signals, 
  user authentication, event notifications and all features have paths within safehome API."
servers:
  - url: 'safehome.com'
paths:
  /:
    get:
      summary: Retrieves a simple welcome message from api service root listener
      responses:
        200:
          description: The service is up and running
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Greeting'
        404:
          description: The API service down for maintenance
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /api/v1/user/login/?email={email}&password={password}:
    parameters:
      - name: email
        description: user email address
        in: path
        required: true
        schema:
          $ref: '#/components/schemas/email'
      - name: password
        description: user password
        in: path
        required: true
        schema:
          $ref: '#/components/schemas/password'
    get:
      summary: Login a user
      responses:
        200:
          description: Returns a user authentication object and limited user account information
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/user'
        404:
          description: No user found for the provided `email` attribute
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        500:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /api/v1/user/register/user={newUser}:
    parameters:
      - name: newUser
        description: The full name of the user
        in: path
        required: true
        schema:
          $ref: '#/components/schemas/user'
    post:
      summary: Register a new user
      responses:
        '200':
          description: Registers a new user account
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/user'
        404:
          description: No user found for the provided `email` attribute
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        500:
          description: Unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    newUser:
      description: The new User account information to register
      type: object
      $ref: '#/components/schemas/user'
    email:
      description: The user unique email address
      $ref: '#/components/schemas/user/email'
      type: string
    password:
      description: The user password 
      $ref: '#/components/schemas/user/password'
      type: string
      encoding: sha-256
    user:
      description: The User account information
      type: object
      required:
        - name
        - email
        - dob
        - password
      properties:
        name:
          type: string
        email:
          description: The user unique email address
          type: string
        password:
          description: The user password 
          type: string
          encoding: sha256
    Greeting:
      type: object
      required:
        - message
      properties:
        message:
          description: A human readable warm greeting from API ROOT
          type: string
    Error:
      type: object
      required:
        - message
      properties:
        message:
          description: A human readable error message
          type: string
  securitySchemes:
    ApiKey:
      type: apiKey
      in: header
      name: X-Api-Key
security:
  - ApiKey: []
```