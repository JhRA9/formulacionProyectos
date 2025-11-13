import { PersonalRow, MateriaPrimaRow, EquipoRow, InversionRow, AmortizacionRow, DepreciacionRow, EstadoResultadosRow, FlujoEfectivoRow, RazonesFinancierasRow } from "@/types/excel-data";

export const personalYear1: PersonalRow[] = [
  {
    id: "p1-1",
    descripcion: "Gerente inventario",
    cantidad: 1,
    sueldoMensual: 6000000,
    sueldoAnual: 72000000,
    primas: 6000000,
    cesantias: 500000,
    interesesCesantias: 60000,
    salud: 510000,
    pension: 720000,
    arl: 31320,
    vacaciones: 3000000,
    total: 82821320
  },
  {
    id: "p1-2",
    descripcion: "Coordinador de control de inventarios",
    cantidad: 1,
    sueldoMensual: 3500000,
    sueldoAnual: 42000000,
    primas: 3500000,
    cesantias: 291666,
    interesesCesantias: 35000,
    salud: 297500,
    pension: 420000,
    arl: 18270,
    vacaciones: 1750000,
    total: 48312436
  },
  {
    id: "p1-3",
    descripcion: "Auxiliar de almacen",
    cantidad: 1,
    sueldoMensual: 1600000,
    sueldoAnual: 19200000,
    primas: 1600000,
    cesantias: 133333,
    interesesCesantias: 16000,
    salud: 136000,
    pension: 192000,
    arl: 8352,
    vacaciones: 800000,
    total: 22085685
  },
  {
    id: "p1-4",
    descripcion: "Auxiliar de Calidad",
    cantidad: 1,
    sueldoMensual: 1800000,
    sueldoAnual: 21600000,
    primas: 1800000,
    cesantias: 150000,
    interesesCesantias: 18000,
    salud: 153000,
    pension: 216000,
    arl: 9396,
    vacaciones: 900000,
    total: 24846396
  },
  {
    id: "p1-5",
    descripcion: "Auxiliar de Inventarios",
    cantidad: 1,
    sueldoMensual: 2000000,
    sueldoAnual: 24000000,
    primas: 2000000,
    cesantias: 166666,
    interesesCesantias: 20000,
    salud: 170000,
    pension: 240000,
    arl: 10440,
    vacaciones: 1000000,
    total: 27607106
  },
  {
    id: "p1-6",
    descripcion: "Coordinador de compras/abastecimiento",
    cantidad: 1,
    sueldoMensual: 3000000,
    sueldoAnual: 36000000,
    primas: 3000000,
    cesantias: 250000,
    interesesCesantias: 30000,
    salud: 255000,
    pension: 360000,
    arl: 15660,
    vacaciones: 1500000,
    total: 41410660
  },
  {
    id: "p1-7",
    descripcion: "Analista de Mercado",
    cantidad: 1,
    sueldoMensual: 3200000,
    sueldoAnual: 38400000,
    primas: 3200000,
    cesantias: 266666,
    interesesCesantias: 32000,
    salud: 272000,
    pension: 384000,
    arl: 16704,
    vacaciones: 1600000,
    total: 44171370
  },
  {
    id: "p1-8",
    descripcion: "Gerente de Finanzas",
    cantidad: 1,
    sueldoMensual: 7000000,
    sueldoAnual: 84000000,
    primas: 7000000,
    cesantias: 583333,
    interesesCesantias: 70000,
    salud: 595000,
    pension: 840000,
    arl: 36540,
    vacaciones: 3500000,
    total: 96624873
  },
  {
    id: "p1-9",
    descripcion: "Analista de Costos o Presupuestos",
    cantidad: 1,
    sueldoMensual: 4500000,
    sueldoAnual: 54000000,
    primas: 4500000,
    cesantias: 375000,
    interesesCesantias: 45000,
    salud: 382500,
    pension: 540000,
    arl: 23490,
    vacaciones: 2250000,
    total: 62115990
  },
  {
    id: "p1-10",
    descripcion: "Contadora",
    cantidad: 1,
    sueldoMensual: 4800000,
    sueldoAnual: 57600000,
    primas: 4800000,
    cesantias: 400000,
    interesesCesantias: 48000,
    salud: 408000,
    pension: 576000,
    arl: 25056,
    vacaciones: 2400000,
    total: 66257056
  },
  {
    id: "p1-11",
    descripcion: "Auxiliar de Caja",
    cantidad: 1,
    sueldoMensual: 2200000,
    sueldoAnual: 26400000,
    primas: 2200000,
    cesantias: 183333,
    interesesCesantias: 22000,
    salud: 187000,
    pension: 264000,
    arl: 11484,
    vacaciones: 1100000,
    total: 30367817
  },
  {
    id: "p1-12",
    descripcion: "Gerente de Marketing",
    cantidad: 1,
    sueldoMensual: 6000000,
    sueldoAnual: 72000000,
    primas: 6000000,
    cesantias: 500000,
    interesesCesantias: 60000,
    salud: 510000,
    pension: 720000,
    arl: 31320,
    vacaciones: 3000000,
    total: 82821320
  },
  {
    id: "p1-13",
    descripcion: "Coordinador de Publicidad y Medios",
    cantidad: 1,
    sueldoMensual: 4200000,
    sueldoAnual: 50400000,
    primas: 4200000,
    cesantias: 350000,
    interesesCesantias: 42000,
    salud: 357000,
    pension: 504000,
    arl: 21924,
    vacaciones: 2100000,
    total: 57974924
  },
  {
    id: "p1-14",
    descripcion: "Coordinador de Estrategias Comerciales",
    cantidad: 1,
    sueldoMensual: 4000000,
    sueldoAnual: 48000000,
    primas: 4000000,
    cesantias: 333333,
    interesesCesantias: 40000,
    salud: 340000,
    pension: 480000,
    arl: 20880,
    vacaciones: 2000000,
    total: 55214213
  },
  {
    id: "p1-15",
    descripcion: "Coordinador de Servicio al Cliente",
    cantidad: 1,
    sueldoMensual: 3800000,
    sueldoAnual: 45600000,
    primas: 3800000,
    cesantias: 316667,
    interesesCesantias: 38000,
    salud: 323000,
    pension: 456000,
    arl: 19836,
    vacaciones: 1900000,
    total: 52453503
  },
  {
    id: "p1-16",
    descripcion: "Diseñador Gráfico",
    cantidad: 1,
    sueldoMensual: 2800000,
    sueldoAnual: 33600000,
    primas: 2800000,
    cesantias: 233333,
    interesesCesantias: 28000,
    salud: 238000,
    pension: 336000,
    arl: 14616,
    vacaciones: 1400000,
    total: 38649949
  },
  {
    id: "p1-17",
    descripcion: "Gerente de Operaciones de Cocina",
    cantidad: 1,
    sueldoMensual: 6500000,
    sueldoAnual: 78000000,
    primas: 6500000,
    cesantias: 541667,
    interesesCesantias: 65000,
    salud: 552500,
    pension: 780000,
    arl: 33930,
    vacaciones: 3250000,
    total: 89723097
  },
  {
    id: "p1-18",
    descripcion: "Coordinador de Producción",
    cantidad: 1,
    sueldoMensual: 4500000,
    sueldoAnual: 54000000,
    primas: 4500000,
    cesantias: 375000,
    interesesCesantias: 45000,
    salud: 382500,
    pension: 540000,
    arl: 23490,
    vacaciones: 2250000,
    total: 62115990
  },
  {
    id: "p1-19",
    descripcion: "Coordinador de Calidad y Seguridad Alimentaria",
    cantidad: 1,
    sueldoMensual: 4000000,
    sueldoAnual: 48000000,
    primas: 4000000,
    cesantias: 333333,
    interesesCesantias: 40000,
    salud: 340000,
    pension: 480000,
    arl: 20880,
    vacaciones: 2000000,
    total: 55214213
  },
  {
    id: "p1-20",
    descripcion: "Auxiliar de Control de Calidad",
    cantidad: 1,
    sueldoMensual: 2000000,
    sueldoAnual: 24000000,
    primas: 2000000,
    cesantias: 166667,
    interesesCesantias: 20000,
    salud: 170000,
    pension: 240000,
    arl: 10440,
    vacaciones: 1000000,
    total: 27607107
  },
  {
    id: "p1-21",
    descripcion: "Pastelero",
    cantidad: 1,
    sueldoMensual: 2800000,
    sueldoAnual: 33600000,
    primas: 2800000,
    cesantias: 233333,
    interesesCesantias: 28000,
    salud: 238000,
    pension: 336000,
    arl: 14616,
    vacaciones: 1400000,
    total: 38649949
  },
  {
    id: "p1-22",
    descripcion: "Cocinero",
    cantidad: 1,
    sueldoMensual: 2600000,
    sueldoAnual: 31200000,
    primas: 2600000,
    cesantias: 216667,
    interesesCesantias: 26000,
    salud: 221000,
    pension: 312000,
    arl: 13572,
    vacaciones: 1300000,
    total: 35889239
  }
];

