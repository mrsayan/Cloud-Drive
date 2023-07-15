# Setup Guide
## 1. npm install
## 2. Create .env file
```
# MONGO_URI = "mongodb+srv://"
JWT_SECRET=secret
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN = 1
```
## 3. npm start

---



```
NOTE

- To create the 'Admin' user, you need to send a GET request to the '/add-admin' endpoint.
  ( This can be done by using Postman or any other API testing tool )
- Sub-Admin users can be created by the 'Admin' user on the dashboard.
- The folder 'Unsorted' needs to be created manually by the 'Admin' user on the dashboard,
  such that the files uploaded by the Sub-Admin users is by default stored in the 'Unsorted' folder.
  Then, admins can move the files to the appropriate folders.
```

```
Credentials

The credential is hard-coded in the 'app.js' file.  Before logining, you need to create the 'Admin' user by sending a GET request to the '/add-admin' endpoint.

- Role: Admin (default)
  - username: admin
  - password: 1234568
```