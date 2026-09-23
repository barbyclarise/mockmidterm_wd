import { useContext } from "react";
import "./App.css";
import { IncidentList } from "./components/incidentList";
import { IncidentForm } from "./components/incidentForm";
import { Button, Container } from "./components/styles";
import { IncidentProvider } from "./context/incidentContext";
import { AuthContext, AuthProvider } from "./context/authContext";
import { AuthForm } from "./components/authForm";
function MainApp() {
  const authContext = useContext(AuthContext);
  const handleLogout = () => {
    authContext?.dispatch({ type: "LOGOUT" });
  };
  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>PulseDesk</h1>
        {authContext?.state.isAuthenticated && (
          <Button onClick={handleLogout} style={{ background: "#333" }}>
            Sign Out
          </Button>
        )}
      </div>
      {authContext?.state.isAuthenticated ? (
        <>
          <IncidentForm />
          <hr style={{ margin: "30px 0", border: "1px solid #eee" }} />
          <h2>Incidents</h2>
          <IncidentList />
        </>
      ) : (
        <AuthForm />
      )}
    </Container>
  );
}
function App() {
  return (
    <IncidentProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </IncidentProvider>
  );
}
export default App;
