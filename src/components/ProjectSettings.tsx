import { Box, Button, Flex, Heading, SimpleGrid, Spacer, Stack, useDisclosure } from "@chakra-ui/react";
import { ProjectCard } from "./ProjectCard";
import { ProjectListTopBar } from "./ProjectListTopBar";
import { useContext, useEffect, useState } from "react";
import { ApiContext, MaybeUser, MaybeProject } from "../contexts/ApiContext";
import { components } from "../client/api";
import { useLocation, useNavigate } from "react-router-dom";
import { SettingsTopBar } from "./SettingsTopBar";
import { DeleteProjectModal } from "./DeleteProjectModal";

type Project = components["schemas"]["Project"];

interface ProjectSettingsProps {
  onLogout: (token: MaybeUser) => void;
}

// TODO: get path we routed from so we can return
export function ProjectSettings({ onLogout }: ProjectSettingsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const {state} = useLocation();
  const navigate = useNavigate();

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  async function onConfirmDelete() {
    const { data, error, response } = await client.DELETE("/projects/{id}", {
      params: {
        path: {
            id: project?.id!
        },
      },
    });

    if (error) {
      console.log(error);
    } else if (response.status === 200) {
      console.log(data)
    } else {
      console.log(response);
    }

    navigate("/projectlist");
  }

  return (
    <Box h="100vh">
      <SettingsTopBar onLogout={onLogout} />

      <DeleteProjectModal onConfirmDelete={onConfirmDelete} isOpen={isOpen} onClose={onClose}/>
      <Stack h="90vh" direction='row' spacing={4} align='center' mt={10}>
        <Button colorScheme='teal' variant='solid' ml={10} onClick={() => navigate(state.location)}>
          Close
        </Button>
        <Spacer />
        <Button colorScheme='red' variant='solid' mr={10} onClick={onOpen}>
          Delete Project
        </Button>       
      </Stack>
    </Box>
  );
}