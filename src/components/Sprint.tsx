import { Stack, HStack, StackDivider, IconButton, Text, Box, Spacer, AccordionPanel, AccordionItem, AccordionButton, AccordionIcon, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { components } from "../client/api";
import { FaWindowClose } from "react-icons/fa";
import { DeleteSprintModal } from "./DeleteSprintModal";
import { ApiContext } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";

type Milestone = components["schemas"]["Milestone"];
type Task = components["schemas"]["Task"];
type Sprint = components["schemas"]["Sprint"];

export function Sprint({ sprint, onProjectUpdated }: any) {
  const {user, client, project} = useContext(ApiContext);
  const navigate = useNavigate();
  const toast = useToast();

  const { 
    isOpen: isOpenDeleteSprintModal, 
    onOpen: onOpenDeleteSprintModal, 
    onClose: onCloseDeleteSprintModal 
  } = useDisclosure()

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  async function onConfirmDeleteSprint(sprint: Sprint) {
    const { data, error, response } = await client.DELETE("/sprints/{id}", {
      params: {
        path: {
            id: sprint.id!
        },
      },
    });

    // If there is an error deleting the sprint notify the user with a toast message
    if (error) {
      console.log(error);
      toast({
        title: "Sprint Deletion Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error deleting your sprint.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    // If the response is valid notify the user with a success toast message
    } else if (response.status === 200) {
      toast({
        title: "Sprint Deleted",
        description: "Your sprint has been successfully deleted.",
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "top",
      });

      // Fetch the updated project and update the project context
      const { data, error, response } = await client.GET("/projects/{id}", {
        params: {
          path: {
            id: project?.id!
          },
        },
      });

      if (data) {
        onProjectUpdated(data); // Update the project context
      }
    } else {
      console.log(response);
    }
  }

  return (
    <AccordionItem>
      <h2>
      <AccordionButton border="1px" borderColor={'gray.200'} alignContent="center" minH={16}>
          <Box as="span" flex='1' textAlign='left'>
          {sprint.name}
          </Box>
          <AccordionIcon />
      </AccordionButton>
      </h2>
      <AccordionPanel border="1px" borderColor={'gray.200'} pb={4}>

        <DeleteSprintModal sprint={sprint} onConfirmDeleteSprint={onConfirmDeleteSprint} isOpen={isOpenDeleteSprintModal} onClose={onCloseDeleteSprintModal}/>

        <Stack divider={<StackDivider />} spacing='4'>
          <HStack>
            <Text>{sprint.description}</Text>
            <Spacer/>
            <IconButton
              colorScheme="red"
              _hover={{
                  background: "white",
                  color: "red.700",
              }}
              aria-label="Settings"
              size="lg"
              fontSize={32}
              variant='ghost'
              icon={<FaWindowClose />}
              onClick={onOpenDeleteSprintModal}
            />
          </HStack>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th>Assigned To</Th>
                  <Th>Due Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sprint.milestones?.map((milestone: Milestone) => (
                  <Tr key={milestone.id}>
                    <Td>{milestone.name}</Td>
                    <Td overflow="clip">{milestone.description}</Td>
                    <Td>{milestone.status}</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td>{milestone.dueDate}</Td>
                  </Tr>
                ))}
                {sprint.tasks?.map((task: Task) => (
                  <Tr key={task.id}>
                    <Td>{task.name}</Td>
                    <Td overflow="clip">{task.description}</Td>
                    <Td>{task.status}</Td>
                    <Td>{task.priority}</Td>
                    <Td>{task.assignedTo}</Td>
                    <Td>{task.dueDate}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}