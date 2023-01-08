## Persiapan project

Terdapat beberapa hal yang harus kita siapkan sebelum membuat project:

- Buat file utama project (entry point) bisa dinamai dengan app.js atau index.js
- Arahkan fokus teminal ke directory project, kemudian command `npm init` dan isi beberapa pertanya yang diajukan:

  - package name
  - version
  - description
  - entry point (file utama)
  - git repository (bisa dikosongkan dulu)
  - keywords
  - author
  - license (bisa diisi dengan ISC)
  - kemudain command ok sehingga nanti akan muncul file package.json

- install express js, body-parser, compression, cors, dotenv dan helmet, dengan command:

  ```
  npm install express body-parser compression cors dotenv helmet
  ```

  - body-parser adalah library yang berisi middleware untuk membaca sebuah data yang dikirimkan oleh http post dan menyimpannya sebagai object javascript yang dapat diakses melalui req.body [[1]](https://santrikoding.com/tutorial-expressjs-restful-api-4-insert-data-ke-database)
  - compression digunakan mengompres body respons untuk semua request yang melewatinya.
  - cors (Cross Origin Resource Sharing) <br>
    Merupakan sebuah teknik menggunakan HTTP request untuk mengizinkan browser pada suatu domain mendapatkan akses ke server pada sumber yang berbeda. Ini akan membuat restful API yang sudahkita buat sebelumnya bisa diakses oleh aplikasi lain seperti android atau web browser.
  - dotenv digunakan untuk menyimpan data - data yang bersifat sensitif atau rahasia, tujuannya agar data - data tersebut tidak bisa diakses oleh user dari sisi client [[2]](https://www.youtube.com/watch?v=jBAZPXNQq0Y&t=2542s)
  - helmet untuk memperkuat security project kita.

- Buat folder src, yang didalamnya buat:

  - folder configs
  - folder middlewares
  - folder controllers
  - file index.js (entry point)
  - file .env

- Buka file .`env` dan asign data - data yang sifatnya sensitif (port, username, password mysql, host dan nama database):

  ```
  PORT=6023
  DATABASE_USERNAME=root
  DATABASE_PASSWORD=zero
  DATABASE_HOST=localhost
  DATABASE_NAME=user_post
  ```

- Buka file `index.js` (entry point project), inisialisasi dan konfigurasi semua package yang sudah kita install termasuk port yang kita assign di file `.env`, buat route, buat server listening dan jalankan project melalui cli [[3]](https://github.com/argianardi/user-role/blob/prepare/src/index.js).

```
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 6022;

// use package
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// server listening
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Reference

- [[1] santrikoding.com](https://santrikoding.com/tutorial-expressjs-restful-api-4-insert-data-ke-database)
- [[2] youtube.com/prawitohudoro](https://www.youtube.com/@prawitohudoro)
- [[3] github.com/argianardi/user-role](https://github.com/argianardi/user-role)
