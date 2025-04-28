const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Ruta para recibir y procesar comentarios con php-cgi
app.post("/submit", (req, res) => {
  const { nombre, comentario } = req.body;

  if (!nombre || !comentario) {
    return res.status(400).json({ success: false, error: "Datos incompletos" });
  }

  // Ejecutar PHP con php-cgi en Node.js
  const command = `npx php-cgi -q submit.php "${nombre}" "${comentario}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: stderr });
    }
    res.json({ success: true, message: stdout });
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
