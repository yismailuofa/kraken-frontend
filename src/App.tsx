import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider, theme } from "@chakra-ui/react";

import { RegistrationForm } from "./components/RegistrationForm";
import { LoginForm } from "./components/LoginForm";
import { Home } from "./components/Home";
import { ProjectList } from "./components/ProjectList";
import { AddProjectForm } from "./components/AddProjectForm";
import { KanbanBoard } from "./components/KanbanBoard";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { createClientWithToken } from "./client";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ApiContext, MaybeUser } from "./contexts/ApiContext";

export const App = () => {
  const [client, setClient] = React.useState(createClientWithToken(null));
  const [user, setUser] = React.useState<MaybeUser>(null);

  function onClientChange(user: MaybeUser) {
    setClient(createClientWithToken(user?.token || null));
    setUser(user);
  }

  return (
    <ChakraProvider theme={theme}>
      <ApiContext.Provider value={{ client, user }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<LoginForm onAuthenticate={onClientChange} />}
          />
          <Route path="/registration" element={<RegistrationForm />} />
          //TODO: Move to project context
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route
                    path="/projectlist"
                    element={<ProjectList onLogout={onClientChange} />}
                  />
                  <Route path="/addproject" element={<AddProjectForm />} />
                  <Route path="/changepassword" element={<ChangePasswordForm />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ApiContext.Provider>
    </ChakraProvider>
  );
};
