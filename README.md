# Fullstack app (react as frontend and asp.net core as backend)

- Fullstack app thats use jwt(accessToken and refreshToken) for authentication
- Implement role based authorization

## Important!!!!

- if you cant access the admin page, you need to go to the database and add "Admin" role to your user
- you need to update UserRoles where UserId is foreignkey from Users table and RoleId is foreignkey from Roles table, for the id on the UserRoles table you dont need to enter anything just fill up other two tables and Enter.
- The DummyRole and UserRole in My roles are just TEMP ROLES on the frontend (created there to quick fix bug) these roles are not actually stored in the database.

## Backend webapi

### Go to Server folder then run commands:\

- dotnet run

## Frontend react

### Go to Client folder then run following commands:\

- npm install (to install all dependencies packages)\
- npm start (to run react app)