export const materiaPrima: MateriaPrimaRow[] = [
  {
    id: "mp-1",
    descripcion: "Mazorca",
    cantidad: 0.19,
    costoUnitario: 1100,
    costoTotal: 212
  },
  {
    id: "mp-2",
    descripcion: "Queso campesino",
    cantidad: 0.02,
    costoUnitario: 21000,
    costoTotal: 462
  },
  {
    id: "mp-3",
    descripcion: "Mantequilla",
    cantidad: 0.01,
    costoUnitario: 14900,
    costoTotal: 149
  },
  {
    id: "mp-4",
    descripcion: "Ameros",
    cantidad: 0.02,
    costoUnitario: 500,
    costoTotal: 100
  },
  {
    id: "mp-5",
    descripcion: "Sal",
    cantidad: 0.01,
    costoUnitario: 6000,
    costoTotal: 42
  },
  {
    id: "mp-6",
    descripcion: "Azúcar",
    cantidad: 0.01,
    costoUnitario: 1300,
    costoTotal: 7
  }
];

export const equipos: EquipoRow[] = [
  {
    id: "eq-1",
    descripcion: "Vitrina refrigerada horizontal (mostrador)",
    cantidad: 1,
    costoUnitario: 14990000,
    total: 14990000
  },
  {
    id: "eq-2",
    descripcion: "Vitrina refrigerada vertical - modelo A",
    cantidad: 1,
    costoUnitario: 7399000,
    total: 7399000
  },
  {
    id: "eq-3",
    descripcion: "Nevera vertical comercial 755 L",
    cantidad: 1,
    costoUnitario: 6529900,
    total: 6529900
  },
  {
    id: "eq-4",
    descripcion: "Máquina de café espresso 2 grupos",
    cantidad: 1,
    costoUnitario: 23865000,
    total: 23865000
  },
  {
    id: "eq-5",
    descripcion: "Molino de café profesional",
    cantidad: 1,
    costoUnitario: 4100000,
    total: 4100000
  },
  {
    id: "eq-6",
    descripcion: "Licuadora",
    cantidad: 1,
    costoUnitario: 1545167,
    total: 1545167
  },
  {
    id: "eq-7",
    descripcion: "Freidora industrial (1 un compartimiento)",
    cantidad: 1,
    costoUnitario: 3817400,
    total: 3817400
  },
  {
    id: "eq-8",
    descripcion: "Plancha para asar",
    cantidad: 1,
    costoUnitario: 1282300,
    total: 1282300
  },
  {
    id: "eq-9",
    descripcion: "Campana extractora comercial",
    cantidad: 1,
    costoUnitario: 1350000,
    total: 1350000
  },
  {
    id: "eq-10",
    descripcion: "Fabricador de hielo (10 kg - ejemplo)",
    cantidad: 1,
    costoUnitario: 4274900,
    total: 4274900
  },
  {
    id: "eq-11",
    descripcion: "Lavavajillas industrial (Claseq D3000 ej.)",
    cantidad: 1,
    costoUnitario: 16541000,
    total: 16541000
  },
  {
    id: "eq-12",
    descripcion: "Microondas",
    cantidad: 1,
    costoUnitario: 1199900,
    total: 1199900
  },
  {
    id: "eq-13",
    descripcion: "PC (para las ordenes)",
    cantidad: 1,
    costoUnitario: 2800000,
    total: 2800000
  },
  {
    id: "eq-14",
    descripcion: "Escritorio ejecutivo",
    cantidad: 4,
    costoUnitario: 1200000,
    total: 4800000
  },
  {
    id: "eq-15",
    descripcion: "Escritorio estándar",
    cantidad: 6,
    costoUnitario: 850000,
    total: 5100000
  },
  {
    id: "eq-16",
    descripcion: "Silla ergonómica ejecutiva",
    cantidad: 4,
    costoUnitario: 950000,
    total: 3800000
  },
  {
    id: "eq-17",
    descripcion: "Silla ergonómica estándar",
    cantidad: 14,
    costoUnitario: 800000,
    total: 11200000
  },
  {
    id: "eq-18",
    descripcion: "Archivador metálico",
    cantidad: 6,
    costoUnitario: 750000,
    total: 4500000
  },
  {
    id: "eq-19",
    descripcion: "Estantería",
    cantidad: 3,
    costoUnitario: 650000,
    total: 1950000
  },
  {
    id: "eq-20",
    descripcion: "Computador de escritorio",
    cantidad: 14,
    costoUnitario: 2800000,
    total: 39200000
  },
  {
    id: "eq-21",
    descripcion: "Impresora multifuncional",
    cantidad: 2,
    costoUnitario: 1500000,
    total: 3000000
  },
  {
    id: "eq-22",
    descripcion: "Teléfono fijo",
    cantidad: 6,
    costoUnitario: 250000,
    total: 1500000
  },
  {
    id: "eq-23",
    descripcion: "Router + Red local",
    cantidad: 1,
    costoUnitario: 2500000,
    total: 2500000
  },
  {
    id: "eq-24",
    descripcion: "Aire acondicionado",
    cantidad: 3,
    costoUnitario: 2200000,
    total: 6600000
  },
  {
    id: "eq-125",
    descripcion: "Cafetera y dispensador de agua",
    cantidad: 2,
    costoUnitario: 600000,
    total: 1200000
  },
  {
    id: "eq-26",
    descripcion: "Extintores, señalización y botiquín",
    cantidad: 1,
    costoUnitario: 700000,
    total: 700000
  },
  {
    id: "eq-27",
    descripcion: "Facebook e instagram ADS",
    cantidad: 12,
    costoUnitario: 1860000,
    total: 22320000
  },
  {
    id: "eq-28",
    descripcion: "Volantes",
    cantidad: 12,
    costoUnitario: 1500000,
    total: 18000000
  }
];

