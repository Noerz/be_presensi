const getProjectInfo = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Project Information | Express API</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(120deg, #2980b9, #6dd5fa, #ffffff);
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                background: rgba(255, 255, 255, 0.9);
                border-radius: 16px;
                padding: 40px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                max-width: 800px;
                width: 100%;
            }
            h1 {
                font-size: 36px;
                margin-bottom: 20px;
                color: #2c3e50;
                text-align: center;
            }
            p {
                font-size: 18px;
                line-height: 1.6;
                margin-bottom: 15px;
            }
            .tech-stack {
                margin-top: 30px;
            }
            .tech-stack h2 {
                font-size: 24px;
                margin-bottom: 15px;
                color: #2980b9;
            }
            .tech-stack ul {
                list-style: none;
                padding: 0;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .tech-stack li {
                background: #3498db;
                color: #fff;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 16px;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 14px;
                color: #7f8c8d;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Project: Presensi App Backend</h1>
            <p>
                This is the backend for a presence application, built with Node.js and Express. 
                It handles user authentication, data management for classes, subjects, schedules, and attendance records.
            </p>
            <p>
                The API provides endpoints for all core functionalities required by the frontend application.
            </p>
            
            <div class="tech-stack">
                <h2>Technology Stack</h2>
                <ul>
                    <li>Node.js</li>
                    <li>Express.js</li>
                    <li>Sequelize (PostgreSQL)</li>
                    <li>JSON Web Token (JWT)</li>
                    <li>Dotenv</li>
                    <li>Cors</li>
                    <li>Helmet</li>
                </ul>
            </div>

            <div class="footer">
                <p>Developed by [Your Name]</p>
            </div>
        </div>
    </body>
    </html>
  `);
};

module.exports = { getProjectInfo };