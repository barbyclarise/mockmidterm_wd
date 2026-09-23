import { useContext, useEffect } from "react";
import { IncidentContext } from "../context/incidentContext";
import {
  deleteIncident,
  fetchIncidents,
  updateIncident,
} from "../api/incidentService";
import type { IncidentStatus } from "../types";
import { Button, Card, Grid, Select } from "./styles";
export const IncidentList: React.FC = () => {
  const context = useContext(IncidentContext);
  if (!context)
    throw new Error("IncidentList must be used within an IncidentProvider.");
  const { state, dispatch } = context;
  useEffect(() => {
    const loadIncidents = async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const data = await fetchIncidents();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: (error as Error).message });
      }
    };
    loadIncidents();
  }, [dispatch]);
  const handleStatusChange = async (id: number, status: IncidentStatus) => {
    try {
      const updated = await updateIncident(id, { status });
      dispatch({ type: "UPDATE_INCIDENT", payload: updated });
    } catch (error) {
      alert((error as Error).message);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteIncident(id);
      dispatch({ type: "DELETE_INCIDENT", payload: id });
    } catch (error) {
      alert((error as Error).message);
    }
  };
  if (state.loading) return <p>Loading incidents...</p>;
  if (state.error) return <p>Error: {state.error}</p>;
  return (
    <Grid>
      {state.incidents.map((incident) => (
        <Card key={incident.id}>
          <h4>{incident.title}</h4>
          <p>{incident.description}</p>
          <p>
            <strong>Severity:</strong> {incident.severity}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Select
              value={incident.status}
              onChange={(e: { target: { value: string; }; }) =>
                handleStatusChange(
                  incident.id,
                  e.target.value as IncidentStatus,
                )
              }
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
          </p>
          <Button onClick={() => handleDelete(incident.id)}>Delete</Button>
        </Card>
      ))}
    </Grid>
  );
};
