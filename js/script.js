/*
- Script.js: deberá incluir un archivo Debes crear un archivo script.js 
Para manejar toda la interactividad de la página.
Asegúrate de enlazarlo correctamente en tu archivo HTML.

- DOM: Implementa funciones para validar formularios (ej., campos requeridos y formato de correo).
Usa JavaScript para manipular elementos del DOM, por ejemplo, actualizar el carrito y mostrar mensajes al usuario

- Fetch Api: Consume datos desde una API REST usando fetch. Muestra los productos obtenidos de la API en la página en forma de tarjetas (cards).

- Visualización de Productos: Cada producto debe tener su imagen, título y precio, mostrando una lista atractiva para el usuario.
*/

// ------------------------------------------------  header ------------------------------------------------
/**
 * Funcion para mostrar la cantidad de productos en el carrito
 * Muestra la cantidad de productos en el carrito en el icono del carrito en el header 
 */
function cartCounter(){
  const counter = document.getElementById("cart-counter");
  const cart = JSON.parse(localStorage.getItem("carrito")) || [];
  if (cart.length === 0) {
    counter.textContent = 0; 
  }
  else 
  {
    const total = cart.reduce((acc, prod) => acc + prod.cantidad, 0);
    counter.textContent = total;
  }
}

cartCounter();

// ------------------------------------------------ contacto ------------------------------------------------
/** 
 * Evento para validar el formulario de contacto
 * Valida los campos del formulario de contacto y muestra mensajes de error si los campos no son válidos
 * Si no hay errores, se envía el formulario
*/
const form = document.getElementById("form-contacto");
if (window.location.pathname.includes("contacto")) {
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
}
// ------------------------------------------- api de productos -------------------------------------------
/**
 * Obtiene los productos de la api
 * @param {string} url - Url de la api
 * @returns {Promise<Object>} - Retorna un objeto con los productos
 */
const getProducts = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fetch Error", error);
    return ["error"];
  }
};

// ------------------------------------------------ tienda ------------------------------------------------
/**
 * Renderiza los productos en la tienda
 * Funcion asincrona que obtiene los productos de la api y los renderiza en la tienda
 * @returns {Promise<void>} - No retorna nada
 * 
 */
const renderizarProductos = async () => {
  try {
    // fake api de productos craeda con mockaroo y mocki.io (6 productos de ejemplo)
    const url = "https://mocki.io/v1/84f699a5-97f1-4fb8-aeea-b90a6ea56749";
    const products = await getProducts(url);
    const cards = document.querySelectorAll(".card");

    products.forEach((product, index) => {
      const card = cards[index];

      // Agregar atributos de datos a la tarjeta
      card.setAttribute("data-id", product.id);
      card.setAttribute("data-name", product.name);
      card.setAttribute("data-description", product.description);
      card.setAttribute("data-price", product.price);

      // Seleccionar elementos de la tarjeta
      const img = card.querySelector("img");
      const title = card.querySelector(".card-title");
      const description = card.querySelector(".card-text:nth-of-type(1)");
      const price = card.querySelector(".card-text:nth-of-type(2)");

      // Actualizar contenido de la tarjeta
      img.src = product.image_url;
      img.alt = product.name;
      img.style = "width: 100%; height: 200px; object-fit: cover;";
      title.textContent = product.name;
      description.textContent = product.description;
      price.textContent = `Precio: ${product.price}$`;
      console.log("Producto renderizado: ", product);
    });
  } catch (error) {
    console.log("Error al renderizar productos", error);
  } finally {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.classList.remove("hidden");
    });
  }
};

/**
 * Evento para agregar productos al carrito
 * Agrega un evento click "btn-add-cart" a cada producto de la tienda
 * Se agrega el producto al carrito y se guarda en el local storage
 */
if (window.location.pathname.includes("tienda")) {
  document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos().then(() => {
      const productos = document.querySelectorAll(".card");

      productos.forEach((producto) => {
        producto.addEventListener("click", (e) => {
          if (e.target.classList.contains("btn-add-cart")) {
            const card = e.target.closest(".card");

            const productoData = {
              id: card.dataset.id,
              name: card.dataset.name,
              price: card.dataset.price,
              image_url: card.querySelector("img").getAttribute("src"),
              cantidad: 1,
            };

            const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            const productoExistente = carrito.find(
              (prod) => prod.id === productoData.id
            );

            productoExistente
              ? productoExistente.cantidad++
              : carrito.push(productoData);
            
            localStorage.setItem("carrito", JSON.stringify(carrito));

            cartCounter();
            
            swal({
              text: "Producto agregado al carrito",
              icon: "success",
              button: "Aceptar",
            });
          }
        });
      });
    });
  });
}

