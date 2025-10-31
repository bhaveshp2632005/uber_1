# API Documentation

## User Registration Endpoint

### POST `/user/register`

Register a new user in the system.

#### Request Body

```json
{
  "fullname": {
    "firstname": "string", // minimum 3 characters
    "lastname": "string"   // optional, minimum 3 characters if provided
  },
  "email": "string",      // valid email format
  "password": "string"    // minimum 6 characters
}
```

#### Validation Rules
- Email must be a valid email address
- First name must be at least 3 characters long
- Password must be at least 6 characters long
- Email must be unique (not already registered)

#### Success Response

**Code:** 201 CREATED

**Response Body:**
```json
{
  "token": "string", // JWT token valid for 24 hours
  "user": {
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "_id": "string"
  }
}
```

#### Error Responses

**Code:** 400 BAD REQUEST
- When validation fails for any field
```json
{
  "errors": [
    {
      "msg": "Error message",
      "param": "field_name"
    }
  ]
}
```

**Code:** 400 BAD REQUEST
- When email is already registered
```json
{
  "error": "Email is already in use"
}
```

**Code:** 500 INTERNAL SERVER ERROR
- When server encounters an error during user creation
```json
{
  "error": "Internal server error message"
}
```

#### Notes
- The password is automatically hashed before storing
- A JWT token is generated upon successful registration
- The token expires in 24 hours
- The response will not include the password field