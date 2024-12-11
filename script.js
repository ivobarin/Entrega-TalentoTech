/*
- Script.js: deberá incluir un archivo Debes crear un archivo script.js 
Para manejar toda la interactividad de la página.
Asegúrate de enlazarlo correctamente en tu archivo HTML.

- DOM: Implementa funciones para validar formularios (ej., campos requeridos y formato de correo).
Usa JavaScript para manipular elementos del DOM, por ejemplo, actualizar el carrito y mostrar mensajes al usuario

- Fetch Api: Consume datos desde una API REST usando fetch. Muestra los productos obtenidos de la API en la página en forma de tarjetas (cards).

- Visualización de Productos: Cada producto debe tener su imagen, título y precio, mostrando una lista atractiva para el usuario.
*/

/* Para manejar las validacion del formulario contacto*/
const form = document.getElementById("form-contacto");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Limpiar mensajes de error anteriores
  const previousErrors = form.querySelectorAll(".error-message");
  previousErrors.forEach((errorElement) => errorElement.remove());

  let nombre = document.getElementById("nombre");
  let asunto = document.getElementById("asunto");
  let mensaje = document.getElementById("mensaje");

  let errores = {};
  const sytles = { color: "red", padding: "5", fontsize: "8px" };

  if (nombre.value.length < 3 || nombre.value.trim() === "") {
    errores["0"] = "el nombre debe tener al menos 3 caracteres";
  }

  if (asunto.value.trim() === "") {
    errores["2"] = "el asunto no puede estar vacio";
  }

  if (mensaje.value.trim() === "") {
    errores["3"] = "el mensaje no puede estar vacio";
  }

  for (let errors in errores) {
    let index = parseInt(errors);

    const div = document.createElement("div");
    const p = document.createElement("p");

    // identificar los mensajes de error
    div.classList.add("error-message");
    p.innerHTML = errores[errors];
    p.style.color = sytles.color;
    p.style.padding = sytles.padding;
    p.style.fontsize = sytles.fontsize;

    div.appendChild(p);
    form.children[index].appendChild(div);
  }

  // Enviar el formulario si no hay errores
  if (Object.keys(errores).length === 0) {
    form.submit();
  }
});
