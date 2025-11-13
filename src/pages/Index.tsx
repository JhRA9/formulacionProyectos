import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import { EditDialog } from "@/components/EditDialog";
import { toast } from "sonner";
import { 
  Users, 
  Package, 
  Wrench, 
  DollarSign, 
  Calculator,
  Building2,
  TrendingDown,
  BarChart3,
  LineChart,
  Percent
} from "lucide-react";
import {
  personalYear1 as initialPersonal,
  materiaPrima as initialMateriaPrima,
  equipos as initialEquipos,
  inversiones as initialInversiones,
  depreciacion as initialDepreciacion
} from "@/data/initial-data";
import {
  calculateDepreciacion,
  calculateAmortizacion,
  calculateEstadoResultados,
  calculateFlujoEfectivo,
  calculateRazonesFinancieras
} from "@/utils/calculations.ts";
import { PersonalRow, MateriaPrimaRow, EquipoRow, InversionRow, AmortizacionRow, DepreciacionRow, EstadoResultadosRow, FlujoEfectivoRow, RazonesFinancierasRow } from "@/types/excel-data";

const Index = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const [personal, setPersonal] = useState<PersonalRow[]>(initialPersonal);
  const [materiaPrima, setMateriaPrima] = useState<MateriaPrimaRow[]>(initialMateriaPrima);
  const [equipos, setEquipos] = useState<EquipoRow[]>(initialEquipos);
  const [inversiones, setInversiones] = useState<InversionRow[]>(initialInversiones);

  // Estados calculados
  const [depreciacion, setDepreciacion] = useState<DepreciacionRow[]>(initialDepreciacion);
  const [amortizacion, setAmortizacion] = useState<AmortizacionRow[]>([]);
  const [estadoResultados, setEstadoResultados] = useState<EstadoResultadosRow[]>([]);
  const [flujoEfectivo, setFlujoEfectivo] = useState<FlujoEfectivoRow[]>([]);
  const [razonesFinancieras, setRazonesFinancieras] = useState<RazonesFinancierasRow[]>([]);

  // Editable state for Estado de Resultados
  const [editableEstadoResultados, setEditableEstadoResultados] = useState<EstadoResultadosRow[]>([]);

  // New state for loan info inputs
  const [bank, setBank] = useState("Banco XYZ");
  const [capital, setCapital] = useState(100819821);
  const [periodo, setPeriodo] = useState(12);
  const [tasa, setTasa] = useState(18);

  // New state for Materia Prima calculations
  const [produccion, setProduccion] = useState(72000);
  const [lotes, setLotes] = useState(1);

  // Calculated payment per period
  const calculatePagoPorPeriodo = (capital: number, tasa: number, periodo: number) => {
    if (periodo === 0) return 0;
    const tasaMensual = tasa / 100 / 12;
    const pago = (capital * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -periodo));
    return pago;
  };

  const [pagoPorPeriodo, setPagoPorPeriodo] = useState(calculatePagoPorPeriodo(capital, tasa, periodo));

  // Update amortization table based on loan info
  const recalculateAmortizacion = (capital: number, tasa: number, periodo: number) => {
    const tasaMensual = tasa / 100 / 12;
    let saldo = capital;
    const rows: AmortizacionRow[] = [];

    for (let i = 1; i <= periodo; i++) {
      const pagoIntereses = saldo * tasaMensual;
      const pagoCapital = pagoPorPeriodo - pagoIntereses;
      saldo = saldo - pagoCapital;

      rows.push({
        id: `amort-${i}`,
        año: i,
        pagoPeriodico: pagoPorPeriodo,
        pagoIntereses: pagoIntereses,
        pagoCapital: pagoCapital,
        saldo: saldo > 0 ? saldo : 0,
      });
    }
    setAmortizacion(rows);
  };

  // Recalculate amortization whenever capital, tasa or periodo changes
  React.useEffect(() => {
    const pago = calculatePagoPorPeriodo(capital, tasa, periodo);
    setPagoPorPeriodo(pago);
    recalculateAmortizacion(capital, tasa, periodo);
  }, [capital, tasa, periodo]);

  // Calcular tablas derivadas cuando cambian las tablas base
  React.useEffect(() => {
    const newAmortizacion = calculateAmortizacion(inversiones);
    setAmortizacion(newAmortizacion);

    const newEstadoResultados = calculateEstadoResultados(personal, materiaPrima, depreciacion, newAmortizacion, inversiones);
    setEstadoResultados(newEstadoResultados);

    // Always update editable state
    setEditableEstadoResultados(newEstadoResultados);

    const newFlujoEfectivo = calculateFlujoEfectivo(newEstadoResultados, inversiones);
    setFlujoEfectivo(newFlujoEfectivo);

    const newRazonesFinancieras = calculateRazonesFinancieras(newEstadoResultados, newFlujoEfectivo);
    setRazonesFinancieras(newRazonesFinancieras);
  }, [personal, materiaPrima, depreciacion, inversiones]);

  // Recalculate when editableEstadoResultados changes
  React.useEffect(() => {
    if (editableEstadoResultados.length > 0) {
      // Since calculateEstadoResultados now calculates everything internally, we just need to recalculate
      const newEstadoResultados = calculateEstadoResultados(personal, materiaPrima, depreciacion, amortizacion, inversiones);
      setEstadoResultados(newEstadoResultados);

      const newFlujoEfectivo = calculateFlujoEfectivo(newEstadoResultados, inversiones);
      setFlujoEfectivo(newFlujoEfectivo);

      const newRazonesFinancieras = calculateRazonesFinancieras(newEstadoResultados, newFlujoEfectivo);
      setRazonesFinancieras(newRazonesFinancieras);
    }
  }, [editableEstadoResultados, personal, materiaPrima, depreciacion, amortizacion, inversiones]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState<string>("");
  const [editingData, setEditingData] = useState<Record<string, unknown> | null>(null);

  // Categorize personal by areas
  const administrativaDescriptions = [
    'Gerente inventario', 'Coordinador de control de inventarios', 'Auxiliar de almacen', 'Auxiliar de Calidad', 'Auxiliar de Inventarios', 'Coordinador de compras/abastecimiento', 'Analista de Mercado', 'Gerente de Finanzas', 'Analista de Costos o Presupuestos', 'Contadora', 'Auxiliar de Caja'
  ];
  const ventasDescriptions = [
    'Gerente de Marketing', 'Coordinador de Publicidad y Medios', 'Coordinador de Estrategias Comerciales', 'Coordinador de Servicio al Cliente'
  ];
  const produccionDescriptions = [
    'Gerente de Operaciones de Cocina', 'Coordinador de Producción', 'Coordinador de Calidad y Seguridad Alimentaria', 'Auxiliar de Control de Calidad', 'Pastelero', 'Cocinero'
  ];

  // Categorize equipos by types
  const maquinariaDescriptions = [
    'Vitrina refrigerada horizontal (mostrador)', 'Vitrina refrigerada vertical - modelo A', 'Nevera vertical comercial 755 L', 'Máquina de café espresso 2 grupos', 'Molino de café profesional', 'Licuadora', 'Freidora industrial (1 un compartimiento)', 'Plancha para asar', 'Campana extractora comercial', 'Fabricador de hielo (10 kg - ejemplo)', 'Lavavajillas industrial (Claseq D3000 ej.)', 'Microondas'
  ];
  const mobiliarioOficinaDescriptions = [
    'PC (para las ordenes)', 'Escritorio ejecutivo', 'Escritorio estándar', 'Silla ergonómica ejecutiva', 'Silla ergonómica estándar', 'Archivador metálico', 'Estantería', 'Computador de escritorio', 'Impresora multifuncional', 'Teléfono fijo', 'Router + Red local', 'Aire acondicionado', 'Cafetera y dispensador de agua', 'Extintores, señalización y botiquín'
  ];
  const planMediosDescriptions = [
    'Facebook e instagram ADS', 'Volantes'
  ];

  const getPersonalByArea = () => {
    const administrativa = personal.filter(p => administrativaDescriptions.includes(p.descripcion));
    const ventas = personal.filter(p => ventasDescriptions.includes(p.descripcion));
    const produccion = personal.filter(p => produccionDescriptions.includes(p.descripcion));

    const totalAdministrativa = administrativa.reduce((sum, p) => sum + p.total, 0);
    const totalVentas = ventas.reduce((sum, p) => sum + p.total, 0);
    const totalProduccion = produccion.reduce((sum, p) => sum + p.total, 0);

    return { administrativa, ventas, produccion, totalAdministrativa, totalVentas, totalProduccion };
  };

  const getEquiposByType = () => {
    const maquinaria = equipos.filter(e => maquinariaDescriptions.includes(e.descripcion));
    const mobiliarioOficina = equipos.filter(e => mobiliarioOficinaDescriptions.includes(e.descripcion));
    const planMedios = equipos.filter(e => planMediosDescriptions.includes(e.descripcion));

    const totalMaquinaria = maquinaria.reduce((sum, e) => sum + e.total, 0);
    const totalMobiliarioOficina = mobiliarioOficina.reduce((sum, e) => sum + e.total, 0);
    const totalPlanMedios = planMedios.reduce((sum, e) => sum + e.total, 0);

    return { maquinaria, mobiliarioOficina, planMedios, totalMaquinaria, totalMobiliarioOficina, totalPlanMedios };
  };

  const personalColumns = [
    { key: 'descripcion', label: 'Descripción' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'sueldoMensual', label: 'Sueldo Mensual' },
    { key: 'sueldoAnual', label: 'Sueldo Anual' },
    { key: 'primas', label: 'Primas' },
    { key: 'cesantias', label: 'Cesantías' },
    { key: 'interesesCesantias', label: 'Intereses Cesantías' },
    { key: 'salud', label: 'Salud' },
    { key: 'pension', label: 'Pensión' },
    { key: 'arl', label: 'ARL' },
    { key: 'vacaciones', label: 'Vacaciones' },
    { key: 'total', label: 'Total' }
  ];

  const materiaPrimaColumns = [
    { key: 'descripcion', label: 'Descripción' },
    { key: 'cantidad', label: 'Cantidad (Kg)' },
    { key: 'costoUnitario', label: 'Costo Unitario' },
    { key: 'costoTotal', label: 'Costo Total' }
  ];

  const equiposColumns = [
    { key: 'descripcion', label: 'Descripción' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'costoUnitario', label: 'Costo Unitario' },
    { key: 'total', label: 'Total' }
  ];

  const inversionesColumns = [
    { key: 'descripcion', label: 'Descripción' },
    { key: 'inversionTotal', label: 'Inversión Total' },
    { key: 'fondosPropios', label: 'Fondos Propios' },
    { key: 'banco', label: 'Banco' },
    { key: 'otrasFuentes', label: 'Otras Fuentes' }
  ];

  const amortizacionColumns = [
    { key: 'año', label: 'Año' },
    { key: 'pagoPeriodico', label: 'Pago Periódico' },
    { key: 'pagoIntereses', label: 'Pago Intereses' },
    { key: 'pagoCapital', label: 'Pago Capital' },
    { key: 'saldo', label: 'Saldo' }
  ];

  const depreciacionColumns = [
    { key: 'activos', label: 'Activos' },
    { key: 'valorActivos', label: 'Valor de los Activos' },
    { key: 'vidaUtil', label: 'Vida Útil' },
    { key: 'depreciacion', label: 'Depreciación' },
    { key: 'porcentajeSalvamento', label: 'Valor de Salvamento %' },
    { key: 'valorSalvamento', label: 'Valor de Salvamento $' }
  ];

  const estadoResultadosColumns = [
    { key: 'detalle', label: 'Detalle' },
    { key: 'año1', label: 'Año 1' },
    { key: 'año2', label: 'Año 2' },
    { key: 'año3', label: 'Año 3' },
    { key: 'año4', label: 'Año 4' },
    { key: 'año5', label: 'Año 5' },
    { key: 'año6', label: 'Año 6' },
    { key: 'año7', label: 'Año 7' },
    { key: 'año8', label: 'Año 8' },
    { key: 'año9', label: 'Año 9' },
    { key: 'año10', label: 'Año 10' }
  ];

  const flujoEfectivoColumns = [
    { key: 'detalle', label: 'Detalle' },
    { key: 'año0', label: 'Año 0' },
    { key: 'año1', label: 'Año 1' },
    { key: 'año2', label: 'Año 2' },
    { key: 'año3', label: 'Año 3' },
    { key: 'año4', label: 'Año 4' },
    { key: 'año5', label: 'Año 5' }
  ];

  const razonesFinancierasColumns = [
    { key: 'razon', label: 'Razón Financiera' },
    { key: 'año1', label: 'Año 1' },
    { key: 'año2', label: 'Año 2' },
    { key: 'año3', label: 'Año 3' },
    { key: 'año4', label: 'Año 4' },
    { key: 'año5', label: 'Año 5' }
  ];

  const personalFields = [
    { key: 'descripcion', label: 'Descripción', type: 'text' as const },
    { key: 'cantidad', label: 'Cantidad', type: 'number' as const },
    { key: 'sueldoMensual', label: 'Sueldo Mensual', type: 'number' as const },
    { key: 'sueldoAnual', label: 'Sueldo Anual', type: 'number' as const },
    { key: 'primas', label: 'Primas', type: 'number' as const },
    { key: 'cesantias', label: 'Cesantías', type: 'number' as const },
    { key: 'interesesCesantias', label: 'Intereses Cesantías', type: 'number' as const },
    { key: 'salud', label: 'Salud (8.5%)', type: 'number' as const },
    { key: 'pension', label: 'Pensión (12%)', type: 'number' as const },
    { key: 'arl', label: 'ARL (0.522%)', type: 'number' as const },
    { key: 'vacaciones', label: 'Vacaciones', type: 'number' as const },
    { key: 'total', label: 'Total', type: 'number' as const }
  ];

  const materiaPrimaFields = [
    { key: 'descripcion', label: 'Descripción', type: 'text' as const },
    { key: 'cantidad', label: 'Cantidad (Kg)', type: 'number' as const },
    { key: 'costoUnitario', label: 'Costo Unitario', type: 'number' as const },
    { key: 'costoTotal', label: 'Costo Total', type: 'number' as const }
  ];

  const equiposFields = [
    { key: 'descripcion', label: 'Descripción', type: 'text' as const },
    { key: 'cantidad', label: 'Cantidad', type: 'number' as const },
    { key: 'costoUnitario', label: 'Costo Unitario', type: 'number' as const },
    { key: 'total', label: 'Total', type: 'number' as const }
  ];

  const inversionesFields = [
    { key: 'descripcion', label: 'Descripción', type: 'text' as const },
    { key: 'inversionTotal', label: 'Inversión Total', type: 'number' as const },
    { key: 'fondosPropios', label: 'Fondos Propios', type: 'number' as const },
    { key: 'banco', label: 'Banco', type: 'number' as const },
    { key: 'otrasFuentes', label: 'Otras Fuentes', type: 'number' as const }
  ];

  const amortizacionFields = [
    { key: 'año', label: 'Año', type: 'number' as const },
    { key: 'pagoPeriodico', label: 'Pago Periódico', type: 'number' as const },
    { key: 'pagoIntereses', label: 'Pago Intereses', type: 'number' as const },
    { key: 'pagoCapital', label: 'Pago Capital', type: 'number' as const },
    { key: 'saldo', label: 'Saldo', type: 'number' as const }
  ];

  const depreciacionFields = [
    { key: 'activos', label: 'Activos', type: 'text' as const },
    { key: 'valorActivos', label: 'Valor de los Activos', type: 'number' as const },
    { key: 'vidaUtil', label: 'Vida Útil', type: 'number' as const },
    { key: 'depreciacion', label: 'Depreciación', type: 'number' as const },
    { key: 'porcentajeSalvamento', label: 'Valor de Salvamento %', type: 'number' as const },
    { key: 'valorSalvamento', label: 'Valor de Salvamento $', type: 'number' as const }
  ];

  const estadoResultadosFields = [
    { key: 'detalle', label: 'Detalle', type: 'text' as const },
    { key: 'año0', label: 'Año 0', type: 'number' as const },
    { key: 'año1', label: 'Año 1', type: 'number' as const },
    { key: 'año2', label: 'Año 2', type: 'number' as const },
    { key: 'año3', label: 'Año 3', type: 'number' as const },
    { key: 'año4', label: 'Año 4', type: 'number' as const },
    { key: 'año5', label: 'Año 5', type: 'number' as const },
    { key: 'año6', label: 'Año 6', type: 'number' as const },
    { key: 'año7', label: 'Año 7', type: 'number' as const },
    { key: 'año8', label: 'Año 8', type: 'number' as const },
    { key: 'año9', label: 'Año 9', type: 'number' as const },
    { key: 'año10', label: 'Año 10', type: 'number' as const }

  ];

  const flujoEfectivoFields = [
    { key: 'detalle', label: 'Detalle', type: 'text' as const },
    { key: 'año0', label: 'Año 0', type: 'number' as const },
    { key: 'año1', label: 'Año 1', type: 'number' as const },
    { key: 'año2', label: 'Año 2', type: 'number' as const },
    { key: 'año3', label: 'Año 3', type: 'number' as const },
    { key: 'año4', label: 'Año 4', type: 'number' as const },
    { key: 'año5', label: 'Año 5', type: 'number' as const }
  ];

  const razonesFinancierasFields = [
    { key: 'razon', label: 'Razón Financiera', type: 'text' as const },
    { key: 'año1', label: 'Año 1', type: 'number' as const },
    { key: 'año2', label: 'Año 2', type: 'number' as const },
    { key: 'año3', label: 'Año 3', type: 'number' as const },
    { key: 'año4', label: 'Año 4', type: 'number' as const },
    { key: 'año5', label: 'Año 5', type: 'number' as const }
  ];

  const handleEdit = (table: string, id: string) => {
    // Solo permitir edición en tablas base
    const baseTables = ['personal', 'materiaPrima', 'equipos', 'inversiones'];

    if (!baseTables.includes(table)) {
      toast.error('Esta tabla es de solo lectura. Los valores se calculan automáticamente.');
      return;
    }

    let data;
    switch (table) {
      case 'personal':
        data = personal.find(row => row.id === id);
        break;
      case 'materiaPrima':
        data = materiaPrima.find(row => row.id === id);
        break;
      case 'equipos':
        data = equipos.find(row => row.id === id);
        break;
      case 'inversiones':
        data = inversiones.find(row => row.id === id);
        break;
    }
    setEditingData(data);
    setCurrentTable(table);
    setEditDialogOpen(true);
  };

  const handleEstadoResultadosCellEdit = (rowId: string, columnKey: string, value: number) => {
    setEditableEstadoResultados(prev =>
      prev.map(row =>
        row.id === rowId
          ? { ...row, [columnKey]: value }
          : row
      )
    );
  };

  const handleAdd = (table: string) => {
    // Solo permitir agregar en tablas base
    const baseTables = ['personal', 'materiaPrima', 'equipos', 'inversiones'];

    if (!baseTables.includes(table)) {
      toast.error('Esta tabla es de solo lectura. Los valores se calculan automáticamente.');
      return;
    }

    setEditingData(null);
    setCurrentTable(table);
    setEditDialogOpen(true);
  };

  const handleDelete = (table: string, id: string) => {
    // Solo permitir eliminación en tablas base
    const baseTables = ['personal', 'materiaPrima', 'equipos', 'inversiones'];

    if (!baseTables.includes(table)) {
      toast.error('Esta tabla es de solo lectura. Los valores se calculan automáticamente.');
      return;
    }

    switch (table) {
      case 'personal':
        setPersonal(personal.filter(row => row.id !== id));
        break;
      case 'materiaPrima':
        setMateriaPrima(materiaPrima.filter(row => row.id !== id));
        break;
      case 'equipos':
        setEquipos(equipos.filter(row => row.id !== id));
        break;
      case 'inversiones':
        setInversiones(inversiones.filter(row => row.id !== id));
        break;
    }
    toast.success('Registro eliminado correctamente');
  };

  const handleSave = (data: Record<string, unknown>) => {
    const isEditing = editingData !== null;

    // Solo permitir edición en tablas base
    const baseTables = ['personal', 'materiaPrima', 'equipos', 'inversiones'];

    if (!baseTables.includes(currentTable)) {
      toast.error('Esta tabla es de solo lectura. Los valores se calculan automáticamente.');
      return;
    }

    switch (currentTable) {
      case 'personal':
        // Recalculate total for personal
        const personalData = data as unknown as PersonalRow;
        const sueldoAnual = personalData.sueldoMensual * 12;
        const total = sueldoAnual + personalData.primas + personalData.cesantias + personalData.interesesCesantias + personalData.salud + personalData.pension + personalData.arl + personalData.vacaciones;
        const updatedPersonalData = { ...personalData, sueldoAnual, total };

        if (isEditing) {
          setPersonal(personal.map(row => row.id === data.id ? updatedPersonalData : row));
        } else {
          setPersonal([...personal, updatedPersonalData]);
        }
        break;
      case 'materiaPrima':
        // Recalculate costoTotal for materiaPrima
        const materiaPrimaData = data as unknown as MateriaPrimaRow;
        const costoTotal = materiaPrimaData.cantidad * materiaPrimaData.costoUnitario;
        const updatedMateriaPrimaData = { ...materiaPrimaData, costoTotal };

        if (isEditing) {
          setMateriaPrima(materiaPrima.map(row => row.id === data.id ? updatedMateriaPrimaData : row));
        } else {
          setMateriaPrima([...materiaPrima, updatedMateriaPrimaData]);
        }
        break;
      case 'equipos':
        // Recalculate total for equipos
        const equiposData = data as unknown as EquipoRow;
        const totalEquipos = equiposData.cantidad * equiposData.costoUnitario;
        const updatedEquiposData = { ...equiposData, total: totalEquipos };

        if (isEditing) {
          setEquipos(equipos.map(row => row.id === data.id ? updatedEquiposData : row));
        } else {
          setEquipos([...equipos, updatedEquiposData]);
        }
        break;
      case 'inversiones':
        if (isEditing) {
          setInversiones(inversiones.map(row => row.id === data.id ? data as unknown as InversionRow : row));
        } else {
          setInversiones([...inversiones, data as unknown as InversionRow]);
        }
        break;
    }

    toast.success(isEditing ? 'Registro actualizado correctamente' : 'Registro agregado correctamente');
  };

  const getFields = () => {
    switch (currentTable) {
      case 'personal': return personalFields;
      case 'materiaPrima': return materiaPrimaFields;
      case 'equipos': return equiposFields;
      case 'inversiones': return inversionesFields;
      case 'amortizacion': return amortizacionFields;
      case 'depreciacion': return depreciacionFields;
      case 'estadoResultados': return estadoResultadosFields;
      case 'flujoEfectivo': return flujoEfectivoFields;
      case 'razonesFinancieras': return razonesFinancierasFields;
      default: return [];
    }
  };

  const getDialogTitle = () => {
    const action = editingData ? 'Editar' : 'Agregar';
    switch (currentTable) {
      case 'personal': return `${action} Personal`;
      case 'materiaPrima': return `${action} Materia Prima`;
      case 'equipos': return `${action} Equipo`;
      case 'inversiones': return `${action} Inversión`;
      case 'amortizacion': return `${action} Amortización`;
      case 'depreciacion': return `${action} Depreciación`;
      case 'estadoResultados': return `${action} Estado de Resultados`;
      case 'flujoEfectivo': return `${action} Flujo de Efectivo`;
      case 'razonesFinancieras': return `${action} Razón Financiera`;
      default: return action;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">ECOLATTE</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestión de Datos Financieros</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <div className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 bg-muted/50 p-1 rounded-lg gap-1 h-auto">
              <TabsTrigger
                value="personal"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-4 w-4" />
                <span className="hidden xs:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger
                value="materiaPrima"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="h-4 w-4" />
                <span className="hidden xs:inline">Materia Prima</span>
              </TabsTrigger>
              <TabsTrigger
                value="equipos"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Wrench className="h-4 w-4" />
                <span className="hidden xs:inline">Equipos</span>
              </TabsTrigger>
              <TabsTrigger
                value="inversiones"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden xs:inline">Inversiones</span>
              </TabsTrigger>
              <TabsTrigger
                value="amortizacion"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden xs:inline">Amortización</span>
              </TabsTrigger>
              <TabsTrigger
                value="depreciacion"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingDown className="h-4 w-4" />
                <span className="hidden xs:inline">Depreciación</span>
              </TabsTrigger>
              <TabsTrigger
                value="estadoResultados"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden xs:inline">Estado Resultados</span>
              </TabsTrigger>
              <TabsTrigger
                value="flujoEfectivo"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LineChart className="h-4 w-4" />
                <span className="hidden xs:inline">Flujo Efectivo</span>
              </TabsTrigger>
              <TabsTrigger
                value="razonesFinancieras"
                className="flex items-center gap-1 px-2 py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Percent className="h-4 w-4" />
                <span className="hidden xs:inline">Razones Financieras</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="personal" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Planilla de Personal</h2>
                  <p className="text-sm text-muted-foreground">Gestión de nómina y recursos humanos</p>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Área Administrativa</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${getPersonalByArea().totalAdministrativa.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Área de Ventas</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${getPersonalByArea().totalVentas.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">Área de Producción</h3>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    ${getPersonalByArea().totalProduccion.toLocaleString()}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="administrativa" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="administrativa">Área Administrativa</TabsTrigger>
                  <TabsTrigger value="ventas">Área de Ventas</TabsTrigger>
                  <TabsTrigger value="produccion">Área de Producción</TabsTrigger>
                </TabsList>
                <TabsContent value="administrativa" className="mt-4">
                  <DataTable
                    columns={personalColumns}
                    data={personal.filter(p => administrativaDescriptions.includes(p.descripcion))}
                    onEdit={(id) => handleEdit('personal', id)}
                    onDelete={(id) => handleDelete('personal', id)}
                    onAdd={() => handleAdd('personal')}
                  />
                </TabsContent>
                <TabsContent value="ventas" className="mt-4">
                  <DataTable
                    columns={personalColumns}
                    data={personal.filter(p => ventasDescriptions.includes(p.descripcion))}
                    onEdit={(id) => handleEdit('personal', id)}
                    onDelete={(id) => handleDelete('personal', id)}
                    onAdd={() => handleAdd('personal')}
                  />
                </TabsContent>
                <TabsContent value="produccion" className="mt-4">
                  <DataTable
                    columns={personalColumns}
                    data={personal.filter(p => produccionDescriptions.includes(p.descripcion))}
                    onEdit={(id) => handleEdit('personal', id)}
                    onDelete={(id) => handleDelete('personal', id)}
                    onAdd={() => handleAdd('personal')}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="materiaPrima" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Package className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Materia Prima</h2>
                  <p className="text-sm text-muted-foreground">Control de insumos y materiales</p>
                </div>
              </div>

              {/* Summary boxes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Valor Total</h3>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(materiaPrima.reduce((sum, mp) => sum + mp.costoTotal, 0))}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Costos Indirectos</h3>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(materiaPrima.reduce((sum, mp) => sum + mp.costoTotal, 0) * 0.15)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Producción</h3>
                  <input
                    type="number"
                    value={produccion}
                    onChange={(e) => setProduccion(Number(e.target.value))}
                    className="w-full text-2xl font-bold text-foreground bg-transparent border-none outline-none"
                  />
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Lotes</h3>
                  <input
                    type="number"
                    value={lotes}
                    onChange={(e) => setLotes(Number(e.target.value))}
                    className="w-full text-2xl font-bold text-foreground bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              {/* Total calculation box */}
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 mb-6">
                <h3 className="text-sm font-medium text-primary mb-2">Total (Lotes × Valor Total × Producción)</h3>
                <p className="text-3xl font-bold text-primary">{formatCurrency(lotes * materiaPrima.reduce((sum, mp) => sum + mp.costoTotal, 0) * produccion)}</p>
              </div>

              <DataTable
                columns={materiaPrimaColumns}
                data={materiaPrima}
                onEdit={(id) => handleEdit('materiaPrima', id)}
                onDelete={(id) => handleDelete('materiaPrima', id)}
                onAdd={() => handleAdd('materiaPrima')}
              />
            </div>
          </TabsContent>

          <TabsContent value="equipos" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Wrench className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Maquinaria y Equipos</h2>
                  <p className="text-sm text-muted-foreground">Inventario de activos fijos</p>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Maquinaria</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${getEquiposByType().totalMaquinaria.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Mobiliario y Equipos de Oficina</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${getEquiposByType().totalMobiliarioOficina.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">Plan de Medios</h3>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    ${getEquiposByType().totalPlanMedios.toLocaleString()}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="maquinaria" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="maquinaria">Maquinaria</TabsTrigger>
                  <TabsTrigger value="mobiliarioOficina">Mobiliario y Equipos de Oficina</TabsTrigger>
                  <TabsTrigger value="planMedios">Plan de Medios</TabsTrigger>
                </TabsList>
                <TabsContent value="maquinaria" className="mt-4">
                  <DataTable
                    columns={equiposColumns}
                    data={equipos.filter(e => maquinariaDescriptions.includes(e.descripcion))}
                    onEdit={(id) => handleEdit('equipos', id)}
                    onDelete={(id) => handleDelete('equipos', id)}
                    onAdd={() => handleAdd('equipos')}
                  />
                </TabsContent>
                <TabsContent value="mobiliarioOficina" className="mt-4">
                  <DataTable
                    columns={equiposColumns}
                    data={equipos.filter(e => mobiliarioOficinaDescriptions.includes(e.descripcion))}
                    onEdit={(id) => handleEdit('equipos', id)}
                    onDelete={(id) => handleDelete('equipos', id)}
                    onAdd={() => handleAdd('equipos')}
                  />
                </TabsContent>
                <TabsContent value="planMedios" className="mt-4">
                  <DataTable
                    columns={equiposColumns}
                    data={equipos.filter(e => planMediosDescriptions.includes(e.descripcion))}
                    onEdit={(id) => handleEdit('equipos', id)}
                    onDelete={(id) => handleDelete('equipos', id)}
                    onAdd={() => handleAdd('equipos')}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="inversiones" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Plan de Inversiones</h2>
                  <p className="text-sm text-muted-foreground">Distribución de capital y financiamiento</p>
                </div>
              </div>

              {/* Summary boxes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">100%</p>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Inversiones</h3>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(inversiones.reduce((sum, inv) => sum + inv.inversionTotal, 0))}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">55%</p>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Fondos Propios</h3>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(inversiones.reduce((sum, inv) => sum + inv.fondosPropios, 0))}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">30%</p>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Banco</h3>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(inversiones.reduce((sum, inv) => sum + inv.banco, 0))}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">15%</p>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Otras Fuentes</h3>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(inversiones.reduce((sum, inv) => sum + inv.otrasFuentes, 0))}</p>
                </div>
              </div>

              <DataTable
                columns={inversionesColumns}
                data={inversiones}
                onEdit={(id) => handleEdit('inversiones', id)}
                onDelete={(id) => handleDelete('inversiones', id)}
                onAdd={() => handleAdd('inversiones')}
              />
            </div>
          </TabsContent>

          <TabsContent value="amortizacion" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm space-y-6">
              <div className="p-4 bg-muted rounded-md">
                <h3 className="text-lg font-semibold mb-4">Información del Préstamo</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="font-semibold block mb-1" htmlFor="bank">BANK:</label>
                    <input
                      id="bank"
                      type="text"
                      className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1" htmlFor="capital">CAPITAL:</label>
                    <input
                      id="capital"
                      type="number"
                      className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={capital}
                      onChange={(e) => setCapital(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1" htmlFor="periodo">PERIODO:</label>
                    <input
                      id="periodo"
                      type="number"
                      className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={periodo}
                      onChange={(e) => setPeriodo(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1" htmlFor="tasa">TASA (%):</label>
                    <input
                      id="tasa"
                      type="number"
                      step="0.01"
                      className="w-full rounded border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={tasa}
                      onChange={(e) => setTasa(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold">Pago por Período Calculado: <span className="text-primary">${pagoPorPeriodo.toFixed(2)}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Tabla de Amortización</h2>
                  <p className="text-sm text-muted-foreground">Cálculo de pagos de préstamo</p>
                </div>
              </div>
              <DataTable
                columns={amortizacionColumns}
                data={amortizacion}
                onEdit={() => {}}
                onDelete={() => {}}
                onAdd={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="depreciacion" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Tabla de Depreciación</h2>
                  <p className="text-sm text-muted-foreground">Depreciación de activos fijos</p>
                </div>
              </div>
              <DataTable
                columns={depreciacionColumns}
                data={depreciacion}
                onEdit={() => {}}
                onDelete={() => {}}
                onAdd={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="estadoResultados" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Estado de Resultados</h2>
                  <p className="text-sm text-muted-foreground">Análisis de ingresos y gastos proyectados (haz clic en las celdas editables para modificar)</p>
                </div>
              </div>
              <DataTable
                columns={estadoResultadosColumns}
                data={editableEstadoResultados}
                onEdit={() => {}}
                onDelete={() => {}}
                onAdd={() => {}}
                editableRowIds={["er-2", "er-3", "er-4", "er-5", "er-6", "er-7", "er-8", "er-9", "er-10", "er-11", "er-12", "er-13", "er-14", "er-15", "er-16", "er-17", "er-18", "er-19", "er-20"]}
                onCellEdit={handleEstadoResultadosCellEdit}
              />
            </div>
          </TabsContent>

          <TabsContent value="flujoEfectivo" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-success/10">
                  <LineChart className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Estado de Flujo de Efectivo</h2>
                  <p className="text-sm text-muted-foreground">Proyección de flujo de caja</p>
                </div>
              </div>
              <DataTable
                columns={flujoEfectivoColumns}
                data={flujoEfectivo}
                onEdit={() => {}}
                onDelete={() => {}}
                onAdd={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="razonesFinancieras" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Percent className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Razones Financieras</h2>
                  <p className="text-sm text-muted-foreground">Indicadores de desempeño financiero</p>
                </div>
              </div>
              <DataTable
                columns={razonesFinancierasColumns}
                data={razonesFinancieras}
                onEdit={() => {}}
                onDelete={() => {}}
                onAdd={() => {}}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        fields={getFields()}
        data={editingData}
        onSave={handleSave}
        title={getDialogTitle()}
      />
    </div>
  );
};

export default Index;
