import { PersonalRow, MateriaPrimaRow, EquipoRow, InversionRow, DepreciacionRow, AmortizacionRow, EstadoResultadosRow, FlujoEfectivoRow, RazonesFinancierasRow } from "@/types/excel-data";

export const calculateDepreciacion = (equipos: EquipoRow[]): DepreciacionRow[] => {
  const rows: DepreciacionRow[] = [];

  equipos.forEach((equipo, index) => {
    const valorActivos = equipo.costoUnitario * equipo.cantidad;
    const vidaUtil = 5; // Asumiendo vida útil de 5 años, puede ajustarse
    const depreciacion = valorActivos / vidaUtil;
    const porcentajeSalvamento = 10; // 10% valor de salvamento
    const valorSalvamento = valorActivos * (porcentajeSalvamento / 100);

    rows.push({
      id: `dep-${index + 1}`,
      activos: equipo.descripcion,
      valorActivos,
      vidaUtil,
      depreciacion,
      porcentajeSalvamento,
      valorSalvamento
    });
  });

  return rows;
};

export const calculateAmortizacion = (inversiones: InversionRow[]): AmortizacionRow[] => {
  // Asumiendo que hay un préstamo basado en inversiones
  const totalBanco = inversiones.reduce((sum, inv) => sum + inv.banco, 0);
  const tasaAnual = 18; // 18% anual
  const periodo = 12; // 12 meses

  if (totalBanco === 0) return [];

  const tasaMensual = tasaAnual / 100 / 12;
  const pagoMensual = (totalBanco * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -periodo));

  const rows: AmortizacionRow[] = [];
  let saldo = totalBanco;

  for (let i = 1; i <= periodo; i++) {
    const pagoIntereses = saldo * tasaMensual;
    const pagoCapital = pagoMensual - pagoIntereses;
    saldo = saldo - pagoCapital;

    rows.push({
      id: `amort-${i}`,
      año: i,
      pagoPeriodico: pagoMensual,
      pagoIntereses,
      pagoCapital,
      saldo: saldo > 0 ? saldo : 0
    });
  }

  return rows;
};

// Constants
const PRECIO_UNITARIO = 13330; // Fixed unit price
const COSTO_POR_PRODUCTO = 418389185 / 72000; // Cost per product from year 1 data

