import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface Field {
  key: string;
  label: string;
  type: 'text' | 'number';
}

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: Field[];
  data: Record<string, unknown> | null;
  onSave: (data: Record<string, unknown>) => void;
  title: string;
}

export const EditDialog = ({ open, onOpenChange, fields, data, onSave, title }: EditDialogProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      const emptyData: Record<string, unknown> = { id: crypto.randomUUID() };
      fields.forEach(field => {
        emptyData[field.key] = field.type === 'number' ? 0 : '';
      });
      setFormData(emptyData);
    }
  }, [data, fields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    [field.key]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                  })}
                  required
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
