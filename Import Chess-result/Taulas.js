// barra.js
(function() {
  // Función para obtener "contexto", por ejemplo, desde la URL o variable global
  function obtenerContexto() {
    // Ejemplo: obtener parámetro "estado" de la URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('estado') || 'default';
  }

  // Contenido para distintos estados
  const contenidos = {
    default: `<p>Bienvenido, no hay datos para mostrar.</p>`,
    
    jugadores: `
      <h2>Llista de Jugadors</h2>
      <div class="tabla-scroll">
        <table class="tablag" id="tablaJugadores"></table>
      </div>`,
      
    reserva: `
      <h2>Reserva</h2>
      <div class="tabla-scroll">
        <table class="tablag" id="tablaReserva"></table>
      </div>`,
      
    // Puedes añadir más estados y contenidos aquí...
  };

  // Inserta contenido en el div.barra
  function renderContenido() {
    const barra = document.querySelector('.barra');
    if (!barra) return console.warn("No se encontró el div '.barra'");

    const contexto = obtenerContexto();
    barra.innerHTML = contenidos[contexto] || contenidos['default'];

    // Si el contexto es "jugadores" o "reserva", cargar datos desde Google Sheets
    if (contexto === 'jugadores') {
      cargarDatos("Llista de jugadors", "tablaJugadores");
    } else if (contexto === 'reserva') {
      cargarDatos("Reserva", "tablaReserva");
    }
  }

  // Función para cargar datos (igual que tu ejemplo, adaptada)
  const sheetID = "1t2bqFBWX2uJs7ACSvpb-YBbjx0vLLeriocYPu_ULDwM";

  function cargarDatos(sheetName, tablaID) {
    const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const tabla = document.getElementById(tablaID);
        tabla.innerHTML = "";
        if (!data || data.length === 0) {
          tabla.innerHTML = "<tr><td>No hi ha dades</td></tr>";
          return;
        }
        const thead = tabla.createTHead();
        const trHead = thead.insertRow();
        const headers = Object.keys(data[0]);
        headers.forEach(h => {
          const th = document.createElement("th");
          th.textContent = h;
          trHead.appendChild(th);
        });
        const tbody = document.createElement("tbody");
        data.forEach(row => {
          const tr = document.createElement("tr");
          headers.forEach(h => {
            const td = document.createElement("td");
            td.textContent = row[h] ?? "";
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        tabla.appendChild(tbody);
      })
      .catch(err => {
        console.error(`Error al cargar hoja "${sheetName}":`, err);
        document.getElementById(tablaID).innerHTML = "<tr><td>Error al carregar dades</td></tr>";
      });
  }

  // Al cargar la página
  window.addEventListener('DOMContentLoaded', renderContenido);
})();
