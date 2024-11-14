#User API Specification

## Register User API
Endpoint : POST api/users
Endpoint : POST api/users/register

Request body:
```json 
{
    "name": "rama",
    "email": "damada@gmail.com",
    "password": "123456789",
    "confirmPassword": "123456789"
}
```

Respon body Successfully:
```json 
{
    "data": {
        "email": "damada@gmail.com",
        "name": "rama"
  }
}
```

Respon body Error:
```json 
{
    "error" : "Username already registered or comfirm password incorrect",
}
```

## Login User API
Endpont : POST /api/user/login

Request body:
```json 
{
    "email" : "email",
    "password" : "******",
}
```

Respon body Successfully:
```json 
{
    "data": {
        "name" : "name",
        "accessToken" : "token",
        "refreshToken" : "refresh"
    }
}
```

Respon body Error:
```json 
{
    "error" : "Username or password incorrect",
}
```

## Update User API
Endpont : PATCH /api/user/current

Header :
- Authorization : token

Request body:
```json 
{
    "username" : "username", //optional
    "password" : "new password", //optional
}
```

Respon body Successfully:
```json 
{
    "data": {
        "username" : "username",
        "name" : "name",
    }
}
```

Respon body Error:
```json 
{
    "error" : "Name length max 100",
}
```

## Get User API
Endpont : GET /api/user/current

Header :
- Authorization : token

Respon body Successfully:
```json 
{
    "data": {
        "username" : "username",
        "name" : "name",
    }
}
```

Respon body Error:
```json 
{
    "error" : "Unauthorized",
}
```

## Logout User API
Endpont : DELETE /api/user/logout

Header :
- Authorization : token

Respon body Successfully:
```json 
{
    "data": "ok",
}
```

Respon body Error:
```json 
{
    "error" : "Unauthorized",
}
```