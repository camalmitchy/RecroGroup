"use client";

import { useState, useTransition, type ReactNode } from "react";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
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
import type { ActionResult } from "@/server/result";

export type CrudFieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string | number | boolean;
};

export type CrudColumn<T extends { id: string }> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
};

export type CrudValues = Record<string, string | number | boolean | null>;

type PortalCrudProps<T extends { id: string }> = {
  title: string;
  description?: string;
  columns: CrudColumn<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyDescription?: string;
  fields?: CrudFieldDef[];
  onSave?: (
    values: CrudValues,
    id?: string,
  ) => Promise<ActionResult<{ id: string }>>;
  onDelete?: (id: string) => Promise<ActionResult<{ id: string }>>;
  deleteDescription?: string;
};

function fieldValue<T extends { id: string }>(
  row: T,
  name: string,
): string | number | boolean {
  const value = (row as Record<string, unknown>)[name];
  if (typeof value === "boolean" || typeof value === "number") return value;
  return value == null ? "" : String(value);
}

function readForm(form: HTMLFormElement, fields: CrudFieldDef[]): CrudValues {
  const data = new FormData(form);
  const values: CrudValues = {};

  for (const field of fields) {
    if (field.type === "checkbox") {
      values[field.name] = data.get(field.name) === "on";
      continue;
    }

    const raw = data.get(field.name);
    const text = typeof raw === "string" ? raw.trim() : "";

    if (field.type === "number") {
      values[field.name] = text === "" ? null : Number(text);
    } else {
      values[field.name] = text;
    }
  }

  return values;
}

export function PortalCrud<T extends { id: string }>({
  title,
  description,
  columns,
  rows,
  emptyTitle,
  emptyDescription,
  fields,
  onSave,
  onDelete,
  deleteDescription = "This action cannot be undone.",
}: PortalCrudProps<T>) {
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const singular = title.replace(/s$/, "");
  const editable = Boolean(fields && onSave);

  const closeDialog = () => {
    setOpen(false);
    setEditing(null);
    setErrors({});
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fields || !onSave) return;

    const values = readForm(event.currentTarget, fields);
    setErrors({});

    startTransition(async () => {
      const result = await onSave(values, editing?.id);
      if (result.ok) {
        toast.success(editing ? `${singular} updated` : `${singular} created`);
        closeDialog();
      } else {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.error);
      }
    });
  };

  const remove = (id: string) => {
    if (!onDelete) return;
    setPendingId(id);
    startTransition(async () => {
      const result = await onDelete(id);
      setPendingId(null);
      if (result.ok) {
        toast.success(`${singular} deleted`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div>
      <PortalPageHeader
        title={title}
        description={description}
        actions={
          editable ? (
            <Dialog
              open={open}
              onOpenChange={(next) => {
                if (next) {
                  setOpen(true);
                } else {
                  closeDialog();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setErrors({});
                  }}
                  className="bg-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/90"
                >
                  <Plus className="size-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {editing ? `Edit ${singular}` : `New ${singular}`}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={submit}
                  className="max-h-[60vh] space-y-3 overflow-y-auto pr-1"
                >
                  {errors._form && (
                    <p className="text-sm text-destructive">
                      {errors._form.join(", ")}
                    </p>
                  )}
                  {fields?.map((field) => {
                    const fieldError = errors[field.name]?.[0];
                    const initial = editing
                      ? fieldValue(editing, field.name)
                      : (field.defaultValue ?? "");

                    return (
                      <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={field.name}>{field.label}</Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            defaultValue={String(initial)}
                            aria-invalid={Boolean(fieldError)}
                            rows={4}
                          />
                        ) : field.type === "select" ? (
                          <NativeSelect
                            id={field.name}
                            name={field.name}
                            required={field.required}
                            defaultValue={String(
                              editing
                                ? initial
                                : (field.options?.[0]?.value ??
                                  field.defaultValue ??
                                  ""),
                            )}
                            aria-invalid={Boolean(fieldError)}
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
                            defaultChecked={Boolean(initial)}
                            className="size-4 rounded border-border"
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type ?? "text"}
                            name={field.name}
                            required={field.required}
                            defaultValue={String(initial)}
                            aria-invalid={Boolean(fieldError)}
                          />
                        )}
                        {fieldError && (
                          <p className="text-xs text-destructive">
                            {fieldError}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <DialogFooter>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? "Saving…" : "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <Empty className="py-12">
              <EmptyHeader>
                <EmptyTitle>{emptyTitle ?? `No ${title.toLowerCase()} yet`}</EmptyTitle>
                {emptyDescription && (
                  <EmptyDescription>{emptyDescription}</EmptyDescription>
                )}
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.label}>{column.label}</TableHead>
                  ))}
                  {(editable || onDelete) && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const busy = isPending && pendingId === row.id;

                  return (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.label}>
                          {column.render
                            ? column.render(row)
                            : String(
                                (row as Record<string, unknown>)[
                                  column.key as string
                                ] ?? "—",
                              )}
                        </TableCell>
                      ))}
                      {(editable || onDelete) && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {editable && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Edit ${singular}`}
                                disabled={busy}
                                onClick={() => {
                                  setEditing(row);
                                  setErrors({});
                                  setOpen(true);
                                }}
                              >
                                <Pencil className="size-4" />
                              </Button>
                            )}
                            {onDelete && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Delete ${singular}`}
                                    className="text-destructive"
                                    disabled={busy}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete this {singular.toLowerCase()}?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {deleteDescription}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => remove(row.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
