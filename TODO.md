# TODO: Fix Linting Errors

## Errors to Fix:
1. **DataTable.tsx** (lines 8, 13): Replace 'any' with proper types ✅
   - format?: (value: any) => string; -> format?: (value: unknown) => string;
   - data: any[]; -> data: Record<string, unknown>[];

2. **EditDialog.tsx** (lines 17, 18, 23, 29): Replace 'any' with Record<string, unknown> ✅
   - data: any; -> data: Record<string, unknown> | null;
   - onSave: (data: any) => void; -> onSave: (data: Record<string, unknown>) => void;
   - formData: any; -> formData: Record<string, unknown>;
   - emptyData: any; -> emptyData: Record<string, unknown>;

3. **command.tsx** (line 24): Remove empty interface CommandDialogProps ✅
   - Remove interface, use DialogProps directly

4. **textarea.tsx** (line 5): Remove empty interface TextareaProps ✅
   - Remove interface, use React.TextareaHTMLAttributes<HTMLTextAreaElement> directly

5. **Index.tsx** (lines 44, 274): Replace 'any' with Record<string, unknown> ✅
   - editingData: any; -> editingData: Record<string, unknown> | null;
   - handleSave = (data: any) => { -> handleSave = (data: Record<string, unknown>) => {

6. **tailwind.config.ts** (line 98): Replace require() with import ✅
   - Change require() to import statement

## Warnings (Optional):
- Fast refresh warnings in UI components (can be ignored for now)

## Followup:
- Run `npm run lint` to verify all errors are fixed
