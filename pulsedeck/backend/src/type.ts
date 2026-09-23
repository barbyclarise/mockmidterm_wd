export type Severity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "in-progress" | "resolved" | "closed";
// Field names match the database columns (snake_case), like crust_type in the pie problem
export interface Incident {
id?: number;
title: string;
description: string;
severity: Severity;
status?: IncidentStatus;
created_by?: number;
created_at?: string;
updated_at?: string;
}