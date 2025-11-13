import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import { EditDialog } from "@/components/EditDialog";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-local-storage";
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
  Percent,
  Download,
  RotateCcw
} from "lucide-react";
import {
  personalYear1 as initialPersonal,
  materiaPrima as initialMateriaPrima,
  equipos as initialEquipos,
  inversiones as initialInversiones,
  amortizacion as initialAmortizacion,
  depreciacion as initialDepreciacion,
  estadoResultados as initialEstadoResultados,
  flujoEfectivo as initialFlujoEfectivo,
  razonesFinancieras as initialRazonesFinancieras
} from "@/data/initial-data";
import { PersonalRow, MateriaPrimaRow, EquipoRow, InversionRow, AmortizacionRow, DepreciacionRow, EstadoResultadosRow, FlujoEfectivoRow, RazonesFinancierasRow } from "@/types/excel-data";

const Index = () => {
  const [personal, setPersonal] = useLocalStorage<PersonalRow[]>('ecolatte_personal', initialPersonal);
  const [materiaPrima, setMateriaPrima] = useLocalStorage<MateriaPrimaRow[]>('ecolatte_materiaPrima', initialMateriaPrima);
  const [equipos, setEquipos] = useLocalStorage<EquipoRow[]>('ecolatte_equipos', initialEquipos);
  const [inversiones, setInversiones] = useLocalStorage<InversionRow[]>('ecolatte_inversiones', initialInversiones);
  const [amortizacion, setAmortizacion] = useLocalStorage<AmortizacionRow[]>('ecolatte_amortizacion', initialAmortizacion);
  const [depreciacion, setDepreciacion] = useLocalStorage<DepreciacionRow[]>('ecolatte_depreciacion', initialDepreciacion);
  const [estadoResultados, setEstadoResultados] = useLocalStorage<EstadoResultadosRow[]>('ecolatte_estadoResultados', initialEstadoResultados);
  const [flujoEfectivo, setFlujoEfectivo] = useLocalStorage<FlujoEfectivoRow[]>('ecolatte_flujoEfectivo', initialFlujoEfectivo);
  const [razonesFinancieras, setRazonesFinancieras] = useLocalStorage<RazonesFinancierasRow[]>('ecolatte_razonesFinancieras', initialRazonesFinancieras);

  // New state for loan info inputs
  const [bank, setBank] = useState("Banco XYZ");
  const [capital, setCapital] = useState(100819821);
  const [periodo, setPeriodo] = useState(12);
  const [tasa, setTasa] = useState(18);

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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState<string>("");
  const [editingData, setEditingData] = useState<Record<string, unknown> | null>(null);

  const personalColumns = [
    { key: 'descripcion', label: 'Descripción' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'sueldoMensual', label: 'Sueldo Mensual' },
    { key: 'sueldoAnual', label: 'Sueldo Anual' },
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
    { key: 'año2', label: 'Año 2' }
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
    { key: 'año1', label: 'Año 1', type: 'number' as const },
    { key: 'año2', label: 'Año 2', type: 'number' as const },
    { key: 'año3', label: 'Año 3', type: 'number' as const },
    { key: 'año4', label: 'Año 4', type: 'number' as const },
    { key: 'año5', label: 'Año 5', type: 'number' as const }
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
      case 'amortizacion':
        data = amortizacion.find(row => row.id === id);
        break;
      case 'depreciacion':
        data = depreciacion.find(row => row.id === id);
        break;
      case 'estadoResultados':
        data = estadoResultados.find(row => row.id === id);
        break;
      case 'flujoEfectivo':
        data = flujoEfectivo.find(row => row.id === id);
        break;
      case 'razonesFinancieras':
        data = razonesFinancieras.find(row => row.id === id);
        break;
    }
    setEditingData(data);
    setCurrentTable(table);
    setEditDialogOpen(true);
  };

  const handleAdd = (table: string) => {
    setEditingData(null);
    setCurrentTable(table);
    setEditDialogOpen(true);
  };

  const handleDelete = (table: string, id: string) => {
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
      case 'amortizacion':
        setAmortizacion(amortizacion.filter(row => row.id !== id));
        break;
      case 'depreciacion':
        setDepreciacion(depreciacion.filter(row => row.id !== id));
        break;
      case 'estadoResultados':
        setEstadoResultados(estadoResultados.filter(row => row.id !== id));
        break;
      case 'flujoEfectivo':
        setFlujoEfectivo(flujoEfectivo.filter(row => row.id !== id));
        break;
      case 'razonesFinancieras':
        setRazonesFinancieras(razonesFinancieras.filter(row => row.id !== id));
        break;
    }
    toast.success('Registro eliminado correctamente');
  };

  const handleSave = (data: Record<string, unknown>) => {
    const isEditing = editingData !== null;

    switch (currentTable) {
      case 'personal':
        if (isEditing) {
          setPersonal(personal.map(row => row.id === data.id ? data as unknown as PersonalRow : row));
        } else {
          setPersonal([...personal, data as unknown as PersonalRow]);
        }
        break;
      case 'materiaPrima':
        if (isEditing) {
          setMateriaPrima(materiaPrima.map(row => row.id === data.id ? data as unknown as MateriaPrimaRow : row));
        } else {
          setMateriaPrima([...materiaPrima, data as unknown as MateriaPrimaRow]);
        }
        break;
      case 'equipos':
        if (isEditing) {
          setEquipos(equipos.map(row => row.id === data.id ? data as unknown as EquipoRow : row));
        } else {
          setEquipos([...equipos, data as unknown as EquipoRow]);
        }
        break;
      case 'inversiones':
        if (isEditing) {
          setInversiones(inversiones.map(row => row.id === data.id ? data as unknown as InversionRow : row));
        } else {
          setInversiones([...inversiones, data as unknown as InversionRow]);
        }
        break;
      case 'amortizacion':
        if (isEditing) {
          setAmortizacion(amortizacion.map(row => row.id === data.id ? data as unknown as AmortizacionRow : row));
        } else {
          setAmortizacion([...amortizacion, data as unknown as AmortizacionRow]);
        }
        break;
      case 'depreciacion':
        if (isEditing) {
          setDepreciacion(depreciacion.map(row => row.id === data.id ? data as unknown as DepreciacionRow : row));
        } else {
          setDepreciacion([...depreciacion, data as unknown as DepreciacionRow]);
        }
        break;
      case 'estadoResultados':
        if (isEditing) {
          setEstadoResultados(estadoResultados.map(row => row.id === data.id ? data as unknown as EstadoResultadosRow : row));
        } else {
          setEstadoResultados([...estadoResultados, data as unknown as EstadoResultadosRow]);
        }
        break;
      case 'flujoEfectivo':
        if (isEditing) {
          setFlujoEfectivo(flujoEfectivo.map(row => row.id === data.id ? data as unknown as FlujoEfectivoRow : row));
        } else {
          setFlujoEfectivo([...flujoEfectivo, data as unknown as FlujoEfectivoRow]);
        }
        break;
      case 'razonesFinancieras':
        if (isEditing) {
          setRazonesFinancieras(razonesFinancieras.map(row => row.id === data.id ? data as unknown as RazonesFinancierasRow : row));
        } else {
          setRazonesFinancieras([...razonesFinancieras, data as unknown as RazonesFinancierasRow]);
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
              <DataTable
                columns={personalColumns}
                data={personal}
                onEdit={(id) => handleEdit('personal', id)}
                onDelete={(id) => handleDelete('personal', id)}
                onAdd={() => handleAdd('personal')}
              />
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
              <DataTable
                columns={equiposColumns}
                data={equipos}
                onEdit={(id) => handleEdit('equipos', id)}
                onDelete={(id) => handleDelete('equipos', id)}
                onAdd={() => handleAdd('equipos')}
              />
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
                onEdit={(id) => handleEdit('amortizacion', id)}
                onDelete={(id) => handleDelete('amortizacion', id)}
                onAdd={() => handleAdd('amortizacion')}
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
                onEdit={(id) => handleEdit('depreciacion', id)}
                onDelete={(id) => handleDelete('depreciacion', id)}
                onAdd={() => handleAdd('depreciacion')}
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
                  <p className="text-sm text-muted-foreground">Análisis de ingresos y gastos proyectados</p>
                </div>
              </div>
              <DataTable
                columns={estadoResultadosColumns}
                data={estadoResultados}
                onEdit={(id) => handleEdit('estadoResultados', id)}
                onDelete={(id) => handleDelete('estadoResultados', id)}
                onAdd={() => handleAdd('estadoResultados')}
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
                onEdit={(id) => handleEdit('flujoEfectivo', id)}
                onDelete={(id) => handleDelete('flujoEfectivo', id)}
                onAdd={() => handleAdd('flujoEfectivo')}
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
                onEdit={(id) => handleEdit('razonesFinancieras', id)}
                onDelete={(id) => handleDelete('razonesFinancieras', id)}
                onAdd={() => handleAdd('razonesFinancieras')}
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
