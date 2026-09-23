import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Incident } from "../types";
interface State {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}
type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Incident[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_INCIDENT"; payload: Incident }
  | { type: "UPDATE_INCIDENT"; payload: Incident }
  | { type: "DELETE_INCIDENT"; payload: number };
const initialState: State = {
  incidents: [],
  loading: false,
  error: null,
};
const incidentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, incidents: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_INCIDENT":
      return { ...state, incidents: [...state.incidents, action.payload] };
    case "UPDATE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.map((i) =>
          i.id === action.payload.id ? action.payload : i,
        ),
      };
    case "DELETE_INCIDENT":
      return {
        ...state,
        incidents: state.incidents.filter((i) => i.id !== action.payload),
      };
    default:
      return state;
  }
};
export const IncidentContext = createContext<
  { state: State; dispatch: Dispatch<Action> } | undefined
>(undefined);
export const IncidentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(incidentReducer, initialState);
  return (
    <IncidentContext.Provider value={{ state, dispatch }}>
      {children}
    </IncidentContext.Provider>
  );
};
