import * as React from "react"
import { Routes, Route } from 'react-router-dom';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import { RegistrationForm } from "./components/RegistrationForm"
import { LoginForm } from "./components/LoginForm"
import { Home } from "./components/Home"
import { ProjectList } from "./components/ProjectList";
import { AddProjectForm } from "./components/AddProjectForm";
import { createClientWithToken } from "./client";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const App = () => {
  const [client, setClient] = React.useState(createClientWithToken(null));
  const [token, setToken] = React.useState<null | string>(null);

  function onClientChange(token: string | null) {
    setClient(createClientWithToken(token));
    setToken(token);
  }

  return (
    <ChakraProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm onAuthenticate={onClientChange} />} />
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/*" element={
            <ProtectedRoute token={token}>
              <Routes>
                <Route path="/projectlist" element={<ProjectList client={client} onLogout={onClientChange} />} />
                <Route path="/addproject" element={<AddProjectForm client={client}/>} />
              </Routes>
            </ProtectedRoute>
          }
          />
        </Routes>
    </ChakraProvider>
  )
}