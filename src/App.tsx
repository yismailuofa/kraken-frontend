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
import { ApiContext, MaybeUser, MaybeProject } from "./contexts/ApiContext";
import { AddTaskForm } from "./components/AddTaskForm";
import { AddMilestoneForm } from "./components/AddMilestoneForm";
import { ProjectSettings } from "./components/ProjectSettings";

export const App = () => {
  const [client, setClient] = React.useState(createClientWithToken(null));
  const [user, setUser] = React.useState<MaybeUser>(null);
  const [project, setProject] = React.useState<MaybeProject>(null);

  function onClientChange(user: MaybeUser) {
    setClient(createClientWithToken(user?.token || null));
    setUser(user);
  }

  function onProjectChange(project: MaybeProject) {
    setProject(project);
  }

  return (
    <ChakraProvider theme={theme}>
      <ApiContext.Provider value={{ client, user, project }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<LoginForm onAuthenticate={onClientChange} />}
          />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route
                    path="/projectlist"
                    element={<ProjectList onLogout={onClientChange} onProjectSelected={onProjectChange}/>}
                  />
                  <Route path="/addproject" element={<AddProjectForm />} />
                  <Route path="/changepassword" element={<ChangePasswordForm />} />
                  <Route path="/kanban" element={<KanbanBoard onLogout={onClientChange} onProjectUpdated={onProjectChange}/>} />
                  <Route path="/addtask" element={<AddTaskForm/>} />
                  <Route path="/addmilestone" element={<AddMilestoneForm/>} />
                  <Route path="/settings" element={<ProjectSettings onLogout={onClientChange}/>} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ApiContext.Provider>
    </ChakraProvider>
  );
};
