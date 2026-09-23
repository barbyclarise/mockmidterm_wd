import type { Incident, IncidentStatus, Severity } from "../types";
const API_BASE = "http://localhost:3000/api";
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
};
export const fetchIncidents = async (): Promise<Incident[]> => {
  const response = await fetch(`${API_BASE}/incidents`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch incidents");
  return response.json();
};
export const createIncident = async (
  incident: Pick<Incident, "title" | "description" | "severity">,
): Promise<Incident> => {
  const response = await fetch(`${API_BASE}/incidents`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(incident),
  });
  if (!response.ok) throw new Error("Failed to create incident.");
  return response.json();
};
export const updateIncident = async (
  id: number,
  changes: { status?: IncidentStatus; severity?: Severity },
): Promise<Incident> => {
  const response = await fetch(`${API_BASE}/incidents/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(changes),
  });
  if (!response.ok) throw new Error("Failed to update incident.");
  return response.json();
};
export const deleteIncident = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/incidents/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete incident.");
};
