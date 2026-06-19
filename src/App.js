import { RegistrationForm } from "./Components/RegistrationForm";
import AdminLeads from "./Components/AdminLeads";

import "./App.css";


export default function App() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  // No auth required: simple path-based admin view
  if (path.startsWith("/admin")) {

    return (
      <div>
        <AdminLeads />
      </div>
    );
  }

  return (
    <div>
      <RegistrationForm />
    </div>
  );
}

