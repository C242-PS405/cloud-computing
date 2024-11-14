#User API Specification

## Register User API
Endpoint : POST api/users/register

Request body:
```json 
{
    "name" : "name",
    "email" : "email",
    "password" : "password",
}
```

Respon body Successfully:
```json 
{
    "data": {
        "id": "id",
        "name" : "name",
        "email" : "email",
    }
}
```

Respon body Error:
```json 
{
    "error" : "Username already registered",
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
        "id": "1",
        "name" : "name",
        "email" : "email",
        "updateAt" : "updatedAt",
        "createdAt" : "createdAt",
        "token" : {
            "ACCESS_TOKEN" : "ACCESS_TOKEN",
            "REF_TOKEN" : "REF_TOKEN"
        },
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
    "email" : "email", //optional
    "password" : "new password", //optional
}
```

Respon body Successfully:
```json 
{
    "data": {
        "email" : "email",
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
        "name" : "name",
        "email" : "email",
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