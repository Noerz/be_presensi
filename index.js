const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const helmet = require("helmet");
require("dotenv").config();
const db = require("./config/database"); // tambahkan ini untuk akses db instance
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ xPoweredBy: false }));
app.use(express.static("public")); // Menyajikan folder public
app.use("/uploads", express.static("uploads")); // Menyajikan folder uploads secara statis

// Middleware untuk cek koneksi database
app.use(async (req, res, next) => {
  try {
    await db.authenticate();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database tidak terhubung" });
  }
});

app.get("/", (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Hello World</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #1fa2ff, #12d8fa, #a6ffcb);
                    color: #fff;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    background-color: rgba(0, 0, 0, 0.5);
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }
                h1 {
                    font-size: 48px;
                    margin: 0;
                    text-transform: uppercase;
                }
                p {
                    font-size: 18px;
                    margin: 10px 0 0;
                }
                .button {
                    margin-top: 100px;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #007BFF;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hello World</h1>
                <p>Welcome to my Express.js app!</p>
                <a href="https://github.com" target="_blank" class="button">Visit My GitHub</a>
            </div>
        </body>
        </html>
    `);
});

app.use("/api/v1", routes);

// Setelah semua route
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "File terlalu besar. Maksimum ukuran adalah 5 MB.",
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    code: 500,
    status: "error",
    message: err.message || "Internal server error",
  });
});

app.listen(process.env.PORT, () =>
  console.log("server berjalan pada port " + process.env.PORT)
);
