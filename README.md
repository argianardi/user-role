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

- Buat folder src, yang didalamnya diisikan dengan folder:

  - configs
  - middlewares

- setelah membuat struktur folder dan file hal yang pertama kita lakukan dalam membuat aplikasi adalah membuat bagian model untuk membuat dan mendefine table di dalam database.

- install sequelize
- instal mysql2 dengan command
- install express

```
npm i mysql2
```

- instal dotenv dengan command

```
npm i dotenv
```

- buat file .env di directory/folder yang sama dengan file entry point project kita(`index.js`) dan assign data yang sifatnya sensitif (port, username, password mysql, host dan nama database)

- buat konfigurasi database di folder `config` kita namai filenya dengan `database.js`.
  bu

npm install compression cors helmet

```
-configs
-controllers
-middlewares
-routes

```
