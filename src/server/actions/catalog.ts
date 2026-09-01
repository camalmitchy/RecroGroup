"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import type { ActionResult } from "@/server/result";
import { fail, failure, invalid, ok } from "@/server/result";

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens");

const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  slug,
  description: z.string().trim().max(4000).optional(),
  priceKes: z.coerce.number().int("Price must be whole shillings").min(0).nullable(),
  durationMin: z.coerce.number().int().min(0).nullable(),
  category: z.string().trim().max(80).optional(),
  isPublished: z.boolean().default(true),
});

const therapistSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required"),
  title: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(4000).optional(),
  specialties: z.array(z.string().trim().min(1)).default([]),
  email: z.email("Enter a valid email address").optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  isActive: z.boolean().default(true),
});

const faqSchema = z.object({
  question: z.string().trim().min(2, "Question is required"),
  answer: z.string().trim().min(2, "Answer is required"),
  category: z.string().trim().max(80).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
});

const testimonialSchema = z.object({
  authorName: z.string().trim().min(2, "Name is required"),
  authorRole: z.string().trim().max(120).optional(),
  quote: z.string().trim().min(2, "Quote is required"),
  rating: z.coerce.number().int().min(1).max(5).nullable(),
  isPublished: z.boolean().default(true),
});

function revalidateCatalog() {
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/content");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/content");
}

export type ServiceInput = z.input<typeof serviceSchema>;
export type TherapistInput = z.input<typeof therapistSchema>;
export type FaqInput = z.input<typeof faqSchema>;
export type TestimonialInput = z.input<typeof testimonialSchema>;

export async function upsertService(
  input: ServiceInput & { id?: string },
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const parsed = serviceSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);

    const data = {
      ...parsed.data,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
    };

    const existing = await prisma.service.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existing && existing.id !== input.id) {
      return fail("Another service already uses that slug", {
        slug: ["Another service already uses that slug"],
      });
    }

    const service = input.id
      ? await prisma.service.update({ where: { id: input.id }, data })
      : await prisma.service.create({ data });

    revalidateCatalog();
    revalidatePath("/services");
    revalidatePath("/booking");

    return ok({ id: service.id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("upsertService", error);
  }
}

export async function deleteService(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const bookings = await prisma.booking.count({ where: { serviceId: id } });
    if (bookings > 0) {
      return fail(
        `This service has ${bookings} booking${bookings === 1 ? "" : "s"}. Unpublish it instead of deleting.`,
      );
    }

    await prisma.service.delete({ where: { id } });

    revalidateCatalog();
    revalidatePath("/services");

    return ok({ id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("deleteService", error);
  }
}

export async function upsertTherapist(
  input: TherapistInput & { id?: string },
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const parsed = therapistSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);

    const data = {
      ...parsed.data,
      title: parsed.data.title || null,
      bio: parsed.data.bio || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
    };

    const therapist = input.id
      ? await prisma.therapist.update({ where: { id: input.id }, data })
      : await prisma.therapist.create({ data });

    revalidateCatalog();

    return ok({ id: therapist.id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("upsertTherapist", error);
  }
}

export async function deleteTherapist(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const bookings = await prisma.booking.count({ where: { therapistId: id } });
    if (bookings > 0) {
      return fail(
        `This therapist has ${bookings} booking${bookings === 1 ? "" : "s"}. Deactivate them instead of deleting.`,
      );
    }

    await prisma.therapist.delete({ where: { id } });

    revalidateCatalog();

    return ok({ id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("deleteTherapist", error);
  }
}

export async function upsertFaq(
  input: FaqInput & { id?: string },
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const parsed = faqSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);

    const data = { ...parsed.data, category: parsed.data.category || null };

    const faq = input.id
      ? await prisma.faq.update({ where: { id: input.id }, data })
      : await prisma.faq.create({ data });

    revalidateCatalog();
    revalidatePath("/faq");

    return ok({ id: faq.id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("upsertFaq", error);
  }
}

export async function deleteFaq(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    await prisma.faq.delete({ where: { id } });

    revalidateCatalog();
    revalidatePath("/faq");

    return ok({ id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("deleteFaq", error);
  }
}

export async function upsertTestimonial(
  input: TestimonialInput & { id?: string },
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();

    const parsed = testimonialSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);

    const data = { ...parsed.data, authorRole: parsed.data.authorRole || null };

    const testimonial = input.id
      ? await prisma.testimonial.update({ where: { id: input.id }, data })
      : await prisma.testimonial.create({ data });

    revalidateCatalog();

    return ok({ id: testimonial.id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("upsertTestimonial", error);
  }
}

export async function deleteTestimonial(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    await prisma.testimonial.delete({ where: { id } });

    revalidateCatalog();

    return ok({ id });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("deleteTestimonial", error);
  }
}

export async function setUserRole(
  userId: string,
  role: "admin" | "receptionist" | "customer",
): Promise<ActionResult<{ id: string; role: string }>> {
  try {
    const admin = await requireAdmin();

    if (admin.userId === userId && role !== "admin") {
      return fail("You cannot remove your own administrator access");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, role: true },
    });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/people");
    revalidatePath("/admin/settings");

    return ok({ id: user.id, role: user.role ?? role });
  } catch (error) {
    if (error instanceof AuthorizationError) return fail(error.message);
    return failure("setUserRole", error);
  }
}