export const inversiones: InversionRow[] = [
  {
    id: "inv-1",
    descripcion: "Terrenos",
    inversionTotal: 5000000,
    fondosPropios: 2750000,
    banco: 1500000,
    otrasFuentes: 750000
  },
  {
    id: "inv-2",
    descripcion: "Edificio",
    inversionTotal: 2000000,
    fondosPropios: 1100000,
    banco: 600000,
    otrasFuentes: 300000
  },
  {
    id: "inv-3",
    descripcion: "Mobiliario y equipos",
    inversionTotal: 86050000,
    fondosPropios: 47327500,
    banco: 25815000,
    otrasFuentes: 12907500
  },
  {
    id: "inv-4",
    descripcion: "Maquinas y equipos",
    inversionTotal: 99240723,
    fondosPropios: 54582398,
    banco: 29772217,
    otrasFuentes: 14886108
  },
  {
    id: "inv-5",
    descripcion: "Equipo de reparto",
    inversionTotal: 86500000,
    fondosPropios: 47575000,
    banco: 25950000,
    otrasFuentes: 12975000
  },
  {
    id: "inv-6",
    descripcion: "Programas IOT",
    inversionTotal: 40320000,
    fondosPropios: 22176000,
    banco: 12096000,
    otrasFuentes: 6048000
  }
];

