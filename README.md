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

Konfigurasi database bertujuan untuk menghubungkan expressJS dengan mysql, tetapi sebelumnya kita harus membuat database di mysql terlebih dahulu. Untuk mengakses mysql bisa dilakukan melalui CLI dengan command `sudo mysql -u root -p`, setelah berhasil membuka mysql jalankan command `create database <nama_database>`. Setelah database berhasil dibuat masuk ke folder `configs` (root/src/configs) buat folder `database` kemudian di dalamnya buat file `database.js`. Di dalam file `database.js` inilah kita akan membuat konfigurasi database [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/configs/database/database.js).

```
const Sequelize = require("sequelize"); //import sequelize

// import nama database, username database, passwort database, dialect, host
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

db.authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error.message);
  });

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

Selanjutnya kita buat model untuk salah satu table di project kita, di contoh ini kita akan membuat table `users`. Untuk melakukannya kita buat di folder `models` (root/src/configs/models) buat file bernama `users.js`. Di dalam file `users.js` inilah kita define nama table, detail column dan tipe data untuk table `users` [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/configs/models/users.js).

```
const Sequelize = require("sequelize"); // import sequelize
const db = require("../database/database"); // import database

// Define method takes two arguments (name of table and columns inside the table)
const users = db.define("users", {
  // Column-1, user_id is an object with properties like type, keys, validation of column.
  user_id: {
    type: Sequelize.INTEGER, // Sequelize module has INTEGER data_type
    autoIncrement: true, // To increment user_id automatically
    allowNull: false, // user_id can not be null
    primaryKey: true, // for uniquely identify user
    unique: true,
  },

  // Column-2, username
  username: { type: Sequelize.STRING(225), allowNull: false, unique: true },

  // Column-3, password
  password: { type: Sequelize.STRING(225), allowNull: false },

  // Timestamps
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

// to execute alter table
db.sync({ alter: true })
  .then(() => {
    console.log("Mahasiswa table created successfully!");
  })
  .catch((error) => {
    console.log("Unable to create table:", error.message);
  });

// export table
module.exports = users;
```

Selanjutnya di dalam entry point model yaitu file `index.js` (root/src/configs/models/index.js) kita import dan assign model table `users` yang kita buat tadi kedalam object `models` [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/configs/models/index.js).

```
const models = {}; //assign models
//-------------------------------------------------------------
const users = require("./users"); //import users

models.users = users; //assign users
//-------------------------------------------------------------

module.exports = models; //export models
```

### Setting Controller

Controller berfungsi untuk mengatur apa yang harus dilakukan oleh model. Jadi bisa dibilang pusat control nya itu ada disini [[5]]((https://medium.com/chevalier-lab/restful-api-node-js-express-mysql-dengan-model-controller-373003a0887b)). Controller di folder `controllers` (root/src/controllers), jadi kita lansung saja masuk ke dalam folder controllers dan buat file `index.js`. File `index.js` ini digunakan sebagai entry point controller, berfungsi untuk menampung semua controller dari setiap table yang kita buat [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/controllers/index.js).

```
const controllers = {}; //assign controllers

module.exports = controllers; //export controllers
```

Di dalam file `index.js` ini kita assign controllers berupa object kosong yang nantinya akan diisi value berupa controller dari table - table yang akan kita buat. Setelah itu kita export object controller yang kita assign tadi.

Selanjutnya kita buat controller untuk salah satu table di project kita. Kita akan membuat controller untuk table `users` untuk membuat post request menggunakan function `create()` dari `sequelize` [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/controllers/users.js).

```
const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers(object of all users controllers)

// post request
controllerUsers.post = async function (req, res) {
  // assign reques body
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelizes
  try {
    let users = await models.users.create({
      username: username,
      password: password,
    });
    res.status(201).json({
      message: "The user added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// export users controllers
module.exports = controllerUsers;
```

Selanjutnya kita import dan assign controllerUsers yang kita buat tadi ke object controllers (merupakan object yang menjadi wadah semua controller di project kita) di file `index.js` yang tersimpan di folder `root/src/controllers` [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/controllers/index.js).

```
const controllers = {}; //assign controllers (object of all controllers)
//-------------------------------------------------------------------------------
const users = require("./users"); //import users controllers
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
controllers.users = users; //assign users controllers to controllers
//-------------------------------------------------------------------------------

module.exports = controllers; //export controllers
```

Selanjutnya buat folder `routes` di `root/src` yang digunakan sebagai wadah untuk menampung semua file route di diproject kita. Di foleder `routes` ini kita buat file bernama `index.js`, yang nantinya kita gunakan untuk menampung semua function routes untuk table users [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/routes/users.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers

// post user
router.post("/", controllers.users.post);

module.exports = router;
```

Selanjutnya kita ke file entry point project kita yaitu file `index.js` yang tersimpan di foleder `root/src`. Di dalam file `index.js` kita import dan define function router users [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/index.js).

```
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
//-------------------------------------------------------------------------
const usersRoutes = require("./routes/users");
//-------------------------------------------------------------------------

//initialize express
const app = express();

// use package
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());

//-------------------------------------------------------------------------
// Routes
app.use("/users", usersRoutes);
//-------------------------------------------------------------------------

// server listening
const PORT = process.env.PORT || 6022;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Terakhir baru kita jalankan project kita, hasilnya konfigurasi database dan table kita berhasil dikonfigurasi. Dan jika kita melakukan post request menggunakan url `http://localhost:2025/users` dan body request:

```
{
    "username": "paijo",
    "password":"paijoaja"
}
```

Akan menghasilkan response status 201 dan body response:

```
{
    "message": "The user added successfully"
}
```

## NOTES

- Saat melakukan configurasi database dan table menggunakan `sequelize`, kita juga harus mengimport routes di file entry point project kita(`index.js`), minimal salah satu route table yang kita buat seperti ini:

```

const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
//---------------------------------------------------------------------------------------
const usersRoutes = require("./routes/users");
//---------------------------------------------------------------------------------------

//initialize express
const app = express();

// use package
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// server listening
const PORT = process.env.PORT || 6022;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

```

Jika tidak maka konfigurasi database dan table tidak akan jalan. Dan posisi import route tersebut juga harus berada di bawah import cofig `.env` seperti code di atas, Jika tidak koneksi ke database akan di-denied seperti ini:

```
Unable to create table: Access denied for user ''@'localhost' (using password: YES)
```

## Reference

- [[1] santrikoding.com](https://santrikoding.com/tutorial-expressjs-restful-api-4-insert-data-ke-database)
- [[2] youtube.com/prawitohudoro](https://www.youtube.com/@prawitohudoro)
- [[3] github.com/argianardi/user-role](https://github.com/argianardi/user-role)
- [[4] Programmer Copy Paste](https://www.youtube.com/@ProgrammerCopyPaste)
- [[5] medium.com/chevalier-lab](https://medium.com/chevalier-lab/restful-api-node-js-express-mysql-dengan-model-controller-373003a0887b)
