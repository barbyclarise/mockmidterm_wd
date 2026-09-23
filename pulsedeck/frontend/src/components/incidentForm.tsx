import { useContext, useState, type SetStateAction } from "react";
import { createIncident } from "../api/incidentService";
import { IncidentContext } from "../context/incidentContext";
import type { Severity } from "../types";
import { Button, Form, Input, Select, TextArea } from "./styles";
export const IncidentForm: React.FC = () => {
  const context = useContext(IncidentContext);
  if (!context)
    throw new Error("IncidentForm must be used within IncidentProvider");
  const { dispatch } = context;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("low");
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSeverity("low");
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newIncident = await createIncident({
        title,
        description,
        severity,
      });
      dispatch({ type: "ADD_INCIDENT", payload: newIncident });
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Failed to create incident. Please try again.");
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h3>New Incident</h3>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setTitle(e.target.value)}
        required
      />
      <TextArea
        placeholder="Description"
        value={description}
        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDescription(e.target.value)}
        required
      />
      <Select
        value={severity}
        onChange={(e: { target: { value: string; }; }) => setSeverity(e.target.value as Severity)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </Select>
      <Button type="submit">Submit Ticket</Button>
    </Form>
  );
};
