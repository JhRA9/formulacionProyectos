export interface PersonalRow {
  id: string;
  descripcion: string;
  cantidad: number;
  sueldoMensual: number;
  sueldoAnual: number;
  primas: number;
  cesantias: number;
  interesesCesantias: number;
  salud: number;
  pension: number;
  arl: number;
  vacaciones: number;
  total: number;
}

export interface MateriaPrimaRow {
  id: string;
  descripcion: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
}

export interface EquipoRow {
  id: string;
  descripcion: string;
  cantidad: number;
  costoUnitario: number;
  total: number;
}

export interface InversionRow {
  id: string;
  descripcion: string;
  inversionTotal: number;
  fondosPropios: number;
  banco: number;
  otrasFuentes: number;
}

export interface AmortizacionRow {
  id: string;
  año: number;
  pagoPeriodico: number;
  pagoIntereses: number;
  pagoCapital: number;
  saldo: number;
}

export interface DepreciacionRow {
  id: string;
  activos: string;
  valorActivos: number;
  vidaUtil: number;
  depreciacion: number;
  porcentajeSalvamento: number;
  valorSalvamento: number;
}

export interface EstadoResultadosRow {
  id: string;
  detalle: string;
  año1: number;
  año2: number;
  año3: number;
  año4: number;
  año5: number;
}

export interface FlujoEfectivoRow {
  id: string;
  detalle: string;
  año0: number;
  año1: number;
  año2: number;
  año3: number;
  año4: number;
  año5: number;
}

export interface RazonesFinancierasRow {
  id: string;
  razon: string;
  año1: number;
  año2: number;
  año3: number;
  año4: number;
  año5: number;
}
