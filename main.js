const botonAbrirCarrito = document.getElementById("boton-abrir-carrito");
const carritoLateral = document.getElementById("carrito-lateral");
const botonCerrarCarrito = document.getElementById("boton-cerrar-carrito");
const contenedorProductos = document.getElementById("contenedor-productos");
const listaArticulosCarrito = document.getElementById(
  "lista-articulos-carrito"
);
const totalCarrito = document.getElementById("total-carrito");
const botonFinalizarCompra = document.getElementById("boton-finalizar-compra");

let carritoDeCompras = JSON.parse(localStorage.getItem("carrito")) || [];
let iphones = JSON.parse(localStorage.getItem("iphones")) || [];

botonAbrirCarrito.addEventListener("click", () => {
  carritoLateral.classList.toggle("mostrar");
});

botonCerrarCarrito.addEventListener("click", () => {
  carritoLateral.classList.toggle("mostrar");
});

const calcularTotal = () => {
  let total = carritoDeCompras.reduce((acumulador, item) => {
    return acumulador + item.precio * item.cantidad;
  }, 0);
  return total;
};

const actualizarCarrito = () => {
  listaArticulosCarrito.innerHTML = "";
  if (carritoDeCompras.length === 0) {
    listaArticulosCarrito.innerHTML =
      '<p class="carrito-vacio-mensaje">El carrito está vacío.</p>';
  } else {
    carritoDeCompras.forEach((item) => {
      listaArticulosCarrito.innerHTML += `
        <div class="articulo-carrito" data-id="${item.id}">
          <h3>${item.nombre}</h3>
          <p>Precio: $${item.precio}</p>
          <div class="cantidad-control">
            <button class="boton-restar ">-</button>
            <span>${item.cantidad}</span>
            <button class="boton-sumar ">+</button>
            <button class="boton-eliminar ">Eliminar</button>
          </div>
          <p>Subtotal: $${item.precio * item.cantidad}</p>
        </div>
      `;
    });
  }

  let totalCalculado = calcularTotal();
  totalCarrito.innerHTML = `<p class="total">Total: $${totalCalculado}</p>`;
  localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));

  agregarEscuchadoresCarrito();
};

const agregarEscuchadoresDeEvento = () => {
  const botonesAgregar = document.querySelectorAll(".boton-agregar-carrito");
  const arrayBotones = Array.from(botonesAgregar);

  arrayBotones.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      let id = evento.target.closest(".tarjeta-producto").id;
      let productoExistente = carritoDeCompras.find((item) => item.id == id);
      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        let producto = iphones.find((el) => el.id == id);
        if (producto) {
          carritoDeCompras.push({ ...producto, cantidad: 1 });
        }
      }

      actualizarCarrito();
      const productoAgregado = iphones.find((p) => p.id == id);
      if (productoAgregado) {
        Swal.fire({
          icon: "success",
          title: "¡Producto Agregado!",
          text: `${productoAgregado.nombre} se añadió a tu carrito.`,
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  });
};

const agregarEscuchadoresCarrito = () => {
  const botonesSumar = document.querySelectorAll(".boton-sumar");
  const botonesRestar = document.querySelectorAll(".boton-restar");
  const botonesEliminar = document.querySelectorAll(".boton-eliminar");

  botonesSumar.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      let id = evento.target.closest(".articulo-carrito").dataset.id;
      let item = carritoDeCompras.find((el) => el.id == id);
      if (item) {
        item.cantidad++;
        actualizarCarrito();
      }
    });
  });

  botonesRestar.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      let id = evento.target.closest(".articulo-carrito").dataset.id;
      let item = carritoDeCompras.find((el) => el.id == id);
      if (item && item.cantidad > 1) {
        item.cantidad--;
      } else if (item && item.cantidad === 1) {
        carritoDeCompras = carritoDeCompras.filter((el) => el.id != id);
      }
      actualizarCarrito();
    });
  });

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      let id = evento.target.closest(".articulo-carrito").dataset.id;
      let item = carritoDeCompras.find((el) => el.id == id);
      Swal.fire({
        title: "¿Estás seguro?",
        text: `Se eliminará ${item.nombre} de tu carrito.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4a5e70ff",
        cancelButtonColor: "rgba(37, 203, 162, 1)",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          carritoDeCompras = carritoDeCompras.filter((el) => el.id != id);
          actualizarCarrito();
          Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
        }
      });
    });
  });
};

const renderizarProductos = () => {
  if (iphones.length === 0) {
    contenedorProductos.innerHTML =
      '<p class="mensaje-error">No se encontraron productos.</p>';
    return;
  }
  iphones.forEach((producto) => {
    contenedorProductos.innerHTML += `
      <section class="tarjeta-producto" id=${producto.id}>
        <img src=${producto.imagen} alt=${producto.nombre} />
        <h2>${producto.nombre}</h2>
        <p>${producto.descripcion}</p>
        <span class="precio">$${producto.precio}</span>
        <button class='boton-agregar-carrito'>Añadir al carrito</button>
      </section>
    `;
  });
  agregarEscuchadoresDeEvento();
};

botonFinalizarCompra.addEventListener("click", () => {
  if (carritoDeCompras.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Tu carrito está vacío",
      text: "No puedes finalizar la compra sin productos.",
    });
    return;
  }
  Swal.fire({
    title: "¿Deseas finalizar la compra?",
    text: `El total de tu compra es $${calcularTotal()}.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4a5e70ff",
    cancelButtonColor: "rgba(37, 203, 162, 1)",
    confirmButtonText: "Sí, finalizar compra",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carritoDeCompras = [];
      actualizarCarrito();
      Swal.fire(
        "¡Compra Exitosa!",
        "¡Gracias por tu compra, te esperamos de vuelta!",
        "success"
      );
      carritoLateral.classList.remove("mostrar");
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  if (iphones.length === 0) {
    try {
      let res = await fetch("./datos.json");
      let data = await res.json();
      data.forEach((item) => {
        iphones.push(item);
      });
      localStorage.setItem("iphones", JSON.stringify(iphones));
    } catch (error) {
      console.error("Error al cargar los datos del JSON:", error);
    }
  }
  renderizarProductos();
  actualizarCarrito();
});
