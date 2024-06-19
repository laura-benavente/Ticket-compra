import "./style.css";
type TipoIva = 'general' | 'reducido' | 'superreducidoA' | 'superreducidoB' | 'superreducidoC' | 'sinIva';

interface Producto {
  nombre: string;
  precio: number;
  tipoIva: TipoIva;
}

interface LineaTicket {
  producto: Producto;
  cantidad: number;
}

interface ResultadoLineaTicket {
  nombre: string;
  cantidad: number;
  precioSinIva: number;
  tipoIva: TipoIva;
  precioConIva: number;
}

interface ResultadoTotalTicket {
  totalSinIva: number;
  totalConIva: number;
  totalIva: number;
}

interface TotalPorTipoIva {
  tipoIva: TipoIva;
  cuantia: number;
}

interface TicketFinal {
  lineas: ResultadoLineaTicket[];
  total: ResultadoTotalTicket;
  desgloseIva: TotalPorTipoIva[];
}

const ivaRates = {
  general: 21,
  reducido: 10,
  superreducidoA: 5,
  superreducidoB: 4,
  superreducidoC: 0,
  sinIva: 0
};

const productos: LineaTicket[] = [
  {
    producto: {
      nombre: "Legumbres",
      precio: 2,
      tipoIva: "general",
    },
    cantidad: 2,
  },
  {
    producto: {
      nombre: "Perfume",
      precio: 20,
      tipoIva: "general",
    },
    cantidad: 3,
  },
  {
    producto: {
      nombre: "Leche",
      precio: 1,
      tipoIva: "superreducidoC",
    },
    cantidad: 6,
  },
  {
    producto: {
      nombre: "Lasaña",
      precio: 5,
      tipoIva: "superreducidoA",
    },
    cantidad: 1,
  },
];

const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const resultadoLineas: ResultadoLineaTicket[] = [];
  const totalIvaPorTipo: Record<TipoIva, number> = {
    general: 0,
    reducido: 0,
    superreducidoA: 0,
    superreducidoB: 0,
    superreducidoC: 0,
    sinIva: 0
  };

  let totalSinIva = 0;
  let totalIva = 0;
  let totalConIva = 0;

  lineasTicket.forEach(linea => {
    const { producto, cantidad } = linea;
    const { nombre, precio, tipoIva } = producto;
    const precioSinIva = precio * cantidad;
    const iva = (precioSinIva * ivaRates[tipoIva]) / 100;
    const precioConIva = precioSinIva + iva;

    resultadoLineas.push({
      nombre,
      cantidad,
      precioSinIva: +precioSinIva.toFixed(2),
      tipoIva,
      precioConIva: +precioConIva.toFixed(2)
    });

    totalSinIva += precioSinIva;
    totalIva += iva;
    totalConIva += precioConIva;
    totalIvaPorTipo[tipoIva] += iva;
  });

  const desgloseIva = Object.keys(totalIvaPorTipo).map((key) => ({
    tipoIva: key as TipoIva,
    cuantia: +totalIvaPorTipo[key as TipoIva].toFixed(2)
  }));

  const resultadoTotal: ResultadoTotalTicket = {
    totalSinIva: +totalSinIva.toFixed(2),
    totalIva: +totalIva.toFixed(2),
    totalConIva: +totalConIva.toFixed(2)
  };

  return {
    lineas: resultadoLineas,
    total: resultadoTotal,
    desgloseIva
  };
};

const renderTicket = (ticket: TicketFinal) => {
  const tbody = document.getElementById('ticket-body') as HTMLTableSectionElement;
  tbody.innerHTML = '';
  ticket.lineas.forEach(linea => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${linea.nombre}</td>
      <td>${linea.cantidad}</td>
      <td>${linea.precioSinIva.toFixed(2)} €</td>
      <td>${linea.tipoIva} (${ivaRates[linea.tipoIva]}%)</td>
      <td>${linea.precioConIva.toFixed(2)} €</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById('total-sin-iva')!.textContent = ticket.total.totalSinIva.toFixed(2) + ' €';
  document.getElementById('total-iva')!.textContent = ticket.total.totalIva.toFixed(2) + ' €';
  document.getElementById('total-con-iva')!.textContent = ticket.total.totalConIva.toFixed(2) + ' €';
};

const ticketFinal = calculaTicket(productos);
renderTicket(ticketFinal);