export const amortizacion: AmortizacionRow[] = [
  {
    id: "am-1",
    año: 1,
    pagoPeriodico: 21033818,
    pagoIntereses: 18147568,
    pagoCapital: 2886251,
    saldo: 97933571
  },
  {
    id: "am-2",
    año: 2,
    pagoPeriodico: 21033818,
    pagoIntereses: 17628043,
    pagoCapital: 3405776,
    saldo: 94527795
  },
  {
    id: "am-3",
    año: 3,
    pagoPeriodico: 21033818,
    pagoIntereses: 17015003,
    pagoCapital: 4018815,
    saldo: 90508980
  },
  {
    id: "am-4",
    año: 4,
    pagoPeriodico: 21033818,
    pagoIntereses: 16291616,
    pagoCapital: 4742202,
    saldo: 85766778
  }
];

export const depreciacion: DepreciacionRow[] = [
  {
    id: "dep-1",
    activos: "TERRENO",
    valorActivos: 5000000,
    vidaUtil: null,
    depreciacion: 0,
    porcentajeSalvamento: 150,
    valorSalvamento: 7500000
  },
  {
    id: "dep-2",
    activos: "EDIFICIO",
    valorActivos: 2000000,
    vidaUtil: 30,
    depreciacion: 66666.67,
    porcentajeSalvamento: 82,
    valorSalvamento: 1640000
  },
  {
    id: "dep-3",
    activos: "MAQ Y EQUIPOS PROD",
    valorActivos: 99240723,
    vidaUtil: 10,
    depreciacion: 9924072.30,
    porcentajeSalvamento: 15,
    valorSalvamento: 14886108.45
  },
  {
    id: "dep-4",
    activos: "MOBILIARIO Y EQUIPOS OFI",
    valorActivos: 86050000,
    vidaUtil: 5,
    depreciacion: 17210000,
    porcentajeSalvamento: 10,
    valorSalvamento: 8605000
  },
  {
    id: "dep-5",
    activos: "EQUIPO DE REPARTO",
    valorActivos: 86500000,
    vidaUtil: 5,
    depreciacion: 17300000,
    porcentajeSalvamento: 25,
    valorSalvamento: 21625000
  },
  {
    id: "dep-6",
    activos: "Gastos de organización",
    valorActivos: 1100000,
    vidaUtil: 5,
    depreciacion: 220000,
    porcentajeSalvamento: 0,
    valorSalvamento: 0
  }
];

