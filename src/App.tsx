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
import {
  fetchUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./util";
import { EditProjectForm } from "./components/EditProjectForm";
import { Dependencies } from "./components/Dependencies";
import { SprintsList } from "./components/SprintsList";

export const App = () => {
  const [client, setClient] = React.useState(createClientWithToken(null));
  const [user, setUser] = React.useState<MaybeUser>(
    fetchUserFromLocalStorage()
  );
  const [project, setProject] = React.useState<MaybeProject>(null);

  function onClientChange(user: MaybeUser) {
    setClient(createClientWithToken(user?.token || null));
    setUser(user);

    if (user) {
      saveUserToLocalStorage(user);
    } else {
      removeUserFromLocalStorage();
    }
  }

  async function updateUser() {
    const { error, data, response } = await client.GET("/users/me");

    if (error) {
      console.log(error);
    } else if (response.status === 200) {
      setUser(data!);
    }
  }

  function onProjectChange(project: MaybeProject) {
    setProject(project);
    updateUser();
  }

  React.useEffect(() => {
    const user = fetchUserFromLocalStorage();
    onClientChange(user);
  }, []);

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
                    element={
                      <ProjectList
                        onLogout={onClientChange}
                        onProjectSelected={onProjectChange}
                      />
                    }
                  />
                  <Route path="/addproject" element={<AddProjectForm />} />
                  <Route
                    path="/changepassword"
                    element={<ChangePasswordForm />}
                  />
                  <Route
                    path="/kanban"
                    element={
                      <KanbanBoard
                        onLogout={onClientChange}
                        onProjectUpdated={onProjectChange}
                      />
                    }
                  />
                  <Route path="/dependencies" element={<Dependencies />} />
                  <Route path="/addtask" element={<AddTaskForm />} />
                  <Route path="/addmilestone" element={<AddMilestoneForm />} />
                  <Route
                    path="/settings"
                    element={<ProjectSettings onLogout={onClientChange} />}
                  />
                  <Route
                    path="/editproject"
                    element={
                      <EditProjectForm onProjectUpdated={onProjectChange} />
                    }
                  />
                  <Route path="/sprintslist" element={<SprintsList onLogout={onClientChange}/>} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ApiContext.Provider>
    </ChakraProvider>
  );
};
