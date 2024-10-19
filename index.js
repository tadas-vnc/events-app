const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const app = express()
const path = require('path');
const port = 4000
const cors = require('cors');
bodyParser = require('body-parser');
const mime = require('mime-types');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({
  dest: 'uploads/', // Temporary folder for uploaded files
  limits: {
      fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
  },
}).single('file');
function uploadFile(filePath, callback = (res)=>{})  {
  const formData = new FormData();
  const fileName = path.basename(filePath);
  formData.append('files[]', fs.createReadStream(filePath), fileName);
  axios.post('https://qu.ax/upload.php', formData, {
    headers: {
      ...formData.getHeaders(), 
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'priority': 'u=1, i'
    },
    referrer: 'https://qu.ax/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    mode: 'cors',
    withCredentials: false
  })
  .then(response => {
    callback(response)
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });
}

uploadFile("image.png", (response)=>{
  console.log(response.data.files[0].url)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const db = new sqlite3.Database(path.join(__dirname, 'database.db'))
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
	last_visit_at INTEGER DEFAULT CURRENT_TIMESTAMP,
	is_admin BOOLEAN DEFAULT FALSE,
	token TEXT UNIQUE NOT NULL,
	email_verified BOOLEAN DEFAULT FALSE
);
`,[])
db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  location TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
  is_approved BOOLEAN DEFAULT FALSE,
  category_id INTEGER NOT NULL,
  happening_at INTEGER NOT NULL,
  image_url TEXT,
  is_hidden BOOLEAN DEFAULT FALSE
);
`,[])
db.run(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
  is_hidden BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE
);
`,[])
});
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
function b64e(text){
  return (Buffer.from(text.toString()).toString('base64'));
}

function b64d(text){
  return Buffer.from(text.toString(), 'base64').toString('ascii')
}
const usernamePattern = /^[A-Za-z0-9_]{2,24}$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
function sendError(res, code, error, errcode){
  return res.status(code).json({"error":error, "code":code, "errcode":errcode})
}

app.all('/api/:reqtype/:arg1?', (req, res) => {
  let current_account = null
  let token = req.headers.authorization
  if (token != null) {
      db.all("UPDATE users SET last_visit_at = strftime('%s') WHERE token = ? RETURNING *", [token], (err, rows) => {
      if (err) {
        console.log(124542)
        console.log(err)
      }
    
      if (rows.length > 0) {
        current_account = rows[0]
      }
      after1()
      })
    }else{
      after1()
    }
      function after1(){
      const reqtype = req.params.reqtype
      const arg1 = req.params.arg1
      switch (reqtype) {
        case "sign-up":
          if (req.method.toLocaleLowerCase() != "post") {
            return sendError(res, 405, "Method not allowed.", 124643)
          }

          let username = req.body.username
          let password = req.body.password
          let email = req.body.email
          if (!usernamePattern.test(username)) {
            return sendError(res, 400, "Username can only contain Latin letters, numbers, and underscores, and must be between 2 and 24 characters long.", 65432)
          }

          if (!passwordPattern.test(password)) {
            return sendError(res, 400, "Password must be at least 8 characters long, contain at least one number, and have at least one uppercase letter.", 123456)
          }

          if (!emailPattern.test(email)) {
            return sendError(res, 400, "Invalid email address.", 64338)
          }

          db.all("SELECT * FROM users WHERE lower(username) = ? OR lower(email) = ?", [username.toLocaleLowerCase(), email.toLocaleLowerCase()], (err, rows) => {
            if (err) {
              console.log(235665)
              console.log(err)
            }
            if (rows.length > 0) {
              if (rows[0].email.toLocaleLowerCase() == email.toLocaleLowerCase()) {
                return sendError(res, 400, "Account with this email already exists", 47244)
              }
              if (rows[0].username.toLocaleLowerCase() == username.toLocaleLowerCase()) {
                return sendError(res, 400, "Account with this username already exists", 15887)
              }
            }

            db.all("SELECT count(*) as user_count FROM users ", [], (err, rows) => {
              if (err) {
                console.log(3543543)
                console.log(err)
              }
              let newid = rows[0].user_count
              let token = b64e(newid).replaceAll("=", "") + "." + makeid(16)
              db.run(`INSERT INTO users (username, email, password, created_at, last_visit_at, token) 
VALUES (?, ?, ?, strftime('%s'), strftime('%s'), ?)`, [username, email, password, token])
              return res.status(200).json({ "message": "Account created successfully.", "code": 200, "token": token })
            })
          })
          break
        case "login":
          if (req.method.toLocaleLowerCase() != "post") {
            return sendError(res, 405, "Method not allowed.", 124643)
          }
          let usernamelog = req.body.username || ""
          let passwordlog = req.body.password || ""
          let emaillog = req.body.email || ""

          db.all("SELECT * FROM users WHERE (lower(username) = ? OR lower(email) = ?) AND password == ?", [usernamelog.toLocaleLowerCase(), emaillog.toLocaleLowerCase(), passwordlog], (err, rows) => {
            if (err) {
              console.log(235665)
              console.log(err)
            }
            if (rows.length <= 0) {
              return sendError(res, 400, "Invalid email/username or password.", 39823)
            }
            let acc = rows[0]

            db.all("UPDATE users SET last_visit_at = strftime('%s') WHERE id = ?", [acc.id], (err, rows) => {
              if (err) {
                console.log(87953)
                console.log(err)
              }
              return res.status(200).json({ "message": "Logged in successfully.", "code": 200, "token": acc.token })
            })
          })
          break
        case "user":
          if (current_account == null) {
            return sendError(res, 401, "Unauthorized.", 10245)
          }
          let accinfo = {
            "username": current_account.username,
            "id": current_account.id,
            "created_at": current_account.created_at,
            "last_visit_at": current_account.last_visit_at,
            "is_admin": current_account.is_admin
          }
          if (arg1 == null || arg1 == "") {
            return res.status(200).json({ "code": 200, "message": "Fetched account details successfully.", "data": (accinfo) })
          }
          db.all("SELECT * FROM users WHERE id = ?", [arg1], (err, rows) => {
            if (err) {
              console.log(74886)
              console.log(err)
            }
            if (rows.length <= 0) {
              return sendError(res, 404, "Account not found.", 45654)
            }
            let foundacc = rows[0]
            let accinfo = {
              "username": foundacc.username,
              "id": foundacc.id,
              "created_at": foundacc.created_at,
              "last_visit_at": foundacc.last_visit_at,
              "is_admin": foundacc.is_admin
            }
            return res.status(200).json({ "code": 200, "message": "Fetched account details successfully.", "data": (accinfo) })
          })
          break
        case "posts":
          if (current_account == null) {
            return sendError(res, 401, "Unauthorized.", 35788)
          }
          db.all("SELECT posts.id, posts.author_id, users.username AS author_username, posts.location, posts.name, posts.created_at, posts.category_id, categories.name AS category_name, posts.happening_at, posts.image_url FROM posts JOIN users ON posts.author_id = users.id JOIN categories ON posts.category_id = categories.id WHERE posts.is_hidden = FALSE AND posts.is_approved = TRUE;",[],(err,rows)=>{
            if (err) {
              console.log(55675)
              console.log(err)
            }
            if(rows.length <= 0){
              return res.status(200).json({ "code": 200, "message": "No posts yet.", "data": [] })
            }
            return res.status(200).json({ "code": 200, "message": "Fetched posts successfully.", "data": rows })
          })
          break
        default:
          return sendError(res, 400, "Invalid request type.", 102)
      }
    }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})