export const calculateEstadoResultados = (
  personal: PersonalRow[],
  materiaPrima: MateriaPrimaRow[],
  depreciacion: DepreciacionRow[],
  amortizacion: AmortizacionRow[],
  inversiones: InversionRow[]
): EstadoResultadosRow[] => {
  const totalPersonal = personal.reduce((sum, p) => sum + p.total, 0);

  // Calculate production with growth rules
  const production = [72000]; // Year 1
  for (let i = 1; i < 10; i++) {
    if (i === 1) production.push(production[0] * 1.2); // Year 2 = Year 1 * 1.2
    else if (i === 2) production.push(production[1] * 1.05); // Year 3 = Year 2 * 1.05
    else production.push(production[i - 1]); // Years 4-10 = previous year * 1
  }

  // Ingreso = production * precio_unitario
  const ingreso = production.map(p => p * PRECIO_UNITARIO);

  // Venta de Maq (from original data)
  const ventaMaq = [0, 0, 0, 0, 0, 0, 0, 43025000, 0, 0];

  // Costos Variables = costo_por_producto * -1 * production
  const costosVariables = production.map(p => COSTO_POR_PRODUCTO * -1 * p);

  // Costos Fijos = totalPersonal * -1 (constant for all years)
  const costosFijos = Array(10).fill(totalPersonal * -1);

  // Depre.Const = (Terreno from Inversiones Year 0) / 40 (constant)
  const terreno = inversiones.find(inv => inv.descripcion.toLowerCase().includes('terreno'))?.inversionTotal || 0;
  const depreConst = Array(10).fill(terreno / 40);

  // Depre.Maquinas = (Construcción from Inversiones Year 0) / 10 (constant)
  const construccion = inversiones.find(inv => inv.descripcion.toLowerCase().includes('construccion'))?.inversionTotal || 0;
  const depreMaquinas = Array(10).fill(construccion / 10);

  // Valor en Libros = Terreno / 2 (constant)
  const valorLibros = Array(10).fill(terreno / 2);

  // Utilidad Antes de Impuestos = Ingreso + Venta de Maq + Costos Variables + Costos Fijos + Depre.Const + Depre.Maquinas
  const utilidadAntesImpuestos = ingreso.map((ing, i) =>
    ing + ventaMaq[i] + costosVariables[i] + costosFijos[i] + depreConst[i] + depreMaquinas[i]
  );

  // Impuestos = Utilidad Antes de Impuestos * 0.17
  const impuestos = utilidadAntesImpuestos.map(u => u * 0.17);

  // Utilidad Neta = Utilidad Antes de Impuestos + Impuestos (as per rules, though typically -)
  const utilidadNeta = utilidadAntesImpuestos.map((u, i) => u + impuestos[i]);

  // Depre.Const (posterior) = Utilidad Antes de Impuestos * -1
  const depreConstPost = utilidadAntesImpuestos.map(u => u * -1);

  // Depre.Maquinas (posterior) = same as above
  const depreMaquinasPost = utilidadAntesImpuestos.map(u => u * -1);

  // Valor en Libros (posterior) = Utilidad Antes de Impuestos * -1
  const valorLibrosPost = utilidadAntesImpuestos.map(u => u * -1);

  // Maquinaria = only Year 6 = Maquinaria from Inversiones Year 0
  const maquinaria = inversiones.find(inv => inv.descripcion.toLowerCase().includes('maquinaria'))?.inversionTotal || 0;
  const maquinariaArray = Array(10).fill(0);
  maquinariaArray[5] = maquinaria; // Year 6 (index 5)

  // Capital de Trabajo
  const capitalTrabajo = [];
  // Year 0: (Costos Variables Year 1 + Costos Fijos Year 1) / 2
  capitalTrabajo.push((costosVariables[0] + costosFijos[0]) / 2);
  // Years 1-9: (Costos Variables current - Costos Variables next) / 2
  for (let i = 0; i < 9; i++) {
    capitalTrabajo.push((costosVariables[i] - costosVariables[i + 1]) / 2);
  }
  // Year 10: Sum of Capital de Trabajo from Year 1 to 9
  capitalTrabajo.push(capitalTrabajo.slice(1, 10).reduce((sum, val) => sum + val, 0));

  // Flujo del proyecto (simplified, as original)
  const flujoProyecto = [-623862, 118185600, 152322238, 163496603, 174894456, 97970266, 198378592, 210474085, 222811488, 789930943];

  // ROI = Utilidad Neta / Ingreso * 100
  const roi = ingreso.map((ing, i) => ing !== 0 ? (utilidadNeta[i] / ing) * 100 : 0);

  return [
    {
      id: "er-1",
      detalle: "Produccion",
      año1: production[0],
      año2: production[1],
      año3: production[2],
      año4: production[3],
      año5: production[4],
      año6: production[5],
      año7: production[6],
      año8: production[7],
      año9: production[8],
      año10: production[9]
    },
    {
      id: "er-2",
      detalle: "Ingreso",
      año1: ingreso[0],
      año2: ingreso[1],
      año3: ingreso[2],
      año4: ingreso[3],
      año5: ingreso[4],
      año6: ingreso[5],
      año7: ingreso[6],
      año8: ingreso[7],
      año9: ingreso[8],
      año10: ingreso[9]
    },
    {
      id: "er-3",
      detalle: "Venta de Maq",
      año1: ventaMaq[0],
      año2: ventaMaq[1],
      año3: ventaMaq[2],
      año4: ventaMaq[3],
      año5: ventaMaq[4],
      año6: ventaMaq[5],
      año7: ventaMaq[6],
      año8: ventaMaq[7],
      año9: ventaMaq[8],
      año10: ventaMaq[9]
    },
    {
      id: "er-4",
      detalle: "Costos Variables",
      año1: costosVariables[0],
      año2: costosVariables[1],
      año3: costosVariables[2],
      año4: costosVariables[3],
      año5: costosVariables[4],
      año6: costosVariables[5],
      año7: costosVariables[6],
      año8: costosVariables[7],
      año9: costosVariables[8],
      año10: costosVariables[9]
    },
    {
      id: "er-5",
      detalle: "Costos Fijos",
      año1: costosFijos[0],
      año2: costosFijos[1],
      año3: costosFijos[2],
      año4: costosFijos[3],
      año5: costosFijos[4],
      año6: costosFijos[5],
      año7: costosFijos[6],
      año8: costosFijos[7],
      año9: costosFijos[8],
      año10: costosFijos[9]
    },
    {
      id: "er-6",
      detalle: "Depre.const",
      año1: depreConst[0],
      año2: depreConst[1],
      año3: depreConst[2],
      año4: depreConst[3],
      año5: depreConst[4],
      año6: depreConst[5],
      año7: depreConst[6],
      año8: depreConst[7],
      año9: depreConst[8],
      año10: depreConst[9]
    },
    {
      id: "er-7",
      detalle: "Depre.Maquinas",
      año1: depreMaquinas[0],
      año2: depreMaquinas[1],
      año3: depreMaquinas[2],
      año4: depreMaquinas[3],
      año5: depreMaquinas[4],
      año6: depreMaquinas[5],
      año7: depreMaquinas[6],
      año8: depreMaquinas[7],
      año9: depreMaquinas[8],
      año10: depreMaquinas[9]
    },
    {
      id: "er-8",
      detalle: "Valor en Libros",
      año1: valorLibros[0],
      año2: valorLibros[1],
      año3: valorLibros[2],
      año4: valorLibros[3],
      año5: valorLibros[4],
      año6: valorLibros[5],
      año7: valorLibros[6],
      año8: valorLibros[7],
      año9: valorLibros[8],
      año10: valorLibros[9]
    },
    {
      id: "er-9",
      detalle: "UTILIDAD ANTES DE IMPUESTOS",
      año1: utilidadAntesImpuestos[0],
      año2: utilidadAntesImpuestos[1],
      año3: utilidadAntesImpuestos[2],
      año4: utilidadAntesImpuestos[3],
      año5: utilidadAntesImpuestos[4],
      año6: utilidadAntesImpuestos[5],
      año7: utilidadAntesImpuestos[6],
      año8: utilidadAntesImpuestos[7],
      año9: utilidadAntesImpuestos[8],
      año10: utilidadAntesImpuestos[9]
    },
    {
      id: "er-10",
      detalle: "Impuestos",
      año1: impuestos[0],
      año2: impuestos[1],
      año3: impuestos[2],
      año4: impuestos[3],
      año5: impuestos[4],
      año6: impuestos[5],
      año7: impuestos[6],
      año8: impuestos[7],
      año9: impuestos[8],
      año10: impuestos[9]
    },
    {
      id: "er-11",
      detalle: "Utilidad Neta",
      año1: utilidadNeta[0],
      año2: utilidadNeta[1],
      año3: utilidadNeta[2],
      año4: utilidadNeta[3],
      año5: utilidadNeta[4],
      año6: utilidadNeta[5],
      año7: utilidadNeta[6],
      año8: utilidadNeta[7],
      año9: utilidadNeta[8],
      año10: utilidadNeta[9]
    },
    {
      id: "er-12",
      detalle: "Depre.Const",
      año1: depreConstPost[0],
      año2: depreConstPost[1],
      año3: depreConstPost[2],
      año4: depreConstPost[3],
      año5: depreConstPost[4],
      año6: depreConstPost[5],
      año7: depreConstPost[6],
      año8: depreConstPost[7],
      año9: depreConstPost[8],
      año10: depreConstPost[9]
    },
    {
      id: "er-13",
      detalle: "Depre.Maquinas",
      año1: depreMaquinasPost[0],
      año2: depreMaquinasPost[1],
      año3: depreMaquinasPost[2],
      año4: depreMaquinasPost[3],
      año5: depreMaquinasPost[4],
      año6: depreMaquinasPost[5],
      año7: depreMaquinasPost[6],
      año8: depreMaquinasPost[7],
      año9: depreMaquinasPost[8],
      año10: depreMaquinasPost[9]
    },
    {
      id: "er-14",
      detalle: "Valor en Libros",
      año1: valorLibrosPost[0],
      año2: valorLibrosPost[1],
      año3: valorLibrosPost[2],
      año4: valorLibrosPost[3],
      año5: valorLibrosPost[4],
      año6: valorLibrosPost[5],
      año7: valorLibrosPost[6],
      año8: valorLibrosPost[7],
      año9: valorLibrosPost[8],
      año10: valorLibrosPost[9]
    },
    {
      id: "er-15",
      detalle: "Terreno",
      año1: 0,
      año2: 0,
      año3: 0,
      año4: 0,
      año5: 0,
      año6: 0,
      año7: 0,
      año8: 0,
      año9: 0,
      año10: 0
    },
    {
      id: "er-16",
      detalle: "Construccion",
      año1: 0,
      año2: 0,
      año3: 0,
      año4: 0,
      año5: 0,
      año6: 0,
      año7: 0,
      año8: 0,
      año9: 0,
      año10: 0
    },
    {
      id: "er-17",
      detalle: "Maquinaria",
      año1: maquinariaArray[0],
      año2: maquinariaArray[1],
      año3: maquinariaArray[2],
      año4: maquinariaArray[3],
      año5: maquinariaArray[4],
      año6: maquinariaArray[5],
      año7: maquinariaArray[6],
      año8: maquinariaArray[7],
      año9: maquinariaArray[8],
      año10: maquinariaArray[9]
    },
    {
      id: "er-18",
      detalle: "Capital de trabajo",
      año1: capitalTrabajo[0],
      año2: capitalTrabajo[1],
      año3: capitalTrabajo[2],
      año4: capitalTrabajo[3],
      año5: capitalTrabajo[4],
      año6: capitalTrabajo[5],
      año7: capitalTrabajo[6],
      año8: capitalTrabajo[7],
      año9: capitalTrabajo[8],
      año10: capitalTrabajo[9]
    },
    {
      id: "er-19",
      detalle: "Flujo del proyecto",
      año1: flujoProyecto[0],
      año2: flujoProyecto[1],
      año3: flujoProyecto[2],
      año4: flujoProyecto[3],
      año5: flujoProyecto[4],
      año6: flujoProyecto[5],
      año7: flujoProyecto[6],
      año8: flujoProyecto[7],
      año9: flujoProyecto[8],
      año10: flujoProyecto[9]
    },
    {
      id: "er-20",
      detalle: "ROI",
      año1: roi[0],
      año2: roi[1],
      año3: roi[2],
      año4: roi[3],
      año5: roi[4],
      año6: roi[5],
      año7: roi[6],
      año8: roi[7],
      año9: roi[8],
      año10: roi[9]
    }
  ];
};

