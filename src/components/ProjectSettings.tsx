import { Box, Heading, Text, Button, Spacer, Stack, VStack, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { components } from "../client/api";
import { useLocation, useNavigate } from "react-router-dom";
import { SettingsTopBar } from "./SettingsTopBar";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { ProjectMemberTable } from "./ProjectMemberTable";
import { LeaveProjectModal } from "./LeaveProjectModal";

type Project = components["schemas"]["Project"];

interface ProjectSettingsProps {
  onLogout: (token: MaybeUser) => void;
}

// TODO: get path we routed from so we can return
export function ProjectSettings({ onLogout }: ProjectSettingsProps) {
  const {user, client} = useContext(ApiContext);
  const project = useContext(ApiContext).project;
  const {state} = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { 
    isOpen: isOpenDeleteModal, 
    onOpen: onOpenDeleteModal, 
    onClose: onCloseDeleteModal 
  } = useDisclosure()

  const { 
    isOpen: isOpenLeaveModal, 
    onOpen: onOpenLeaveModal, 
    onClose: onCloseLeaveModal 
  } = useDisclosure()

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

  async function onConfirmLeave() {
    const { data, error, response } = await client.DELETE("/projects/{id}/leave", {
      params: {
        path: {
          id: project?.id!,
        },
      },
    });

    if (error) {
      console.log(error);
      toast({
        title: "Leave Project Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error leaving the project.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else if (response.status === 200) {
      toast({
        title: "Successfully Exited Project",
        description: "You are no longer a member on the project.",
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

      <DeleteProjectModal onConfirmDelete={onConfirmDelete} isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal}/>
      <LeaveProjectModal onConfirmLeave={onConfirmLeave} isOpen={isOpenLeaveModal} onClose={onCloseLeaveModal}/>

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
        {
          user?.ownedProjects?.some(projectId => projectId === project.id) ?
        <Button colorScheme='red' variant='solid' mr={10} onClick={onOpenDeleteModal}>
          Delete Project
        </Button>
        :
        <Button colorScheme='red' variant='solid' mr={10} onClick={onOpenLeaveModal}>
          Leave Project
        </Button>
        }       
      </Stack>
      </VStack>
    </Box>
  );
}