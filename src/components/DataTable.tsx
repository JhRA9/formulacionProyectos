import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Column {
  key: string;
  label: string;
  format?: (value: unknown) => string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  editableRowIds?: string[];
  onCellEdit?: (rowId: string, columnKey: string, value: any) => void;
}

export const DataTable = ({ columns, data, onEdit, onDelete, onAdd, editableRowIds = [], onCellEdit }: DataTableProps) => {
  const [editingCell, setEditingCell] = React.useState<{ rowId: string; columnKey: string } | null>(null);
  const [editValue, setEditValue] = React.useState<string>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCellClick = (rowId: string, columnKey: string, currentValue: any) => {
    if (editableRowIds.includes(rowId)) {
      setEditingCell({ rowId, columnKey });
      setEditValue(currentValue?.toString() || '');
    }
  };

  const handleCellSave = () => {
    if (editingCell && onCellEdit) {
      const numericValue = parseFloat(editValue) || 0;
      onCellEdit(editingCell.rowId, editingCell.columnKey, numericValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Registros de datos</h3>
        <Button onClick={onAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar registro
        </Button>
      </div>
      
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-semibold text-foreground whitespace-nowrap">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="font-semibold text-foreground text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                    No hay datos disponibles. Haz clic en "Agregar registro" para comenzar.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                    {columns.map((column) => {
                      const isEditable = editableRowIds.includes(row.id) && column.key !== 'detalle' && column.key !== 'id';
                      const isEditing = editingCell?.rowId === row.id && editingCell?.columnKey === column.key;
                      const cellValue = row[column.key];

                      return (
                        <TableCell
                          key={column.key}
                          className={`whitespace-nowrap ${isEditable ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                          onClick={() => isEditable && handleCellClick(row.id, column.key, cellValue)}
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellSave}
                              onKeyDown={handleKeyDown}
                              className="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                            />
                          ) : (
                            column.format
                              ? column.format(cellValue)
                              : typeof cellValue === 'number' && (column.key.toLowerCase().includes('costo') || column.key.toLowerCase().includes('sueldo') || column.key.toLowerCase().includes('total') || column.key.toLowerCase().includes('inversion') || column.key.toLowerCase().includes('pago') || column.key.toLowerCase().includes('saldo') || column.key.toLowerCase().includes('año'))
                                ? formatCurrency(cellValue)
                                : cellValue
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(row.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(row.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