export const estadoResultados: EstadoResultadosRow[] = [
  {
    id: "er-1",
    detalle: "Unidades a producir",
    año1: 6000,
    año2: 4200,
    año3:0,
    año4:0,
    año5:0
  },
  {
    id: "er-2",
    detalle: "Precios por unidad",
    año1: 228459,
    año2: 6670,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-3",
    detalle: "ingresos por ventas",
    año1: 1370756629,
    año2: 28014000,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-4",
    detalle: "costo del producto",
    año1: 309200713,
    año2: 333936568,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-5",
    detalle: "Mano de obra directa",
    año1: 309199595,
    año2: 333935563,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-6",
    detalle: "Materia prima directa",
    año1: 972,
    año2: 1006,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-7",
    detalle: "Costo indirecto de fabricacion",
    año1: 146,
    año2: 0,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-8",
    detalle: "Utilidad neta",
    año1: 1061555917,
    año2: -305922568,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-9",
    detalle:"Gastos de operacion",
    año1: 858564817,
    año2: 950952613,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "er-10",
    detalle: "GASTOS DE ADMINISTRACION",
    año1: 522420857,
    año2: 553189591,
    año3: 0,
    año4: 0,
    año5: 0
  },
  { id: "er-11", 
    detalle: "Sueldos y salarios de admon", 
    año1: 516252892, 
    año2: 574222366, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  },
  { 
    id: "er-12", 
    detalle: "Depreciacion - equipo de reparto", 
    año1: 27200739, 
    año2: 0, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  },
  { 
    id: "er-13", 
    detalle: "Amortizacion gastos de organización", 
    año1: -21033818, 
    año2: -21033818, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  },
  { 
    id: "er-14", 
    detalle: "Gastos de papeleria y útiles", 
    año1: 666, 
    año2: 666, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  },
  { 
    id: "er-15", 
    detalle: "Gastos de energía / gas", 
    año1: 111, 
    año2: 111, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-16", 
    detalle: "Gastos de agua", 
    año1: 89, 
    año2: 89, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  },
  { 
    id: "er-17", 
    detalle: "Gastos de tele. e internet", 
    año1: 89, 
    año2: 89, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-18", 
    detalle: "Gastos de accesorios", 
    año1: 89, 
    año2: 89, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  },
  { 
    id: "er-19", 
    detalle: "Gastos de alquiler", 
    año1: 0, 
    año2: 0, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  },
  {
    id: "er-20",
    detalle: "GASTOS DE VENTA",
    año1: 336143960,
    año2: 397763022,
    año3: 0,
    año4: 0,
    año5: 0
  },
  { id: "er-21", 
    detalle: "Sueldos y salarios de venta", 
    año1: 248463960, 
    año2: 310083022, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-22", detalle: "Depreciación equipos de reparto", 
    año1: 17300000, 
    año2: 17300000, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-23", detalle: "Gastos por repuestos", 
    año1: 12000, 
    año2: 12000, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-24", detalle: "Gastos de combustibles", 
    año1: 48000, 
    año2: 48000, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-25", detalle: "Gastos de publicidad", 
    año1: 40320000, 
    año2: 40320000, 
    año3: 0, 
    año4: 0,
    año5: 0 },
  { 
    id: "er-26", detalle: "Gastos de promoción", 
    año1: 30000000, 
    año2: 30000000, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-27", detalle: "UTILIDAD DE OPERACIÓN", 
    año1: 202991100, 
    año2: -1256875181, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-28", detalle: "GASTOS FINANCIEROS", 
    año1: 24196757, 
    año2: 23426573, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-29", detalle: "Banco comercial", 
    año1: 18147568, 
    año2: 17628043, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-30", detalle: "Otras fuentes", 
    año1: 6049189, 
    año2: 5798530, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-31", detalle: "UTILIDAD ANTES DE IMPUESTO", 
    año1: 178794343, 
    año2: -1280301754, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-32", detalle: "IMPUESTOS", 
    año1: 1787943429, 
    año2: -320075439, 
    año3: 0, 
    año4: 0, 
    año5: 0 },
  { 
    id: "er-33", detalle: "UTILIDAD NETA", 
    año1: -1609149086, 
    año2: 0, 
    año3: 0, 
    año4: 0, 
    año5: 0 
  }  
];

