# Todo Backend API Documentation

This document provides a comprehensive overview of all available API endpoints in the Todo Backend application.

## Table of Contents
1. [User Management](#user-management)
2. [Todo Management](#todo-management)
3. [Admin Management](#admin-management)

## User Management

### User Signup
![User Signup](images/userSignup1.png)
![User Signup Response](images/userSignup2.png)
- **Endpoint**: `/api/v1/user/signup`
- **Method**: POST
- **Description**: Creates a new user account
- **Request Body**: 
  - personal_id (required)
  - name (required)
  - email (required)
  - password (required)
  - confirmPassword (required)
  - address (optional)
  - phone_number (optional)
- **Response**: Returns success message and sends OTP to email
- **Function**: Takes user credentials and personal information to create a new account, sending a verification OTP to the provided email.

### User Signin
![User Signin](images/userSignin1.png)
![User Signin Response](images/userSignin2.png)
- **Endpoint**: `/api/v1/user/signin`
- **Method**: POST
- **Description**: Authenticates a user and returns a JWT token
- **Request Body**: 
  - email (required)
  - password (required)
- **Response**: Returns JWT token and user details
- **Function**: Takes email and password to authenticate a user and returns a JWT token for accessing protected endpoints.

### User Verify OTP
![User Verify OTP](images/userVerifyOTP1.png)
![User Verify OTP Response](images/userVerifyOTP2.png)
- **Endpoint**: `/api/v1/user/verify-otp`
- **Method**: POST
- **Description**: Verifies the OTP sent to user's email
- **Request Body**: 
  - email (required)
  - otp (required)
- **Response**: Returns verification status
- **Function**: Takes the OTP code sent to user's email to verify their account and complete the registration process.

### User Resend OTP
![User Resend OTP](images/userResendOTP1.png)
![User Resend OTP Response](images/userResendOTP2.png)
- **Endpoint**: `/api/v1/user/resend-otp`
- **Method**: POST
- **Description**: Resends OTP to user's email
- **Request Body**: 
  - email (required)
- **Response**: Returns success message
- **Function**: Takes user's email to resend a new OTP code when the previous one has expired or was not received.

### Get User Info
![Get User Info](images/userGetInfo1.png)
![Get User Info Response](images/userGetInfo2.png)
- **Endpoint**: `/api/v1/user/user-infor`
- **Method**: GET
- **Description**: Retrieves user information
- **Headers**: Requires JWT token
- **Response**: Returns user details
- **Function**: Takes a valid JWT token to return the authenticated user's profile information.

## Todo Management

### Get All Todos
![Get All Todos](images/todoGetAll.png)
- **Endpoint**: `/api/v1/todo/get_all`
- **Method**: GET
- **Description**: Retrieves all todo items for the authenticated user
- **Headers**: Requires JWT token
- **Response**: Returns list of todos
- **Function**: Takes a JWT token to return all todo items created by the authenticated user.

### Add Todo
![Add Todo](images/todoAdd1.png)
![Add Todo Response](images/todoAdd2.png)
- **Endpoint**: `/api/v1/todo/add_todo`
- **Method**: POST
- **Description**: Creates a new todo item
- **Headers**: Requires JWT token
- **Request Body**: 
  - todo_image (optional)
  - todo_name (required)
  - todo_desc (required)
  - todo_status (required)
  - user (required)
- **Response**: Returns created todo details
- **Function**: Takes todo details and a JWT token to create a new todo item associated with the authenticated user.

### Update Todo
![Update Todo](images/todoUpdate1.png)
![Update Todo Response](images/todoUpdate2.png)
- **Endpoint**: `/api/v1/todo/update_todo/:id`
- **Method**: PATCH
- **Description**: Updates an existing todo item
- **Headers**: Requires JWT token
- **Request Body**: 
  - todo_image (optional)
  - todo_name (optional)
  - todo_desc (optional)
  - todo_status (optional)
- **Response**: Returns updated todo details
- **Function**: Takes a todo ID and updated details to modify an existing todo item belonging to the authenticated user.

### Delete Todo
![Delete Todo](images/todoDelete.png)
- **Endpoint**: `/api/v1/todo/delete_todo/:id`
- **Method**: DELETE
- **Description**: Deletes a todo item
- **Headers**: Requires JWT token
- **Response**: Returns success message
- **Function**: Takes a todo ID and JWT token to permanently remove a todo item from the user's list.

## Admin Management

### Admin Add User
![Admin Add User](images/adminAddUser1.png)
![Admin Add User Response](images/adminAddUser2.png)
- **Endpoint**: `/api/v1/user/add-user`
- **Method**: POST
- **Description**: Creates a new user (admin only)
- **Headers**: Requires admin JWT token
- **Request Body**: 
  - personal_id (required)
  - name (required)
  - email (required)
  - password (required)
  - address (optional)
  - phone_number (optional)
  - role (optional)
- **Response**: Returns created user details
- **Function**: Takes user details and an admin JWT token to create a new user account with specified permissions.

### Admin Update User
![Admin Update User](images/adminUpdateUser1.png)
![Admin Update User Response](images/adminUpdateUser2.png)
- **Endpoint**: `/api/v1/user/update-user/:id`
- **Method**: PATCH
- **Description**: Updates user details (admin only)
- **Headers**: Requires admin JWT token
- **Request Body**: 
  - personal_id (optional)
  - name (optional)
  - email (optional)
  - password (optional)
  - confirmPassword (optional)
  - address (optional)
  - phone_number (optional)
  - role (optional)
- **Response**: Returns updated user details
- **Function**: Takes a user ID and updated details to modify any user's information, requiring admin privileges.

### Admin Delete User
![Admin Delete User](images/adminDeleteUser.png)
- **Endpoint**: `/api/v1/user/delete-user/:id`
- **Method**: DELETE
- **Description**: Deletes a user (admin only)
- **Headers**: Requires admin JWT token
- **Response**: Returns success message
- **Function**: Takes a user ID and admin JWT token to permanently remove a user account from the system.
