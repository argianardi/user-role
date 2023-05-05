## Foldering

```
project/
├─ client/
│  ├─ public/
│  └─ src/
│     ├─ components/
│     ├─ pages/
│     └─ App.js
├─ server/
│  └─ config/
|     ├─ models/
|     └─ database/
│  ├─ controllers/
│  ├─ routes/
│  └─ index.js
├─ package.json
└─ README.md
```

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

- Buat file .gitignore, untuk menyembunyikan folder/file yang tidak perlu untuk dipush seperti node_modules dan .env.
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
  id: {
    type: Sequelize.INTEGER, // Sequelize module has INTEGER data_type
    autoIncrement: true, // To increment user_id automatically
    allowNull: false, // user_id can not be null
    primaryKey: true, // for uniquely identify user
  },

  // Column-2, username
  username: {
    type: Sequelize.STRING(225),
    allowNull: false,
    unique: "username",
  },

  // Column-3, password
  password: { type: Sequelize.STRING(225), allowNull: false },

  // Timestamps
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

// to execute alter table
db.sync({ alter: true })
  .then(() => {
    console.log("Table users created successfully!");
  })
  .catch((error) => {
    console.log("Unable to create table users:", error.message);
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
controllerUsers.post = async (req, res) => {
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

Di dalam function `post` itu terdapat function `create()` yang merupakan function dari `sequelize`, berfungsi untuk melakukan INSERT data ke database. Di dalam function `create()` tersebut membutuhkan argumen berupa object berisi req.body yang akan kita kirim ke server dan selanjutnya disimpan ke database.

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

Selanjutnya buat folder `routes` di `root/src` yang digunakan sebagai wadah untuk menampung semua file route di diproject kita. Di foleder `routes` ini kita buat file bernama `users.js`, yang nantinya kita gunakan untuk menampung semua function routes untuk table users [[3]](https://github.com/argianardi/user-role/blob/SettingORM/src/routes/users.js).

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

## Fitur CRUD (Create, Read, Update, Delete)

Di project kali ini kita akan membuat fitur CRUD untuk table `users` dan table `projects`. Untuk table `users` kita sudah membuat post request sehingga nanti kita tinggal mebuat request get, put dan delete.

### Table Users

#### get All Data request

Untuk membuat get request kita mulai dengan buat controllernya di file `users.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `users.js` ini kita buat function `getAll()` untuk melakukan get all data request[[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/users.js).

```
const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers

// post request
controllerUsers.post = async (req, res) => {
  // assign reques body
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelizes
  try {
    const users = await models.users.create({
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

//--------------------------------------------------------------------------
// get all data request
controllerUsers.getAll = async (req, res) => {
  try {
    const users = await models.users.findAll();
    if (users.length > 0) {
      res.status(200).json({
        message: "all user data is obtained",
        data: users,
      });
    } else {
      res.status(200).json({
        message: "Users not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
//--------------------------------------------------------------------------

// export users controllers
module.exports = controllerUsers;
```

Di dalam function `getAll()` diatas terdapat function `findAll()`, function ini merupakan function dari `sequelize` yang berfungsi untuk mengambil/menampilkan semua data yang ada didalam table yang kita define.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `users.js`, buat function router untuk get request menggunakan function getAll yang kita buat di bagian controllers tadi[[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/users.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers

// post user
router.post("/", controllers.users.post);

//-----------------------------------------------------------------------------------
// get all users
router.get("/", controllers.users.getAll);
//-----------------------------------------------------------------------------------

module.exports = router;
```

sehingga hasilnya jika kita melakukan get request di postman akan tampil respons status 200 dan body response data semua users seperti ini:

```
{
    "message": "all user data is obtained",
    "data": [
        {
            "user_id": 1,
            "username": "jery",
            "password": "jery",
            "createdAt": null,
            "updatedAt": null
        },
        {
            "user_id": 2,
            "username": "yono",
            "password": "yono",
            "createdAt": "2023-01-09T06:17:48.000Z",
            "updatedAt": "2023-01-09T06:17:48.000Z"
        },
        {
            "user_id": 4,
            "username": "yanto",
            "password": "yono",
            "createdAt": "2023-01-09T06:21:58.000Z",
            "updatedAt": "2023-01-09T06:21:58.000Z"
        },
        {
            "user_id": 5,
            "username": "yantio",
            "password": "yono",
            "createdAt": "2023-01-09T07:46:16.000Z",
            "updatedAt": "2023-01-09T07:46:16.000Z"
        }
    ]
}
```

#### get 1 Data user by id

Untuk membuat get request kita mulai dengan buat controllernya di file `users.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `users.js` ini kita buat function `getOneById()` untuk melakukan get request 1 data users berdasarkan id-nya [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/users.js).

```
const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers

// post request
controllerUsers.post = async (req, res) => {
  // assign reques body
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelizes
  try {
    const users = await models.users.create({
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

// get all data request
controllerUsers.getAll = async (req, res) => {
  try {
    const users = await models.users.findAll();
    if (users.length > 0) {
      res.status(200).json({
        message: "all user data is obtained",
        data: users,
      });
    } else {
      res.status(200).json({
        message: "Users not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//---------------------------------------------------------------------
// get one data request by id
controllerUsers.getOneById = async (req, res) => {
  try {
    const user = await models.users.findAll({
      where: { id: req.params.id },
    });

    if (user.length > 0) {
      res.status(200).json({
        message: "The user data is obtained",
        data: user,
      });
    } else {
      res.status(200).json({
        message: "The User not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
//---------------------------------------------------------------------

// export users controllers
module.exports = controllerUsers;

```

Di dalam function `getOneById()` yang kita buat untuk request get 1 data user terdapat function `findAll()` dari `sequelize` sama seperti di request get all data mahasiswa, yang menjadi pembeda di dalam function `findAll()` tersebut terdapat object `where` untuk mengatur bahwa data yang akan kita get hanya 1 data user berdasarkan idnya, yang mana idnya ini kita gunakan sebagai req.params.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `users.js`, buat function router untuk get request menggunakan function `getOneById()` yang kita buat di bagian controllers tadi [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/users.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers

// post user
router.post("/", controllers.users.post);

// get all users
router.get("/", controllers.users.getAll);

//---------------------------------------------------------------
// get one user by id
router.get("/:id", controllers.users.getOneById);
//---------------------------------------------------------------

module.exports = router;
```

Sehingga hasilnya jika kita melakukan get request di postman menggunakan url `http://localhost:2025/users/2` akan tampil respons status 200 dan body response data semua 1 user yang idnya 2 seperti ini:

```
{
    "message": "The user data is obtained",
    "data": [
        {
            "user_id": 2,
            "username": "yono",
            "password": "yono",
            "createdAt": "2023-01-09T06:17:48.000Z",
            "updatedAt": "2023-01-09T06:17:48.000Z"
        }
    ]
}
```

#### Put request

Untuk membuat get request kita mulai dengan buat controllernya di file `users.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `users.js` ini kita buat function `put()` untuk melakukan edit/update data 1 data users berdasarkan id-nya [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/users.js).

```
const controllers = require(".");
const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers

// post request
controllerUsers.post = async (req, res) => {
  // assign reques body
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelizes
  try {
    const users = await models.users.create({
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

// get all data request
controllerUsers.getAll = async (req, res) => {
  try {
    const users = await models.users.findAll();
    if (users.length > 0) {
      res.status(200).json({
        message: "all user data is obtained",
        data: users,
      });
    } else {
      res.status(200).json({
        message: "Users not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get one data request by id
controllerUsers.getOneById = async (req, res) => {
  try {
    const user = await models.users.findAll({
      where: { id: req.params.id },
    });

    if (user.length > 0) {
      res.status(200).json({
        message: "The user data is obtained",
        data: user,
      });
    } else {
      res.status(200).json({
        message: "The User not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//----------------------------------------------------------------
// Put request
controllerUsers.put = async (req, res) => {
  // body request
  const { username, password } = req.body;

  // check the body req if null return status 400 and a message
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are request",
    });
  }

  try {
    const user = await models.users.update(
      {
        username: username,
        password: password,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "User data successfully updated",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
//----------------------------------------------------------------

// export users controllers
module.exports = controllerUsers;
```

Di function `put()` di atas terdapat function `update()` milik `sequelize` digunakan untuk mengupdate data dalam database. Di dalam function `update()` tersebut membutuhkan argument berupa req.body yang nantinya akan dikirim ke server untuk merubah data di dalam database dan juga `where` yang berisi req.params untuk dijadikan reference data yang akan diupdate.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `users.js`, buat function router untuk put request menggunakan function `put()` yang kita buat di bagian controllers tadi [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/users.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers

// post user
router.post("/", controllers.users.post);

// get all users
router.get("/", controllers.users.getAll);

// get one user by id
router.get("/:id", controllers.users.getOneById);

//------------------------------------------------------------
// put user by id
router.get("/:id", controllers.users.put);
//------------------------------------------------------------

module.exports = router;
```

Selanjutnya jika kita ingin mengupdate data user yang idnya 10, kita bisa melakukan put di postman menggunakan url `http:// localhost:2025/users/10` dan body request:

```
{
    "username": "sarinah2",
    "password":"sarinahupdate"
}
```

Hasilnya akan tampil response status 200 dan body response:

```
{
    "message": "User data successfully updated"
}
```

#### Delete

Untuk membuat delete request kita mulai dengan membuat controllernya di file `users.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `users.js` ini kita buat function `delete()` untuk menghapus data 1 users berdasarkan id-nya [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/users.js).

```
const controllers = require(".");
const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers

// post request
controllerUsers.post = async (req, res) => {
  // assign reques body
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelizes
  try {
    const users = await models.users.create({
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

// get all data request
controllerUsers.getAll = async (req, res) => {
  try {
    const users = await models.users.findAll();
    if (users.length > 0) {
      res.status(200).json({
        message: "all user data is obtained",
        data: users,
      });
    } else {
      res.status(200).json({
        message: "Users not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get one data request by id
controllerUsers.getOneById = async (req, res) => {
  try {
    const user = await models.users.findAll({
      where: { id: req.params.id },
    });

    if (user.length > 0) {
      res.status(200).json({
        message: "The user data is obtained",
        data: user,
      });
    } else {
      res.status(200).json({
        message: "The User not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Put request
controllerUsers.put = async (req, res) => {
  // body request
  const { username, password } = req.body;

  // check the body req if null return status 400 and a message
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are request",
    });
  }

  try {
    const user = await models.users.update(
      {
        username: username,
        password: password,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "User data successfully updated",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//-----------------------------------------------------------------
// Delete request
controllerUsers.delete = async (req, res) => {
  try {
    const user = await models.users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "User data has been successfully deleted",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
//-----------------------------------------------------------------

// export users controllers
module.exports = controllerUsers;
```

Di dalam function `delete()` itu terdapat function `destroy()` yang merupakan function dari `sequelize`, untuk menghapus data di dalam database. Function `destroy()` ini membuatuhkan argument berupa `where` yang berisi req.params (di contoh ini kita set user_id) untuk dijadikan sebagai reference data yang akan dihapus.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `users.js`, buat function router untuk delete request menggunakan function `delete()` yang kita buat di bagian controllers tadi [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/users.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import controllers

// post user
router.post("/", controllers.users.post);

// get all users
router.get("/", controllers.users.getAll);

// get one user by id
router.get("/:id", controllers.users.getOneById);

// put user by id
router.put("/:id", controllers.users.put);

//---------------------------------------------------------
// delete user by id
router.delete("/:id", controllers.users.delete);
//---------------------------------------------------------

module.exports = router;
```

Sehingga jika kita ingin menghapus data user yang idnya 10 kita bisa melakukan delete request di postman menggunakan url `http://localhost:2025/users/10`. Hasilnya akan tampil response 200 dan body response:

```
{
    "message": "User data has been successfully deleted"
}
```

### Table Projects

Sebelum membuat fitur CRUD untuk table `projects` kita harus membuat configurasinya terlebih dahulu.

#### Konfigurasi Table Projects

Untuk mebuat table `projects` sama seperti table `users`, kita harus melakukan konfigurasi table di bagian model yaitu di folder `models` (root/src/configs/models). Jadi di folder `models`ini kita harus menyiapkan file baru dengan nama `projects.js` dan buat script untuk mengkonfigurasi table `projects` ini [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/configs/models/projects.js).

```
const Sequelize = require("sequelize");
const db = require("../database/database");

const projects = db.define("projects", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  user_id: { type: Sequelize.STRING },
  createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

db.sync({ alter: true })
  .then(() => {
    console.log("Projects table create successfully");
  })
  .catch((error) => {
    console.log("Unable to create table:", error.message);
  });

module.exports = projects;
```

Selanjutnya di dalam entry point model yaitu file index.js (root/src/configs/models/index.js) kita import dan assign model table `projects` yang kita buat tadi kedalam object [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/configs/models/index.js).

```
const models = {}; //assign models
const users = require("./users"); //import users
//---------------------------------------------------------
const projects = require("./projects"); //import projects
//---------------------------------------------------------

models.users = users; //assign users
//---------------------------------------------------------
models.projects = projects; //assign projects
//---------------------------------------------------------

module.exports = models; //export models
```

Setelah konfigurasi tadi selesai kita buat makan kita jalankan applikasi kita. Maka akan terlihat bahwa kita berhasil membuat table `projects` di database.

#### Controller dan Router Table Projects

Untuk membuat controller kita buka bagian controller yaitu di folder `controllers` (root/src/controllers), di dalam folder ini kita buat file `projects.js` untuk menampung semua script table `projects`.

##### Post Request

Untuk membuat post request kita mulai dengan membuat controllernya di file `projects.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `projects.js` ini kita buat function `post()` [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/projects.js).

```
const models = require("../configs/models/index"); //import model
const controllerProjects = {}; //assign projects controllers (objec of all projects controllers)

// post request
controllerProjects.post = async (req, res) => {
  // assign request body
  const { title, description } = req.body;

  // check if req.body is null return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelize
  try {
    const project = await models.projects.create({
      title: title,
      description: description,
    });
    res.status(201).json({
      message: "The project added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = controllerProjects;
```

Di dalam function `post()` itu terdapat function `create()` yang merupakan function dari `sequelize`, berfungsi untuk melakukan INSERT data ke database. Di dalam function `create()` tersebut membutuhkan argumen berupa object berisi req.body yang akan kita kirim ke server dan selanjutnya disimpan ke database.

Selanjutnya kita import dan assign controllerUsers yang kita buat tadi ke object controllers (merupakan object yang menjadi wadah semua controller di project kita) di file `index.js` yang tersimpan di folder `controllers` (root/src/controllers) [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/index.js).

```
const controllers = {}; //assign controllers (object of all controllers)
const users = require("./users"); //import users controllers
//--------------------------------------------------------------------------------------
const projects = require("./projects"); //import projects controllers
//--------------------------------------------------------------------------------------

controllers.users = users; //assign users controllers to controllers
//--------------------------------------------------------------------------------------
controllers.projects = projects; //assign projects controllers to controllers
//--------------------------------------------------------------------------------------

module.exports = controllers; //export controllers
```

Selanjutnya ke folder `routes` di (root/src/routes),buat file bernama `projects.js`, yang nantinya kita gunakan untuk menampung semua function routes untuk table projects. Di dalam file `project.js` ini kita buat function router post request menggunakan function `post()` yang kita buat dibagian controllers tadi [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/projects.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers

// post request
router.post("/", controllers.projects.post);

module.exports = router;
```

Selanjutnya kita ke file entry point aplikasi kita yaitu file `index.js` yang tersimpan di folder `root/src`, import dan define function router projects [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/index.js).

```
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const usersRoutes = require("./routes/users");
//------------------------------------------------------------------------------
const projectsRoutes = require("./routes/projects");
//------------------------------------------------------------------------------

//initialize express
const app = express();

// use package
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use("/users", usersRoutes);
//------------------------------------------------------------------------------
app.use("/projects", projectsRoutes);
//------------------------------------------------------------------------------

// server listening
const PORT = process.env.PORT || 6022;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Terakhir baru kita jalankan project kita, hasilnya konfigurasi database dan table kita berhasil dikonfigurasi. Dan jika kita melakukan post request menggunakan url `http://localhost:2025/projects` dan body request:

```
{
    "title":"project paijo",
    "description": "project punya nya paijo"
}
```

Akan menghasilkan response status 201 dan body response:

```
{
    message: "The project added successfully",
}
```

#### get All Data request

Untuk membuat get request kita mulai dengan buat controllernya di file `projects.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `users.js` ini kita buat function `getAll()` untuk melakukan get all data request[[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/projects.js).

```
const models = require("../configs/models/index"); //import model
const controllerProjects = {}; //assign projects controllers (objec of all projects controllers)

// post request
controllerProjects.post = async (req, res) => {
  // assign request body
  const { title, description } = req.body;

  // check if req.body is null return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelize
  try {
    const project = await models.projects.create({
      title: title,
      description: description,
    });
    res.status(201).json({
      message: "The project added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//------------------------------------------------------------------------
// get all data
controllerProjects.getAll = async (req, res) => {
  try {
    const projects = await models.projects.findAll();
    if (projects.length > 0) {
      res.status(200).json({
        message: "All projects data are obtained",
        data: projects,
      });
    } else {
      res.status(200).json({
        message: "Projects not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
//------------------------------------------------------------------------

module.exports = controllerProjects;
```

Di dalam function `getAll()` diatas terdapat function `findAll()`, function ini merupakan function dari `sequelize` yang berfungsi untuk mengambil/menampilkan semua data yang ada didalam table yang kita define.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `projects.js`, buat function router untuk get request menggunakan function getAll yang kita buat di bagian controllers tadi[[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/projects.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers

// post request
router.post("/", controllers.projects.post);

//------------------------------------------------------------------------
// get request all data
router.get("/", controllers.projects.getAll);
//------------------------------------------------------------------------

module.exports = router;
```

sehingga hasilnya jika kita melakukan get request di postman misalnya menggunakan url `http://localhost:2025/projects` akan tampil respons status 200 dan body response data semua users seperti ini:

```
{
    "message": "All projects data are obtained",
    "data": [
        {
            "id": 1,
            "title": "project paijo",
            "description": "project punya nya paijo",
            "createdAt": "2023-01-10T14:13:49.000Z",
            "updatedAt": "2023-01-10T14:13:49.000Z"
        },
        {
            "id": 2,
            "title": "project sukijan",
            "description": "project punya nya sukijan",
            "createdAt": "2023-01-10T17:44:43.000Z",
            "updatedAt": "2023-01-10T17:44:43.000Z"
        }
    ]
}
```

#### get 1 Data project by id

Untuk membuat get request kita mulai dengan buat controllernya di file `projects.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `users.js` ini kita buat function `getOneById()` untuk melakukan get request 1 data projects berdasarkan id-nya [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/projects.js).

```
const models = require("../configs/models/index"); //import model
const controllerProjects = {}; //assign projects controllers (objec of all projects controllers)

// post request
controllerProjects.post = async (req, res) => {
  // assign request body
  const { title, description } = req.body;

  // check if req.body is null return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelize
  try {
    const project = await models.projects.create({
      title: title,
      description: description,
    });
    res.status(201).json({
      message: "The project added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get all data
controllerProjects.getAll = async (req, res) => {
  try {
    const projects = await models.projects.findAll();
    if (projects.length > 0) {
      res.status(200).json({
        message: "All projects data are obtained",
        data: projects,
      });
    } else {
      res.status(200).json({
        message: "Projects not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//-----------------------------------------------------------------------
// get request one data by id
controllerProjects.getOneById = async (req, res) => {
  try {
    const project = await models.projects.findAll({
      where: { id: req.params.id },
    });

    if (project.length > 0) {
      res.status(200).json({
        message: "The project data is obtained",
        data: project,
      });
    } else {
      res.status(200).json({
        message: "The project not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
//-----------------------------------------------------------------------

module.exports = controllerProjects;
```

Di dalam function `getOneById()` yang kita buat untuk request get 1 data project terdapat function `findAll()` dari `sequelize` sama seperti di request get all data projects, yang menjadi pembeda di dalam function `findAll()` tersebut terdapat object `where` untuk mengatur bahwa data yang akan kita get hanya 1 data berdasarkan idnya, yang mana data idnya ini kita gunakan sebagai req.params.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `project.js`, buat function router untuk get request menggunakan function `getOneById()` yang kita buat di bagian controllers tadi [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/projects.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers

// post request
router.post("/", controllers.projects.post);

// get request all data
router.get("/", controllers.projects.getAll);

//------------------------------------------------------------------------
// get request one data by id
router.get("/:id", controllers.projects.getOneById);
//------------------------------------------------------------------------

module.exports = router;
```

Sehingga hasilnya jika kita melakukan get request di postman menggunakan url `http://localhost:2025/projects/1` akan tampil respons status 200 dan body response data 1 projects yang idnya 1 seperti ini:

```
{
    "message": "The project data is obtained",
    "data": [
        {
            "id": 1,
            "title": "project paijo",
            "description": "project punya nya paijo",
            "createdAt": "2023-01-10T14:13:49.000Z",
            "updatedAt": "2023-01-10T14:13:49.000Z"
        }
    ]
}
```

#### Put request

Untuk membuat get request kita mulai dengan buat controllernya di file `projects.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `project.js` ini kita buat function `put()` untuk melakukan edit/update 1 data projects berdasarkan id-nya [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/projects.js).

```
const models = require("../configs/models/index"); //import model
const controllerProjects = {}; //assign projects controllers (objec of all projects controllers)

// post request
controllerProjects.post = async (req, res) => {
  // assign request body
  const { title, description } = req.body;

  // check if req.body is null return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelize
  try {
    const project = await models.projects.create({
      title: title,
      description: description,
    });
    res.status(201).json({
      message: "The project added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get all data
controllerProjects.getAll = async (req, res) => {
  try {
    const projects = await models.projects.findAll();
    if (projects.length > 0) {
      res.status(200).json({
        message: "All projects data are obtained",
        data: projects,
      });
    } else {
      res.status(200).json({
        message: "Projects not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get request one data by id
controllerProjects.getOneById = async (req, res) => {
  try {
    const project = await models.projects.findAll({
      where: { id: req.params.id },
    });

    if (project.length > 0) {
      res.status(200).json({
        message: "The project data is obtained",
        data: project,
      });
    } else {
      res.status(200).json({
        message: "The project not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//----------------------------------------------------------------------------------------
// put request
controllerProjects.put = async (req, res) => {
  //body request
  const { title, description } = req.body;

  // check the body req if nill return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are request",
    });
  }

  try {
    const project = await models.projects.update(
      {
        title: title,
        description: description,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "The project data successfully updated",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
//----------------------------------------------------------------------------------------

module.exports = controllerProjects;
```

Di function `put()` di atas terdapat function `update()` milik `sequelize` digunakan untuk mengupdate data dalam database. Di dalam function `update()` tersebut membutuhkan argument berupa req.body yang nantinya akan dikirim ke server untuk merubah data di dalam database dan juga `where` yang berisi req.params untuk dijadikan reference data yang akan diupdate.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `projects.js`, buat function router untuk put request menggunakan function `put()` yang kita buat di bagian controllers tadi [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/projects.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers

// post request
router.post("/", controllers.projects.post);

// get request all data
router.get("/", controllers.projects.getAll);

// get request one data by id
router.get("/:id", controllers.projects.getOneById);

//-------------------------------------------------------------------------------------
//  put request
router.put("/:id", controllers.projects.put);
//-------------------------------------------------------------------------------------

module.exports = router;
```

Selanjutnya jika kita ingin mengupdate data project yang idnya 2, kita bisa melakukan put di postman menggunakan url `http:// localhost:2025/users/2` dan body request:

```
{
    "title":"project sukijan edit",
    "description": "project punya nya sukijan edit"
}
```

Hasilnya akan tampil response status 200 dan body response:

```
{
    "message": "The project data successfully updated"
}
```

#### Delete

Untuk membuat delete request kita mulai dengan membuat controllernya di file `projects.js` yang tersimpan di folder `controllers` (root/src/controllers), di file `projects.js` ini kita buat function `delete()` untuk menghapus data 1 projects berdasarkan id-nya [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/controllers/projects.js).

```
const models = require("../configs/models/index"); //import model
const controllerProjects = {}; //assign projects controllers (objec of all projects controllers)

// post request
controllerProjects.post = async (req, res) => {
  // assign request body
  const { title, description } = req.body;

  // check if req.body is null return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelize
  try {
    const project = await models.projects.create({
      title: title,
      description: description,
    });
    res.status(201).json({
      message: "The project added successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get all data
controllerProjects.getAll = async (req, res) => {
  try {
    const projects = await models.projects.findAll();
    if (projects.length > 0) {
      res.status(200).json({
        message: "All projects data are obtained",
        data: projects,
      });
    } else {
      res.status(200).json({
        message: "Projects not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get request one data by id
controllerProjects.getOneById = async (req, res) => {
  try {
    const project = await models.projects.findAll({
      where: { id: req.params.id },
    });

    if (project.length > 0) {
      res.status(200).json({
        message: "The project data is obtained",
        data: project,
      });
    } else {
      res.status(200).json({
        message: "The project not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// put request
controllerProjects.put = async (req, res) => {
  //body request
  const { title, description } = req.body;

  // check the body req if nill return status 400 and a message
  if (!(title && description)) {
    return res.status(400).json({
      message: "Some input are request",
    });
  }

  try {
    const project = await models.projects.update(
      {
        title: title,
        description: description,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "The project data successfully updated",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//-------------------------------------------------------------------------------
//delete request
controllerProjects.delete = async (req, res) => {
  try {
    const project = await models.projects.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "The project data deleted successfully",
    });
  } catch (error) {
    res.status(200).json({
      message: error.message,
    });
  }
};
//-------------------------------------------------------------------------------

module.exports = controllerProjects;
```

Di dalam function `delete()` itu terdapat function `destroy()` yang merupakan function dari `sequelize`, untuk menghapus data di dalam database. Function `destroy()` ini membuatuhkan argument berupa `where` yang berisi req.params (di contoh ini kita set id project) untuk dijadikan sebagai reference data yang akan dihapus.

Selanjut kita masuk ke folder `routes` (root/src/routes) tepatnya di file `projects.js`, buat function router untuk delete request menggunakan function `delete()` yang kita buat di bagian controllers tadi [[3]](https://github.com/argianardi/user-role/blob/crud-features/src/routes/projects.js).

```
const express = require("express"); //import express
const router = express.Router(); //include express router
const controllers = require("../controllers/index"); //import projects controllers

// post request
router.post("/", controllers.projects.post);

// get request all data
router.get("/", controllers.projects.getAll);

// get request one data by id
router.get("/:id", controllers.projects.getOneById);

//  put request
router.put("/:id", controllers.projects.put);

//-------------------------------------------------------------------
// delete request
router.delete("/:id", controllers.projects.delete);
//-------------------------------------------------------------------

module.exports = router;
```

Sehingga jika kita ingin menghapus data project yang idnya 2 kita bisa melakukan delete request di postman menggunakan url `http://localhost:2025/projects/2`. Hasilnya akan tampil response 200 dan body response:

```
{
    "message": "The project data deleted successfully"
}
```

## Associate / Relasi table

### Relasi Table One to Many

Di contoh ini misalnya kita akan membuat relasi one to many untuk table user dan project dimana satu user bisa punya banyak project. Untuk membuat relasi ini kita buat scriptnya dibagian controllers table `users` di file bernama `users.js` yang terletak di folder `controllers` (root/src/controllers) dibagian get all users request dan get one user by id request [[3]](https://github.com/argianardi/user-role/blob/associate-datababase/src/controllers/users.js):

```
const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers

// post request
controllerUsers.post = async (req, res) => {
  // assign reques body
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

  // post request use sequelizes
  try {
    const users = await models.users.create({
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

// get all data request
controllerUsers.getAll = async (req, res) => {
  //------------------------------------------------------------------------------------------------
  await models.users.hasMany(models.projects, {
    sourceKey: "id", //id belong to users table
    foreignKey: { name: "user_id", allowNull: true }, //user_id belong to projects table
  });
  //------------------------------------------------------------------------------------------------
  try {
    const users = await models.users.findAll({
  //------------------------------------------------------------------------------------------------
      include: [{ model: models.projects }],
  //------------------------------------------------------------------------------------------------
    });
    if (users.length > 0) {
      res.status(200).json({
        message: "all user data is obtained",
        data: users,
      });
    } else {
      res.status(200).json({
        message: "Users not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get one data request by id
controllerUsers.getOneById = async (req, res) => {
  //------------------------------------------------------------------------------------------------
  await models.users.hasMany(models.projects, {
    sourceKey: "id", //id belong to users table
    foreignKey: { name: "user_id", allowNull: true }, //user_id belong to projects table
  });
  //------------------------------------------------------------------------------------------------
  try {
    const user = await models.users.findAll({
  //------------------------------------------------------------------------------------------------
      include: [{ model: models.projects }],
  //------------------------------------------------------------------------------------------------
      where: { id: req.params.id },
    });

    if (user.length > 0) {
      res.status(200).json({
        message: "The user data is obtained",
        data: user,
      });
    } else {
      res.status(200).json({
        message: "The User not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Put request
controllerUsers.put = async (req, res) => {
  // body request
  const { username, password } = req.body;

  // check the body req if null return status 400 and a message
  if (!(username && password)) {
    return res.status(400).json({
      message: "Some input are request",
    });
  }

  try {
    const user = await models.users.update(
      {
        username: username,
        password: password,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "User data successfully updated",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Delete request
controllerUsers.delete = async (req, res) => {
  try {
    const user = await models.users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "User data has been successfully deleted",
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

Hasilnya saat kita melakukan get request all users dengan url `http://localhost:2025/users`, kita akan mendapatkan response status 200 dan body request:

```
{
    "message": "all user data is obtained",
    "data": [
        {
            "id": 2,
            "username": "sarinah",
            "password": "sarinahaja",
            "createdAt": "2023-01-11T08:31:59.000Z",
            "updatedAt": "2023-01-11T08:31:59.000Z",
            "projects": [
                {
                    "id": 5,
                    "title": "project 4 sarinah",
                    "description": "project keempat punya nya sarinah",
                    "user_id": "2",
                    "createdAt": "2023-01-11T12:39:26.000Z",
                    "updatedAt": "2023-01-11T12:39:26.000Z"
                },
                {
                    "id": 3,
                    "title": "project 2 sarinah",
                    "description": "project kedua punya nya sarinah",
                    "user_id": "2",
                    "createdAt": "2023-01-11T12:38:09.000Z",
                    "updatedAt": "2023-01-11T12:38:09.000Z"
                }
            ]
        }
    ]
}
```

Terlihat dibagian object data terdapat key project yang berisi data lebih dari satu projects, artinya kita telah berhasil melakukan associate relasi one to manyo untuk table users ke table projects. Dan saat kita melakukan get one user by id hasilnya juga akan sama.

## Authentication Dan Authorization

### Pengertian Authentication dan Authorization

Istilah authentication dan authorization biasa digunakan pada security, terutama pada saat mendapatkan izin untuk mengakes suatu sistem. Walaupun terdengar mirip, kedua istilah tersebut berbeda antara satu dan yang lainnya. Authentication berarti mengkomfirmasi identitas sedangkan authorization berarti memberikan akses ke sistem [[6]](https://medium.com/@nandazmann/authentication-dan-authorization-5ef8eb06d1c2).

Autentikasi adalah proses verikfikasi bahwa data user sudah tergabung/terdaftar dalam database/sistem atau tidak. Jadi sistem akan melakukan pengecekan data user (misalnya username, password ataupun email) apakah ada di dalam data base atau tidak. Contohnya saat memasuki ATM setelah memasukan kartu ATM, mesin akan meminta pin dan apabila benar maka bank akan mengkonfirmasi identitas pemilik kartu. Dengan memvalidasi pin kartu ATM, bank sebenernya mengverifikasi identitas pemilik kartu yang disebut authentication [[6]](https://medium.com/@nandazmann/authentication-dan-authorization-5ef8eb06d1c2).

Authorization adalah proses untuk menentukan apakah user yang sudah authenticated mempunyai akses ke bagian tertentu [[6]](https://medium.com/@nandazmann/authentication-dan-authorization-5ef8eb06d1c2). Hal ini mengverifikasi hak kita untuk mengakses sumber seperti informasi, database, files dan lain lain. Contohnya misalnya di dalam sebuah rumah, jika kita sebagai tuan rumah makan kita bisa masuk ke seluruh ruangan di dalam rumah tersebut, tetapi jika kita hanya sebagai tamu maka kita hanya bisa masuk sampai ke ruang tamu saja.

### Mengamankan Password menggunakan Bcrypt

Bycript Digunakan untuk mengamankan password di mana password yang diinputkan user akan diubah menjadi hash yatu combinasi character yang dirandom, contohnya seperti ini:

```
$2a$10$b9ZLeHb8O7TxLm94v0HRM.Gy1aPSGXydwf/etBm6Ix9GF4HH5Lubm
```

Tujuan dari penggunaan bcrypt ini agar password yang diinputkan user ini agar bisa lebih aman. Untuk bisa menggunakannya kita harus menginstallnya terlebih dahulu, dengan command:

```
npm i bcrypt
```

Untuk mengaplikaskan bcrypt ini dapat kita lakukan di bagian controller di folder `controllers` (root/src/controllers) tepatnya untuk post dan put request. Di contoh ini kita akan menerapkan bcrypt untuk mengenkripsi password dari user di file `users.js` yang tersiman di folder src/controllers/user.js [[3]](https://github.com/argianardi/user-role/blob/auth/src/controllers/users.js):

```
const models = require("../configs/models/index"); //import model
const controllerUsers = {}; //assign users controllers
//-------------------------------------------------------------------------------------
const bcrypt = require("bcrypt");
//-------------------------------------------------------------------------------------

// post request
controllerUsers.post = async (req, res) => {
  // assign reques body
  const { username, password, email, role } = req.body;
  if (!(username && password && email && role)) {
    return res.status(400).json({
      message: "Some input are required",
    });
  }

//-------------------------------------------------------------------------------------
  // bcrypt
  const salt = await bcrypt.genSaltSync(10);
  const passwordHashed = bcrypt.hashSync(password, salt);
//-------------------------------------------------------------------------------------

  // post request use sequelizes
  try {
    const users = await models.users.create({
      username,
      password: passwordHashed,
      email,
      role,
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

// get all data request
controllerUsers.getAll = async (req, res) => {
  await models.users.hasMany(models.projects, {
    sourceKey: "id", //id belong to users table
    foreignKey: { name: "user_id", allowNull: true }, //user_id belong to projects table
  });
  try {
    const users = await models.users.findAll({
      include: [{ model: models.projects }],
    });
    if (users.length > 0) {
      res.status(200).json({
        message: "all user data is obtained",
        data: users,
      });
    } else {
      res.status(200).json({
        message: "Users not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// get one data request by id
controllerUsers.getOneById = async (req, res) => {
  await models.users.hasMany(models.projects, {
    sourceKey: "id", //id belong to users table
    foreignKey: { name: "user_id", allowNull: true }, //user_id belong to projects table
  });
  try {
    const user = await models.users.findAll({
      include: [{ model: models.projects }],
      where: { id: req.params.id },
    });

    if (user.length > 0) {
      res.status(200).json({
        message: "The user data is obtained",
        data: user,
      });
    } else {
      res.status(200).json({
        message: "The User not found",
        data: [],
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Put request
controllerUsers.put = async (req, res) => {
  // body request
  const { username, password, email } = req.body;

  // check the body req if null return status 400 and a message
  if (!(username && password && email)) {
    return res.status(400).json({
      message: "Some input are request",
    });
  }

  //-------------------------------------------------------------------------------------
  // bcrypt
  const salt = await bcrypt.genSaltSync(10);
  const passwordHashed = bcrypt.hashSync(password, salt);
  //-------------------------------------------------------------------------------------

  try {
    const user = await models.users.update(
      {
        username,
        password: passwordHashed,
        email,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      message: "User data successfully updated",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Delete request
controllerUsers.delete = async (req, res) => {
  try {
    const user = await models.users.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({
      message: "User data has been successfully deleted",
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

Di code diatasi kita melakukan:

- import bcrypt
- Membuat salt dengan command:

  ```
  const salt = await bcrypt.genSaltSync(10);
  ```

- Mengubah value password menjadi salt menggunakan command:

  ```
  const passwordHashed = bcrypt.hashSync(password, salt);
  ```

Dalam kriptografi, salt yang terdiri bit acak yang digunakan sebagai salah satu masukan untuk kunci fungsi turunan. Masukan lain biasanya password. Keluaran dari fungsi kunci turunannya disimpan sebagai password versi dienkripsi. Sebuah salt juga dapat digunakan sebagai bagian dari kunci dalam memecahkan algoritme kriptografi atau lainnya.

Hasilnya jika kita lihat menggunakan get request value password user akan berubah menjadi hash seperti ini:

```
{
    "message": "all user data is obtained",
    "data": [
        {
            "id": 4,
            "username": "sarinah edit",
            "email": "sarinah@mail.com",
            "password": "$2b$10$3aDlOn9pBoXtmN4ii1owkOwAU.wsTViilRzJ1KhPsX5ImatnPJhCq",
            "role": "admin",
            "createdAt": "2023-01-15T18:37:33.000Z",
            "updatedAt": "2023-01-15T18:43:09.000Z",
            "projects": []
        },
        {
            "id": 5,
            "username": "rukijan",
            "email": "sarinah@mail.com",
            "password": "$2b$10$ceD8cTaV.pTnCxGn/wyyP.RMGYSdJM7LzSwxXujFbJh5HMPrFPXtu",
            "role": "admin",
            "createdAt": "2023-01-15T18:43:34.000Z",
            "updatedAt": "2023-01-15T18:43:34.000Z",
            "projects": []
        }
    ]
}
```

### JWT Auth

- Untuk membuat authentication dan authorization kita akan menggunakan JWT(json web token). JWT (JSON Web Token) adalah sebuah tool yang berfungsi untuk memberikan token, yiatu kode-kode enkripsi unik ketika data dimasukkan atau dibutuhkan.Untuk bisa menggunakannya kita harus menginstallnya terlebih dahulu, dengan command:

  ```
  npm i jsonwebtoken
  ```

- Selanjutnya buat variabale misalnya kita namai `JWT_SECRET_KEY` di dalam file .`env` dengan value apapun. Untuk membuat value secret tersebut kita bisa memanfaatkan webiste [keygen.io](https://keygen.io/) untuk mendapatkan kombinasi karakter random.

  ```
  PORT=2025
  DB_HOST=localhost
  DB_USERNAME=root
  DB_PASSWORD=zero
  DB_NAME=table_relation
  JWT_SECRET_KEY=b117faeadf2046d864963aa99d2ca664d1622f7ea149b208bb7102d40146788ca30b162bc18aef1176f6eadf4d309244351d6fe3b0c495c70f5a303171cead20
  ```

  Kemudian kita ke file entry point project kita yaitu `index.js`(root/src/index.js), kita buat function router untuk login dan register [[3]]().

  ```
  const express = require("express");
  const bodyParser = require("body-parser");
  const compression = require("compression");
  const helmet = require("helmet");
  const cors = require("cors");
  require("dotenv").config();
  const usersRoutes = require("./routes/users");
  const projectsRoutes = require("./routes/projects");
  const authRoutes = require("./routes/auth");

  //initialize express
  const app = express();

  // use package
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(helmet());
  app.use(compression());

  // Routes
  app.use("/users", usersRoutes);
  app.use("/projects", projectsRoutes);
  //-----------------------------------------------------
  app.use("/", authRoutes);
  //-----------------------------------------------------

  // server listening
  const PORT = process.env.PORT || 6022;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  ```

- Selanjutnya buat controller untuk auth di bagian controllers yaitu di folder `controllers` (root/src/controllers) dalam file baru benama `auth.js` [[3]]().

  ```
  const models = require("../configs/models/index"); //import model
  const controllersAuth = {}; //assign users controllers
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");

  controllersAuth.login = async (req, res) => {
    // assign reques body
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        message: "Some input are required",
      });
    }

    try {
      const user = await models.users.findAll({
        where: { email },
      });
      if (user.length > 0) {
        const comparePassword = bcrypt.compareSync(password, user[0].password);
        if (comparePassword) {
          const secret = process.env.JWT_SECRET_KEY || "secret";
          const token = jwt.sign({ id: user[0].id, role: user[0].role }, secret, {
            expiresIn: "2h",
          });

          if (token) {
            res.status(200).json({
              success: true,
              message: "Login success",
              data: {
                token: token,
                username: user[0].username,
                email: user[0].email,
                role: user[0].role,
              },
            });
          }
        } else {
          res.status(404).json({
            success: false,
            message: "Password doesn't match",
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "The User not registered!!",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "500 internet server error",
      });
    }
  };

  controllersAuth.register = async (req, res) => {
    const { username, password, email, role } = req.body;
    if (!(username && password && email && role)) {
      return res.status(400).json({
        message: "Some input are required",
      });
    }

    const users = await models.users.findAll({
      where: { email },
    });
    console.log(users);
    if (users.length > 0) {
      return res
        .status(201)
        .json({ message: "The email is already registered!!" });
    } else {
      // bcrypt
      const salt = bcrypt.genSaltSync(10);
      const passwordHashed = await bcrypt.hashSync(password, salt);

      // post request use sequelizes
      try {
        const users = await models.users.create({
          username,
          password: passwordHashed,
          email,
          role,
        });
        res.status(201).json({
          message: "The user added successfully",
        });
      } catch (error) {
        res.status(404).json({
          message: error.message,
        });
      }
    }
  };

  module.exports = controllersAuth;
  ```

- Selanjutnya buat router untuk auth (login dan register) di bagian router yaitu di folder `routers` (root/src/routes) dalam file baru benama `auth.js` [[3]]().

  ```
  const express = require("express");
  const router = express.Router();
  const controllers = require("../controllers/index");

  router.post("/login", controllers.auth.login);
  router.post("/register", controllers.auth.register);

  module.exports = router;
  ```

- Selanjutnya kita buat middleware untuk auth dengan file bernama validateAuth.js di folder `middlewares` (root/src/middlewares) dan function untuk authorization caranya sama seperti funciton authenticate, bedanya di dalamnya kita logic untuk mengatur hak aksess pada setiap role

  ```
  const jwt = require("jsonwebtoken");

  //Authenticate
  const validateAuth = {
    isAuthenticated(req, res, next) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (verifiedToken) {
          next();
        }
      } catch (errror) {
        res.status(401).json({
          message: "Access token invalid",
        });
      }
    },

  //authorization
    isAdmin(req, res, next) {
      const token = req.headers.authorization.split(" ")[1];
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const role = verifiedToken.role;
      if (role === "admin") {
        next();
      } else {
        res.status(401).json({
          message: "Access denied!",
        });
      }
    },
  };

  module.exports = validateAuth;
  ```

- Tambahkan middlewaren auth yang kita buat tadi ke bagian route fitur kita (di contoh ini project) untuk mengaplikasikan authenticate dan authorization. Buka file routes fitur project (src/routes/projects.js).

  ```
  const express = require("express"); //import express
  const router = express.Router(); //include express router
  const controllers = require("../controllers/index"); //import projects controllers
  const validateAuth = require("../middlewares/validateAuth");

  const auth = [validateAuth.isAuthenticated, validateAuth.isAdmin];

  // post request
  router.post("/", auth, controllers.projects.post);

  // get request all data
  router.get("/", validateAuth.isAuthenticated, controllers.projects.getAll);

  // get request one data by id
  router.get(
    "/:id",
    validateAuth.isAuthenticated,
    controllers.projects.getOneById
  );

  //  put request
  router.put("/:id", auth, controllers.projects.put);

  // delete request
  router.delete("/:id", auth, controllers.projects.delete);

  module.exports = router;
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

## file request

- install multer

  ```
  npm i multer
  ```

- install cloudinary

  ```
  npm i cloudinary
  ```

- ambil cloud name, api key dan api secret dari dashboard cloudinary (kalau belum punya akun daftar dulu) dan tambahkan ke file .`env`

```
CLOUD_NAME=<clud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>
```

- buat utils untuk cloudinary dan multer

- buat buat script untuk upload image ke cloudinary mengguakan multer dengan mengimport utils coudinary dan multer yang kita buat tadi

## Reference

- [[1] santrikoding.com](https://santrikoding.com/tutorial-expressjs-restful-api-4-insert-data-ke-database)
- [[2] youtube.com/prawitohudoro](https://www.youtube.com/@prawitohudoro)
- [[3] github.com/argianardi/user-role](https://github.com/argianardi/user-role)
- [[4] Programmer Copy Paste](https://www.youtube.com/@ProgrammerCopyPaste)
- [[5] medium.com/chevalier-lab](https://medium.com/chevalier-lab/restful-api-node-js-express-mysql-dengan-model-controller-373003a0887b)
- [[6] medium.com/@nandazmann](https://medium.com/@nandazmann/authentication-dan-authorization-5ef8eb06d1c2)
