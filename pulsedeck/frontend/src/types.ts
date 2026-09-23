export type Severity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "in-progress" | "resolved" | "closed";
export interface Incident {
id: number;
title: string;
description: string;
severity: Severity;
status: IncidentStatus;
created_by: number;
created_at: string;
updated_at: string;
}