import { z } from "zod";

const severityEnum = z.enum(["low", "medium", "high", "critical"]);
const statusEnum = z.enum(["open", "in-progress", "resolved", "closed"]);

export const incidentBodySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  severity: severityEnum,
});

export const createIncidentSchema = z.object({ body: incidentBodySchema });
// PATCH: only status and severity can change, and at least one must be sent

export const updateIncidentSchema = z.object({
  body: z
    .object({ status: statusEnum, severity: severityEnum })
    .partial()
    .refine((data) => data.status || data.severity, {
      message: "Provide at least one of: status, severity.",
    }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
  }),
});

export type IncidentInput = z.infer<typeof incidentBodySchema>;

export const authBodySchema = z.object({
  email: z.email("A valid email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const authRequestSchema = z.object({ body: authBodySchema });

export type AuthInput = z.infer<typeof authBodySchema>;
