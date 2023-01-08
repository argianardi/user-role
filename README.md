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
  DB_USERNAME=root
  DB_PASSWORD=zero
  DB_HOST=localhost
  DB_NAME=table_relation
  ```

- Buka file `index.js` (entry point project), inisialisasi dan konfigurasi semua package yang sudah kita install termasuk port yang kita assign di file `.env`, buat route, buat server listening dan jalankan project melalui cli [[3]](https://github.com/argianardi/user-role/blob/prepare/src/index.js).

```
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

//initialize express
const app = express();

// use packages
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// server listening
const PORT = process.env.PORT || 6022;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## [Setting ORM (Object Relational Mapping)](https://github.com/argianardi/user-role/tree/SettingORM)

ORM adalah teknik untuk mengeksekusi data base menjadi object tanpa menggunakan query [[4]](https://www.youtube.com/watch?v=FebHGa5-bL4&list=PLwdv9eOjH5CZrEPvWIzJqdaPfeCny9urc&index=10). Kita akan menggunakan sequalize, untuk bisa menggunakannya kita harus install sequilize dan dialect yang akan kita gunakan (mysql), dengan menggunakan command:

```
npm install sequelize mysql2
```

### Konfigurasi Database

Konfigurasi database bertujuan untuk menghubungkan expressJS dengan mysql, tetapi sebelumnya kita harus membuat database di mysql terlebih dahulu. Setelah itu masuk ke folder `configs` (root/src/configs) buat folder `database` kemudian di dalamnya buat file `database.js`. Di dalam file `database.js` inilah kita akan membuat konfigurasi database [[3]]().

```
let Sequelize = require("sequelize"); //import sequelize

// import nama database, username database, passwort database, dialect, host
let db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

// export database
module.exports = db;
```

### Setting Model

Model berfungsinya untuk mengatur, memanipulasi dan mengorganisir data (dari database) sesuai dengan instruksi dari controller. Gampangnya, model ini tempat buat nampung seluruh fungsi utama yang punya interaksi dengan database [[5]](https://medium.com/chevalier-lab/restful-api-node-js-express-mysql-dengan-model-controller-373003a0887b). Model digunakan untuk mendefine table, seperti nama table, detail kolom, dan tipe data yang nantinya lansung akan dibuat/didaftarkan ke dalam database.

Model dibuat di folder `models` (root/src/configs/models), jadi kita lansung saja masuk ke dalam folder models dan buat file `index.js`. File `index.js` ini digunakan sebagai entry point model, berfungsi untuk menampung semua models dari setiap table yang kita buat [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/configs/models/index.js).

```
const models = {}; //assign models

module.exports = models; //export models
```

Di dalam file `index.js` ini kita assign models berupa object kosong yang nantinya akan isi value berupa model dari table - table yang akan kita buat. Setelah itu kita export object models yang kita assign tadi.

### Setting Controller

Controller berfungsi untuk mengatur apa yang harus dilakukan oleh model. Jadi bisa dibilang pusat control nya itu ada disini [[5]]((https://medium.com/chevalier-lab/restful-api-node-js-express-mysql-dengan-model-controller-373003a0887b)). Controller di folder `controllers` (root/src/controllers), jadi kita lansung saja masuk ke dalam folder controllers dan buat file `index.js`. File `index.js` ini digunakan sebagai entry point controller, berfungsi untuk menampung semua controller dari setiap table yang kita buat [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/controllers/index.js).

```
const controllers = {}; //assign controllers

module.exports = controllers; //export controllers
```

Di dalam file `index.js` ini kita assign controllers berupa object kosong yang nantinya akan diisi value berupa controller dari table - table yang akan kita buat. Setelah itu kita export object controller yang kita assign tadi.

## Reference

- [[1] santrikoding.com](https://santrikoding.com/tutorial-expressjs-restful-api-4-insert-data-ke-database)
- [[2] youtube.com/prawitohudoro](https://www.youtube.com/@prawitohudoro)
- [[3] github.com/argianardi/user-role](https://github.com/argianardi/user-role)
- [[4] Programmer Copy Paste](https://www.youtube.com/@ProgrammerCopyPaste)
- [[5] medium.com/chevalier-lab](https://medium.com/chevalier-lab/restful-api-node-js-express-mysql-dengan-model-controller-373003a0887b)
