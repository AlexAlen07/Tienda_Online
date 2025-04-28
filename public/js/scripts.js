window.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  //  Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  document.querySelectorAll(".timeline-image img").forEach((img) => {
    let timer;
    img.addEventListener("mouseover", () => {
      timer = setTimeout(() => {
        img.classList.add("expanded");
      }, 2000);
    });
    img.addEventListener("mouseleave", () => {
      clearTimeout(timer);
      img.classList.add("fading-out");
      setTimeout(() => {
        img.classList.remove("expanded", "fading-out");
      }, 500);
    });
  });

  document.querySelectorAll(".expandable").forEach((img) => {
    let timer;
    img.addEventListener("mouseover", () => {
      timer = setTimeout(() => {
        document.getElementById("modalImg").src = img.src;
        document.getElementById("imageModal").style.display = "flex";
      }, 2000);
    });

    img.addEventListener("mouseleave", () => {
      clearTimeout(timer);
    });
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("imageModal").style.display = "none";
  });

  // Validar el formulario
  document
    .querySelector(".btn-primary")
    .addEventListener("click", validarFormulario);
});

// Función de validación del formulario
function validarFormulario() {
  // Obtener los valores de los campos
  var nombre = document.getElementById("nombre").value.trim();
  var comentario = document.getElementById("comentario").value.trim();

  // Validar el nombre
  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres.");
    return;
  }

  // Validar el comentario
  if (comentario.length < 10) {
    alert("El comentario debe tener al menos 10 caracteres.");
    return;
  }

  // Si las validaciones pasan, enviar los datos al servidor
  fetch("http://localhost:3000/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: nombre, comentario: comentario }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Comentario guardado con éxito!");
        // Limpiar los campos después de enviar
        document.getElementById("nombre").value = "";
        document.getElementById("comentario").value = "";
      } else {
        alert("Error al guardar el comentario.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al guardar el comentario.");
    });
}

// Sistema de Comentarios
document.addEventListener('DOMContentLoaded', function() {
  // Cargar comentarios al iniciar
  loadComments();
  
  // Manejar envío del formulario
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
      commentForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          if (this.checkValidity()) {
              const commentData = {
                  name: document.getElementById('nombre').value,
                  text: document.getElementById('comentario').value,
                  date: new Date().toISOString()
              };
              
              saveComment(commentData);
              this.reset();
              this.classList.remove('was-validated');
          } else {
              this.classList.add('was-validated');
          }
      }, false);
  }
});

// Guardar comentario en localStorage
function saveComment(comment) {
  let comments = JSON.parse(localStorage.getItem('comments')) || [];
  comments.unshift(comment); // Añadir al inicio
  localStorage.setItem('comments', JSON.stringify(comments));
  displayComment(comment, true);
}

// Cargar todos los comentarios
function loadComments() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) spinner.style.display = 'block';
  
  setTimeout(() => {
      const comments = JSON.parse(localStorage.getItem('comments')) || [];
      const commentsList = document.getElementById('commentsList');
      
      if (spinner) spinner.style.display = 'none';
      
    
      
      commentsList.innerHTML = '';
      comments.forEach(comment => {
          displayComment(comment);
      });
  }, 800); // Simular carga
}

// Mostrar un comentario
function displayComment(comment, isNew = false) {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) return;
  
  const date = new Date(comment.date);
  const formattedDate = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  });
  
  const commentElement = document.createElement('div');
  commentElement.className = `col-md-6 mb-4 ${isNew ? 'new-comment' : ''}`;
  commentElement.innerHTML = `
      <div class="comment-card h-100">
          <div class="comment-header">
              <span class="comment-author">${comment.name}</span>
              <span class="comment-date">${formattedDate}</span>
          </div>
          <div class="comment-text">${comment.text}</div>
      </div>
  `;
  
  if (isNew) {
      commentsList.prepend(commentElement);
  } else if (commentsList.firstChild) {
      commentsList.insertBefore(commentElement, commentsList.firstChild);
  } else {
      commentsList.appendChild(commentElement);
  }
}