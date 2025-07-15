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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Welcome | Express API</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(120deg, #0f2027, #203a43, #2c5364);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                padding: 20px;
            }
            .card {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                max-width: 400px;
                width: 100%;
            }
            h1 {
                font-size: 32px;
                margin-bottom: 10px;
                letter-spacing: 1px;
            }
            p {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .btn-group {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            a.button {
                padding: 12px;
                border: none;
                border-radius: 6px;
                text-decoration: none;
                color: #fff;
                font-weight: 500;
                background: #007bff;
                transition: background 0.3s ease;
            }
            a.button:hover {
                background: #0056b3;
            }
            .info {
                margin-top: 30px;
                font-size: 13px;
                opacity: 0.7;
            }
            @media (max-width: 500px) {
                .card {
                    padding: 20px;
                }
                h1 {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🚀 Express API</h1>
            <p>Welcome to the backend server.<br>Everything is running smoothly!</p>
            <div class="btn-group">
                <a href="/api/v1" class="button">Explore API v1</a>
                <a href="/api/v1/info" class="button">Project Info</a>
                <a href="https://github.com" target="_blank" class="button">Visit GitHub</a>
            </div>
            <div class="info">© ${new Date().getFullYear()} Express App | Version 1.0.0</div>
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
