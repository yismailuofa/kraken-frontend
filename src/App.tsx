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
import { KanbanBoard } from "./components/KanbanBoard";


export const App = () => (
  <ChakraProvider theme={theme}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/registration" element={<RegistrationForm />} />
      <Route path="/projectlist" element={<ProjectList />} />
      <Route path="/addproject" element={<AddProjectForm />} />
      <Route path="/kanban" element={<KanbanBoard />} />
    </Routes>
    {/* <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo h="40vmin" pointerEvents="none" />
          <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color="teal.500"
            href="https://chakra-ui.com"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Chakra
          </Link>
        </VStack>
      </Grid>
    </Box> */}
  </ChakraProvider>
)