// ------------------------------------------------  carrito ------------------------------------------------
/**
 * Actualiza los productos del carrito
 * renderiza los productos del carrito en la pagina de carrito
 * @returns {void} - No retorna nada
 */
function actualizarCarrito() {
  let precioTotal = 0;
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const carritoContainer = document.querySelector(".carrito-container");
  const parentContainer = carritoContainer.parentElement;
  const div = document.createElement("div");
  div.style =
    "display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;";

  if (carrito.length > 0) {
    parentContainer.classList.remove("container"); // hace que flexbox funcione correctamente
    carritoContainer.classList.remove("row"); // hace que flexbox funcione correctamente 
    carritoContainer.innerHTML = "";
    
    carrito.forEach((producto) => {
      // Crea un elemento para cada producto
      const productoElement = document.createElement("div");
      productoElement.classList.add("card", "border-dark", "h-100", "mb-3");
      productoElement.style = "width: 20rem;";
      productoElement.innerHTML = `
      <img src="${producto.image_url}"  class="card-img-top" alt="${
        producto.name
      }" style = "width: 100%; height: 200px; object-fit: cover;">
      <div class="card-body d-flex flex-column align-items-center">
        <h5 class="card-title">${producto.name}</h5>
        <span class="card-text">Cantidad: ${producto.cantidad}</span>
        <div class="d-flex justify-content-center gap-3 w-40 m-2 pb-2">
          <button class="btn btn-danger btn-remove" data-id="${
            producto.id
          }">-</button>
          <button class="btn btn-success btn-add" data-id="${
            producto.id
          }">+</button>
        </div>
        <p class="card-text">Precio: ${producto.price}$</p>
        <p class="card-text">Total: ${(
          producto.price * producto.cantidad
        ).toFixed(2)}$</p>
      </div>
    `;
      div.appendChild(productoElement);
      carritoContainer.appendChild(div);
      precioTotal += producto.price * producto.cantidad; // Calcula el precio total
    });

    // Muestra el precio total actualizado y añade el boton de comprar
    const totalElement = document.createElement("div");
    totalElement.style = "display: block; width: 100%;";
    totalElement.classList.add("text-end", "mt-3");
    totalElement.innerHTML = `
    <br/>
    <h3 class="text-center"><strong>Total del carrito: ${precioTotal.toFixed(
      2
    )}$</strong></h3>
    <div class="d-flex justify-content-center mt-4 pt-4">
    <br/>
    <br/>
    <btn class="btn btn-primary btn-comprar pt-2" style="transform: scale(1.8)">
    <i class="fa-solid fa-credit-card"></i> Comprar
    </btn>
    </div>
    `;
    parentContainer.appendChild(totalElement);
  }
}

/**
 * función para añadir productos al carrito
 * Añade un producto al carrito y lo guarda en el local storage
 * @param {*} id - data-id del producto
 */
function añadirProducto(id) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find((prod) => prod.id === id);
  producto.cantidad++;
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito(); 
  cartCounter();
}

/**
 * función para eliminar productos al carrito
 * elimina un producto del carrito y lo modifica en el local storage
 * si la cantidad del producto es 0, se elimina del carrito 
 * @param {*} id - data-id del producto
 */
function quitarProducto(id) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find((prod) => prod.id === id);
  producto.cantidad--;
  if (producto.cantidad === 0) {
    const index = carrito.indexOf(producto);
    carrito.splice(index, 1);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
  cartCounter();
}

/**
 * Eventos principales para la pagina de carrito
 * renderiza los productos del carrito y añade eventos a los botones de añadir, quitar y comprar
 * recarga la pagina despues de añadir o quitar un producto para actualizar el carrito
 */
if (window.location.pathname.includes("carrito")) {
  document.addEventListener("DOMContentLoaded", actualizarCarrito());
  const btnComprar = document.querySelector(".btn-comprar");

  // Evento para agregar productos
  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      añadirProducto(e.target.dataset.id);
      location.reload(); 
    });
  });

  // Evento para quitar productos
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      quitarProducto(e.target.dataset.id);
      location.reload();
    });
  });

  // Evento para comprar
  if (btnComprar) {
    btnComprar.addEventListener("click", (e) => {
      e.preventDefault();
      swal({
        text: "Gracias por su compra!",
        icon: "success",
        button: "Aceptar",
      }).then(() => {
        localStorage.clear();
        location.reload();
      });
    });
  }
}

