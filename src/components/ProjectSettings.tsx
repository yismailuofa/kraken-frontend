import { Box, Heading, Text, Button, Spacer, Stack, VStack, useDisclosure, useToast, IconButton, HStack } from "@chakra-ui/react";
import { useContext } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { components } from "../client/api";
import { useLocation, useNavigate } from "react-router-dom";
import { SettingsTopBar } from "./SettingsTopBar";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { ProjectMemberTable } from "./ProjectMemberTable";
import { LeaveProjectModal } from "./LeaveProjectModal";
import { FaEdit } from "react-icons/fa";
import { ProjectCodeModal } from "./ProjectCodeModal";

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

  const { 
    isOpen: isOpenProjectCodeModal, 
    onOpen: onOpenProjectCodeModal, 
    onClose: onCloseProjectCodeModal 
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
      <ProjectCodeModal projectCode={project.id} onCloseModal={onCloseProjectCodeModal} isOpen={isOpenProjectCodeModal} onClose={onCloseProjectCodeModal}/>

      <VStack h="88vh" w="100vw">
        <HStack>
          <Heading mt={5}>{project.name}</Heading>
          {
            user?.ownedProjects?.some(projectId => projectId === project.id)
            &&
            <IconButton
            colorScheme="teal"
            _hover={{
              background: "white",
              color: "teal.700",
            }}
            aria-label="Edit Project"
            size="lg"
            fontSize={32}
            variant="ghost"
            icon={<FaEdit />}
            onClick={() => navigate("/editproject")}
            />
          }
        </HStack>

        <Text align="center" maxWidth={1000} mt={5} mb={5}>{project.description}</Text>
        
        {
          user?.ownedProjects?.some(projectId => projectId === project.id)
          &&
          <Button colorScheme='teal' variant='solid' mb={10} onClick={onOpenProjectCodeModal}>
            Get Project ID
          </Button>
        }

        {user?.ownedProjects?.some(projectId => projectId === project.id) && <ProjectMemberTable />}

        <Spacer />

        <Stack w="100vw" direction='row' spacing={4} align='center' mt={10} mb={10}>
        <Button colorScheme='teal' variant='solid' ml={10} onClick={() => navigate(state ? state.location : -1)}>
          Back
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