export const calculateFlujoEfectivo = (
  estadoResultados: EstadoResultadosRow[],
  inversiones: InversionRow[]
): FlujoEfectivoRow[] => {
  // Simplificado, basado en estado de resultados
  const inversionInicial = inversiones.reduce((sum, inv) => sum + inv.inversionTotal, 0);

  return [
    {
      id: "fe-1",
      detalle: "Inversión Inicial",
      año0: -inversionInicial,
      año1: 0,
      año2: 0,
      año3: 0,
      año4: 0,
      año5: 0
    },
    {
      id: "fe-2",
      detalle: "Utilidad Neta",
      año0: 0,
      año1: estadoResultados.find(er => er.detalle === "UTILIDAD NETA")?.año1 || 0,
      año2: estadoResultados.find(er => er.detalle === "UTILIDAD NETA")?.año2 || 0,
      año3: 0,
      año4: 0,
      año5: 0
    },
    {
      id: "fe-3",
      detalle: "Depreciación",
      año0: 0,
      año1: estadoResultados.find(er => er.detalle === "Depreciacion - equipo de reparto")?.año1 || 0,
      año2: 0,
      año3: 0,
      año4: 0,
      año5: 0
    },
    {
      id: "fe-4",
      detalle: "Flujo de Efectivo",
      año0: -inversionInicial,
      año1: (estadoResultados.find(er => er.detalle === "UTILIDAD NETA")?.año1 || 0) + (estadoResultados.find(er => er.detalle === "Depreciacion - equipo de reparto")?.año1 || 0),
      año2: estadoResultados.find(er => er.detalle === "UTILIDAD NETA")?.año2 || 0,
      año3: 0,
      año4: 0,
      año5: 0
    }
  ];
};

export const calculateRazonesFinancieras = (
  estadoResultados: EstadoResultadosRow[],
  flujoEfectivo: FlujoEfectivoRow[]
): RazonesFinancierasRow[] => {
  // Simplificado, calcular algunas razones
  const utilidadNeta1 = estadoResultados.find(er => er.detalle === "UTILIDAD NETA")?.año1 || 0;
  const ventas1 = estadoResultados.find(er => er.detalle === "ingresos por ventas")?.año1 || 0;
  const roi1 = ventas1 !== 0 ? (utilidadNeta1 / ventas1) * 100 : 0;

  return [
    {
      id: "rf-1",
      razon: "ROI",
      año1: roi1,
      año2: 0,
      año3: 0,
      año4: 0,
      año5: 0
    },
    {
      id: "rf-2",
      razon: "VAN",
      año1: flujoEfectivo.find(fe => fe.detalle === "Flujo de Efectivo")?.año1 || 0,
      año2: 0,
      año3: 0,
      año4: 0,
      año5: 0
    }
  ];
};
