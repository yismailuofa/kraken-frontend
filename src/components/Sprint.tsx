/**
 * FR 26, FR 27
 * provide functionality for editing sprint content, and deleting sprints
 */

import { Stack, HStack, StackDivider, IconButton, Button, Text, Box, Spacer, AccordionPanel, AccordionItem, AccordionButton, AccordionIcon, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Menu, MenuButton, MenuItem, MenuList, MenuDivider, useDisclosure, useToast, Avatar, Tooltip, Heading, Wrap } from "@chakra-ui/react";
import { useContext } from "react";
import { components } from "../client/api";
import { FaEdit, FaWindowClose } from "react-icons/fa";
import { DeleteSprintModal } from "./DeleteSprintModal";
import { ApiContext } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from '@chakra-ui/icons';

type Milestone = components["schemas"]["Milestone"];
type Task = components["schemas"]["Task"];
type Sprint = components["schemas"]["Sprint"];
type SprintView = components["schemas"]["SprintView"];

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

  // Get the ids of milestones that are already part of a sprint
  const milestonesInSprints: string[] = [];
  project.sprints?.map((sprint: any) => (
    sprint.milestones.map((milestone: Milestone) => (
      milestonesInSprints.push(milestone.id!)
    ))
  ));

  // Get the ids of tasks that are already part of a sprint
  const tasksInSprints: string[] = [];
  project.sprints?.map((sprint: any) => (
    sprint.tasks.map((task: Task) => (
      tasksInSprints.push(task.id!)
    ))
  ));

  // Function to truncate a string that is too long
  function truncateString(str: string, num: number) {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  }

  async function fetchProject() {
    const { data, error, response } = await client.GET("/projects/{id}", {
      params: {
        path: {
          id: project?.id!
        },
      },
    });

    if (error) {
      console.log(error);
    }

    return data;
  }

  // Request to add a milestone to a sprint
  async function addMilestone(newMilestone: Milestone) {
    const milestones = sprint.milestones.map((milestone: Milestone) => (
      milestone.id
    ));
    milestones.push(newMilestone.id);

    const { data, error, response } = await client.PATCH("/sprints/{id}", {
      params: {
        path: {
          id: sprint.id!
        },
      },
      body: {
        milestones: milestones,
      },
    });
    
    if (error) {
      console.log(error);
      toast({
        title: "Add Milestone to Sprint Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error adding the milestone to the sprint.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else if (response.status === 200) {
      // Fetch the updated project and update the project context
      let data = await fetchProject();

      console.log(data);
      if (data) {
        onProjectUpdated(data); // Update the project context
      }
    } else {
      console.log(response);
    }
  }

  // Request to remove milestone from a sprint
  async function removeMilestone(milestone: Milestone) {
    const milestones = sprint.milestones.map((milestone: Milestone) => (
      milestone.id
    )).filter((milestoneId: string) => (
      milestoneId !== milestone.id
    ));

    const { data, error, response } = await client.PATCH("/sprints/{id}", {
      params: {
        path: {
          id: sprint.id!
        },
      },
      body: {
        milestones: milestones,
      },
    });

    if (error) {
      console.log(error);
      toast({
        title: "Remove Milestone Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error removing the milestone from the sprint.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else if (response.status === 200) {
      // Fetch the updated project and update the project context
      let data = await fetchProject();

      console.log(data);
      if (data) {
        onProjectUpdated(data); // Update the project context
      }
    } else {
      console.log(response);
    }
  }

  // Request to add a task to a sprint
  async function addTask(newTask: Task) {
    const tasks = sprint.tasks.map((task: Task) => (
      task.id
    ));
    tasks.push(newTask.id);

    const { data, error, response } = await client.PATCH("/sprints/{id}", {
      params: {
        path: {
          id: sprint.id!
        },
      },
      body: {
        tasks: tasks,
      },
    });
    
    if (error) {
      console.log(error);
      toast({
        title: "Add Task to Sprint Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error adding the task to the sprint.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else if (response.status === 200) {
      // Fetch the updated project and update the project context
      let data = await fetchProject();

      console.log(data);
      if (data) {
        onProjectUpdated(data); // Update the project context
      }
    } else {
      console.log(response);
    }
  }

  // Request to remove milestone from a sprint
  async function removeTask(task: Task) {
    const tasks = sprint.tasks.map((task: Task) => (
      task.id
    )).filter((taskId: string) => (
      taskId !== task.id
    ));

    const { data, error, response } = await client.PATCH("/sprints/{id}", {
      params: {
        path: {
          id: sprint.id!
        },
      },
      body: {
        tasks: tasks,
      },
    });

    if (error) {
      console.log(error);
      toast({
        title: "Remove Task Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error removing the task from the sprint.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else if (response.status === 200) {
      // Fetch the updated project and update the project context
      let data = await fetchProject();

      console.log(data);
      if (data) {
        onProjectUpdated(data); // Update the project context
      }
    } else {
      console.log(response);
    }
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
      let data = await fetchProject();

      if (data) {
        onProjectUpdated(data); // Update the project context
      }
    } else {
      console.log(response);
    }
  }

  return (
    <AccordionItem>
      <Heading>
      <AccordionButton border="1px" borderColor={'gray.200'} alignContent="center" minH={16}>
          <Box as="span" flex='1' textAlign='left'>
          {sprint.name}
          </Box>
          <Spacer />
          <Box mr={3}>
            {new Date(sprint.startDate).toDateString()}
          </Box>
          <Box mr={3}>
            ---
          </Box>
          <Box mr={10}>
          {new Date(sprint.endDate).toDateString()}
          </Box>
          <AccordionIcon />
      </AccordionButton>
      </Heading>
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
              aria-label="Delete Sprint"
              size="lg"
              fontSize={32}
              variant='ghost'
              icon={<FaWindowClose />}
              onClick={onOpenDeleteSprintModal}
            />
            <IconButton
              colorScheme="teal"
              _hover={{
                  background: "white",
                  color: "teal.700",
              }}
              aria-label="Edit Sprint"
              size="lg"
              fontSize={32}
              variant='ghost'
              icon={<FaEdit />}
              onClick={() => navigate("/editsprint", {state: {sprint: sprint}})}
            />
          </HStack>
          <TableContainer>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th>Assigned To</Th>
                  <Th>Due Date</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {sprint.milestones?.map((milestone: Milestone) => (
                  <Tr key={milestone.id}>
                    <Td>Milestone</Td>
                    <Td w={"50%"} whiteSpace={"normal"} wordBreak={"break-word"}>{truncateString(milestone.name, 50)}</Td>
                    <Td>{milestone.status}</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td>{new Date(milestone.dueDate).toDateString()}</Td>
                    <Td>
                      <IconButton
                      colorScheme="red"
                      _hover={{
                          background: "white",
                          color: "red.700",
                      }}
                      aria-label="Remove Milestone"
                      size="lg"
                      fontSize={32}
                      variant='ghost'
                      icon={<FaWindowClose />}
                      onClick={() => {removeMilestone(milestone)}}
                      />
                    </Td>
                  </Tr>
                ))}
                {sprint.tasks?.map((task: Task) => (
                  <>
                    <Tr key={task.id}>
                      <Td>Task</Td>
                      <Td w={"50%"} whiteSpace={"normal"} wordBreak={"break-word"}><Wrap>{truncateString(task.name, 50)}</Wrap></Td>
                      <Td>{task.status}</Td>
                      <Td>{task.priority}</Td>
                      <Td>{
                        <Tooltip label={task.assignedTo}>
                          <Avatar name={task.assignedTo}/>
                        </Tooltip>
                        }</Td>
                      <Td>{new Date(task.dueDate).toDateString()}</Td>
                      <Td>
                        <IconButton
                        colorScheme="red"
                        _hover={{
                            background: "white",
                            color: "red.700",
                        }}
                        aria-label="Remove Task"
                        size="lg"
                        fontSize={32}
                        variant='ghost'
                        icon={<FaWindowClose />}
                        onClick={() => {removeTask(task)}}
                        />
                      </Td>
                    </Tr>
                    <Tr key={task.id}>
                      <Td>QA Task</Td>
                      <Td w={"30%"} whiteSpace={"normal"} wordBreak={"break-word"}><Wrap>{truncateString(task.qaTask.name, 50)}</Wrap></Td>
                      <Td>{task.qaTask.status}</Td>
                      <Td>{task.qaTask.priority}</Td>
                      <Td>{
                        <Tooltip label={task.qaTask.assignedTo}>
                          <Avatar name={task.qaTask.assignedTo}/>
                        </Tooltip>
                        }</Td>
                      <Td>{new Date(task.qaTask.dueDate).toDateString()}</Td>
                      <Td></Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Menu>           
            <MenuButton as={Button} colorScheme="teal" rightIcon={<ChevronDownIcon />}>
              <Text>Add Milestone/Task</Text>
            </MenuButton>
            <MenuList maxHeight={"40vh"} overflowY={"scroll"}>
            <HStack m={3} pb={3} spacing={10} borderBottom="1px" borderColor={'gray.200'}>
              <Box fontWeight="bold" w="50vw">
                  Title
              </Box>
              <Box fontWeight="bold" w="10vw">
                  Priority
              </Box>

              <Box fontWeight="bold" w="10vw">
                  Due Date
              </Box>
            </HStack>
            {project?.milestones?.filter((milestone) => (
              !milestonesInSprints.includes(milestone.id!)
            )).map((milestone) => (
              <Box>
                <MenuItem
                  key={milestone.id}
                  onClick={() => { addMilestone(milestone) }}
                >
                  <HStack spacing={10}>
                    <Box w="50vw">
                      {milestone.name}
                    </Box>
                    <Box w="10vw">
                      {}
                    </Box>
                    <Box w="10vw">
                        {new Date(milestone.dueDate).toDateString()}
                    </Box>
                  </HStack>
                </MenuItem>
                <MenuDivider />
              </Box>
            ))}
            {project?.tasks?.filter((task) => (
              !tasksInSprints.includes(task.id!)
            )).map((task) => (
              <Box>
                <MenuItem
                  key={task.id}
                  onClick={() => { addTask(task) }}
                >
                  <HStack spacing={10}>
                    <Box w="50vw">
                      {task.name}
                    </Box>
                    <Box w="10vw">
                      {task.priority}
                    </Box>
                    <Box w="10vw">
                        {new Date(task.dueDate).toDateString()}
                    </Box>
                  </HStack>
                </MenuItem>
                <MenuDivider />
              </Box>
            ))}
            </MenuList>
          </Menu>
        </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}