"use client";

import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PortalPageHeader } from "@/features/portal/components/portal-page-header";

export type CrudFieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string | number | boolean;
};

type CrudColumn<T extends { id: string }> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
};

type PortalCrudProps<T extends { id: string }> = {
  title: string;
  description?: string;
  columns: CrudColumn<T>[];
  fields: CrudFieldDef[];
  initialRows: T[];
  emptyLabel?: string;
};

function getFieldValue<T extends Record<string, unknown>>(
  row: T,
  name: string,
): string | number | boolean {
  const value = row[name];
  if (typeof value === "boolean" || typeof value === "number") return value;
  return value == null ? "" : String(value);
}

export function PortalCrud<T extends { id: string } & Record<string, unknown>>({
  title,
  description,
  columns,
  fields,
  initialRows,
  emptyLabel = "No records yet.",
}: PortalCrudProps<T>) {
  const [rows, setRows] = useState<T[]>(initialRows);
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};

    for (const field of fields) {
      if (field.type === "checkbox") {
        payload[field.name] = formData.get(field.name) === "on";
      } else if (field.type === "number") {
        const raw = formData.get(field.name);
        payload[field.name] =
          raw === "" || raw == null ? null : Number(raw);
      } else {
        const raw = formData.get(field.name);
        payload[field.name] = raw === "" ? null : raw;
      }
    }

    if (editing) {
      setRows((current) =>
        current.map((row) =>
          row.id === editing.id ? { ...row, ...payload } : row,
        ),
      );
      toast.success("Updated");
    } else {
      setRows((current) => [
        { id: crypto.randomUUID(), ...payload } as T,
        ...current,
      ]);
      toast.success("Created");
    }

    closeDialog();
  };

  const remove = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <PortalPageHeader
        title={title}
        description={description}
        actions={
          <Dialog
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              if (!next) setEditing(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                type="button"
                onClick={() => setEditing(null)}
                className="bg-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/90"
              >
                <Plus className="size-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editing
                    ? `Edit ${title.replace(/s$/, "")}`
                    : `New ${title.replace(/s$/, "")}`}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={submit}
                className="max-h-[60vh] space-y-3 overflow-y-auto pr-1"
              >
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        defaultValue={String(
                          editing
                            ? getFieldValue(editing, field.name)
                            : (field.defaultValue ?? ""),
                        )}
                        rows={4}
                      />
                    ) : field.type === "select" ? (
                      <NativeSelect
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        defaultValue={String(
                          editing
                            ? getFieldValue(editing, field.name)
                            : (field.options?.[0]?.value ??
                                field.defaultValue ??
                                ""),
                        )}
                      >
                        {field.options?.map((option) => (
                          <NativeSelectOption
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    ) : field.type === "checkbox" ? (
                      <input
                        id={field.name}
                        type="checkbox"
                        name={field.name}
                        defaultChecked={Boolean(
                          editing
                            ? getFieldValue(editing, field.name)
                            : field.defaultValue,
                        )}
                        className="size-4 rounded border-border"
                      />
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type ?? "text"}
                        name={field.name}
                        required={field.required}
                        defaultValue={String(
                          editing
                            ? getFieldValue(editing, field.name)
                            : (field.defaultValue ?? ""),
                        )}
                      />
                    )}
                  </div>
                ))}
                <DialogFooter>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              {emptyLabel}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.label}>{column.label}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.label}>
                        {column.render
                          ? column.render(row)
                          : String(row[column.key as keyof T] ?? "—")}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit"
                          onClick={() => {
                            setEditing(row);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Delete"
                              className="text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this record?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(row.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        MVP view uses local sample data. Connect Prisma when the database is
        ready.
      </p>
    </div>
  );
}
