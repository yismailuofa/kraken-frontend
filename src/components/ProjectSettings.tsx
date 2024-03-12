import { Box, Heading, Text, Button, Spacer, Stack, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { components } from "../client/api";
import { useLocation, useNavigate } from "react-router-dom";
import { SettingsTopBar } from "./SettingsTopBar";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { ProjectMemberTable } from "./ProjectMemberTable";

type Project = components["schemas"]["Project"];

interface ProjectSettingsProps {
  onLogout: (token: MaybeUser) => void;
}

// TODO: get path we routed from so we can return
export function ProjectSettings({ onLogout }: ProjectSettingsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {user, client} = useContext(ApiContext);
  const project = useContext(ApiContext).project;
  const {state} = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

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

    // If there is an error deleting the project notify the user with a toast message
    if (error) {
      console.log(error);
      toast({
        title: "Project Deletion Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error deleting your project.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    // If the response is valid naviagte to the project list page and notify the user with a success toast message
    } else if (response.status === 200) {
      console.log(data)
      toast({
        title: "Project Deleted",
        description: "Your project has been successfully deleted.",
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else {
      console.log(response);
    }

    navigate("/projectlist");
  }

  return (
    <Box h="100vh">
      <SettingsTopBar onLogout={onLogout} />

      <DeleteProjectModal onConfirmDelete={onConfirmDelete} isOpen={isOpen} onClose={onClose}/>
      <VStack h="88vh" w="100vw">
        <Heading mt={5}>{project.name}</Heading>
        <Text align="center" maxWidth={1000} mt={5} mb={10}>{project.description}</Text>
        {user?.ownedProjects?.some(projectId => projectId === project.id) && <ProjectMemberTable />}
        <Spacer />
        <Stack w="100vw" direction='row' spacing={4} align='center' mt={10} mb={10}>
        <Button colorScheme='teal' variant='solid' ml={10} onClick={() => navigate(state.location)}>
          Close
        </Button>
        <Spacer />
        <Button colorScheme='red' variant='solid' mr={10} onClick={onOpen}>
          Delete Project
        </Button>       
      </Stack>
      </VStack>
    </Box>
  );
}