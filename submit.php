<?php
if ($argc > 2) {
    $nombre = htmlspecialchars($argv[1]);
    $comentario = htmlspecialchars($argv[2]);

    $nuevoComentario = "Nombre: $nombre\nComentario: $comentario\n------------------------\n";

    file_put_contents("comentarios.txt", $nuevoComentario, FILE_APPEND);
    echo "Comentario guardado correctamente.";
} else {
    echo "Error: Datos incompletos.";
}
?>
