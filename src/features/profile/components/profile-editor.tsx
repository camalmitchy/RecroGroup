"use client";

import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toEditablePhone } from "@/features/profile/lib/schema";
import { updateProfile } from "@/server/actions/profile";
import { userInitials } from "@/shared/lib/user-initials";

type ProfileEditorUser = {
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
};

export function ProfileEditor({
  user,
  appearance = "public",
}: {
  user: ProfileEditorUser;
  appearance?: "public" | "staff";
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = userInitials(user.name, user.email);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(toEditablePhone(user.phone));
  const [imageUrl, setImageUrl] = useState(user.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const shownImage = previewUrl ?? imageUrl;
  const isStaff = appearance === "staff";

  const dirty = useMemo(() => {
    return (
      name.trim() !== user.name.trim() ||
      phone.trim() !== toEditablePhone(user.phone) ||
      imageFile !== null
    );
  }, [imageFile, name, phone, user.name, user.phone]);

  function onPickPhoto(file: File | undefined) {
    if (!file) return;
    setImageFile(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  async function onSave() {
    setSaving(true);
    setFieldErrors({});

    const result = await updateProfile({
      name,
      phone,
      image: imageFile,
    });

    setSaving(false);

    if (!result.ok) {
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      toast.error(result.error);
      return;
    }

    setImageFile(null);
    setImageUrl(result.data.image);
    setPhone(toEditablePhone(result.data.phone));
    setName(result.data.name);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    toast.success("Profile updated");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Avatar
            className={
              isStaff
                ? "size-16 ring-1 ring-[var(--admin-border)]"
                : "size-16 ring-1 ring-border"
            }
          >
            {shownImage ? (
              <AvatarImage src={shownImage} alt={name || user.email} />
            ) : null}
            <AvatarFallback className="bg-primary text-base font-semibold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -right-1 -bottom-1 grid size-8 place-items-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-muted"
            aria-label="Change profile photo"
          >
            <Camera className="size-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              onPickPhoto(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{name || user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 text-sm font-medium text-primary hover:underline"
          >
            {shownImage ? "Change photo" : "Add a photo"}
          </button>
        </div>
      </div>

      <FieldGroup className="gap-4">
        <Field data-invalid={!!fieldErrors.name}>
          <FieldLabel htmlFor="profile-name">Name</FieldLabel>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            aria-invalid={!!fieldErrors.name}
          />
          <FieldError errors={fieldErrors.name?.map((message) => ({ message }))} />
        </Field>
        <Field data-invalid={!!fieldErrors.phone}>
          <FieldLabel htmlFor="profile-phone">Contact</FieldLabel>
          <Input
            id="profile-phone"
            type="tel"
            inputMode="tel"
            placeholder="0712 345 678"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            aria-invalid={!!fieldErrors.phone}
          />
          <FieldError errors={fieldErrors.phone?.map((message) => ({ message }))} />
        </Field>
      </FieldGroup>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onSave}
          disabled={saving || !dirty}
          className={isStaff ? undefined : "rounded-full"}
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {dirty ? (
          <p className="text-xs text-muted-foreground">Unsaved changes</p>
        ) : null}
      </div>
    </div>
  );
}