export const flujoEfectivo: FlujoEfectivoRow[] = [
  {
    id: "fe-1",
    detalle: "Utilidad Bruta",
    año0: 0,
    año1: 2349193,
    año2: 2466652.65,
    año3: 2589985.283,
    año4: 2719484.547,
    año5: 2855458.774
  },
  {
    id: "fe-2",
    detalle: "Gastos NO Desembolsables",
    año0: 0,
    año1: 1027067,
    año2: 1027067,
    año3: 1027067,
    año4: 1027067,
    año5: 1027067
  },
  {
    id: "fe-3",
    detalle: "Inversión",
    año0: -15434000,
    año1: 0,
    año2: 0,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "fe-4",
    detalle: "Prestamo",
    año0: 6945300,
    año1: 0,
    año2: 0,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "fe-5",
    detalle: "Flujo de efectivo en venta de Act",
    año0: -8488700,
    año1: 3147777,
    año2: 3265237,
    año3: 3388569.28,
    año4: 3518069,
    año5: 5814043
  },
  {
    id: "fe-6",
    detalle: "Pago de capital",
    año0: 0,
    año1: -228483,
    año2: -228483,
    año3: -228483,
    año4: -228483,
    año5: -228483
  },
  {
    id: "fe-7",
    detalle: "Rescate del Capital de Trabajo",
    año0: 0,
    año1: 0,
    año2: 0,
    año3: 0,
    año4: 0,
    año5: 2160000
  }
];

export const razonesFinancieras: RazonesFinancierasRow[] = [
  {
    id: "rf-1",
    razon: "MARGEN DE UTILIDAD NETA",
    año1: 0.613129991,
    año2: 0.713744705,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "rf-2",
    razon: "ROTACION DE ACTIVOS",
    año1: 5.746497423,
    año2: 0.117440525,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "rf-3",
    razon: "RENDIMIENTO SOBRE LOS ACTIVOS",
    año1: -6.74588828,
    año2: 0,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "rf-4",
    razon: "RENDIMIENTO SOBRE EL CAPITAL",
    año1: 1.129772298,
    año2: 0,
    año3: 0,
    año4: 0,
    año5: 0
  },
  {
    id: "rf-5",
    razon: "INDICE DE DEUDA",
    año1: 0.613129991,
    año2: 0.613129991,
    año3: 0,
    año4: 0,
    año5: 0
  }
];
