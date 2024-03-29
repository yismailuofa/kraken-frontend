import React, { useState } from "react";
import {
    Flex,
    VStack,
    Stack,
    StackDivider,
    Box,
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormLabel,
    FormControl,
    Input,
    Heading,
    useToast,
    HStack,
    Spacer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Divider,
    Avatar,
    Tag,
    Tooltip,
    Center,
} from "@chakra-ui/react"
import { Draggable } from "react-beautiful-dnd";
import { Milestone, Task } from "../contexts/ApiContext";
import { useDisclosure } from '@chakra-ui/react'
import { DateChooser } from "./DateChooser";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { Formik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { ApiContext, MaybeProject } from "../contexts/ApiContext";
import { DeleteIcon, EditIcon, ChevronDownIcon } from "@chakra-ui/icons";

interface KanbanItemTaskProps {
    task: Task, 
    index: number, 
    updateParentTask: (updated: Task) => void, 
    deleteParentTask: (deleted: Task) => void
}

interface KanbanItemMilestoneProps{
    milestone: Milestone, 
    index: number, 
    change: any
}

interface KanbanItemQATaskProps {
    task: Task, 
    index: number, 
    updateParentTask: (updated: Task) => void, 
    deleteParentTask: (deleted: Task) => void
}

export function KanbanItemTask({task, index, updateParentTask, deleteParentTask} : KanbanItemTaskProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();
    const toast = useToast();
    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;

    const [taskItem, setTaskItem] = useState(task);

    let statusColor = "grey";

    if (task.priority === "High") {
        statusColor = "red";
    } else if (task.priority === "Medium") {
        statusColor = "yellow";
    } else if (task.priority === "Low") {
        statusColor = "green";
    }

    function updateMilestoneButton(mname: string) {
        const btn = document.getElementById("mnameString");
        if (btn) {
            btn.innerText = mname;
        }
    }

    function updateMenuButton(pri: string) {
        const btn = document.getElementById("priorityStr");
        if (btn) {
            btn.innerText = pri;
        }
      }
    
    function updateQAMenuButton(pri: string){
    const btn = document.getElementById("qaPriorityStr");
    if (btn) {
        btn.innerText = pri;
    }
    }

    const deleteTask = async () => {
        const { data, error, response } = await client.DELETE("/tasks/{id}", {
            params: {
                path: {
                    id: task.id || ""
                }
            },
        });

        if (error) {
        console.log(error);
        toast({
            title: "Task Deletion Failed",
            description: "There was an error deleting your task.",
            status: "error",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        } else if (response.status === 200) {
        toast({
            title: "Task Deleted",
            description: "Your task has been successfully deleted.",
            status: "success",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        }
    }

    function handleDeleteTask(){
        deleteModal.onClose();
        deleteTask();
        if (task)
            deleteParentTask(taskItem);
    }

    function handleUpdateTask(t: Task){
        if (t)
            updateParentTask(t);
    }

    return (
        // requires task id
        <Draggable draggableId={task.id || ""} index={index}>
            {(provided, snapshot) => (
                <>
                <Card
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                onClick={onOpen}    >
                    <CardBody>
                        <Box color={"gray"} fontSize={"small"}>  Task </Box>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box fontWeight={"bold"}>  {taskItem.name} </Box>
                            <HStack>
                                {task.assignedTo !== "Unassigned" &&
                                    <Tooltip label={task.assignedTo}>
                                        <Avatar name={task.assignedTo} size={"sm"} mr={2}></Avatar>
                                    </Tooltip>
                                }
                                <Tag colorScheme={statusColor}>{task.priority}</Tag>
                                <Spacer />
                                <EditIcon onClick={editModal.onOpen} color={"teal"} boxSize={5} mr={2} cursor={"pointer"}/>
                                <DeleteIcon onClick={deleteModal.onOpen} boxSize={5} color={"#C0302F"} cursor={"pointer"}/>
                            </HStack>
                        </Stack>
                    </CardBody>
                </Card>
                <Card opacity={0}><Text maxH={"10px"}> spacer </Text></Card>
                <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                size="full"
                isCentered
                >
                <ModalOverlay />
                <ModalContent maxW="900px">
                <ModalHeader>Edit Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                <Formik
                initialValues={{
                    taskName: taskItem.name,
                    description: taskItem.description,
                    dueDate: taskItem.dueDate,
                    priority: taskItem.priority,    
                    milestoneId: taskItem.milestoneId,
                    qaTaskName: taskItem.qaTask.name,
                    qaDescription: taskItem.qaTask.description,
                    qaDueDate: taskItem.qaTask.dueDate,
                    qaPriority: taskItem.qaTask.priority,     
                }}
                validationSchema={Yup.object({
                    taskName: Yup.string().required("Task name required"),
                    qaTaskName: Yup.string().required("QA task name required"),
                    milestoneId: Yup.string().required("Parent milestone required"),
                })}
                onSubmit={async (values, actions) => {
                    const { data, error, response } = await client.PATCH("/tasks/{id}", { 
                    params: {
                        path: {
                            id: taskItem.id || ""
                        }
                    },   
                    body: { 
                        name: values.taskName, 
                        description: values.description,
                        dueDate: values.dueDate,
                        priority: values.priority, 
                        projectId: (project?.id || "") as string,
                        milestoneId: values.milestoneId,
                        status: taskItem.status,
                        assignedTo: taskItem.assignedTo,
                        qaTask: {
                            name: values.qaTaskName,
                            description: values.qaDescription,
                            dueDate: values.qaDueDate,
                            priority: values.qaPriority,
                            status: taskItem.qaTask.status,
                            assignedTo: taskItem.qaTask.assignedTo
                        },
                        dependentMilestones: taskItem.dependentMilestones,
                        dependentTasks: taskItem.dependentTasks
                    }});

                    if (error) {
                    console.log(error);
                    actions.resetForm();
                    toast({
                        title: "Task Update Failed",
                        description: "There was an error updating your task.",
                        status: "error",
                        duration: 8000,
                        isClosable: true,
                        position: "top",
                    });
                    } else if (response.status === 200) {
                    toast({
                        title: "Task Updated",
                        description: "Your task has been successfully Updated.",
                        status: "success",
                        duration: 8000,
                        isClosable: true,
                        position: "top",
                    });
                    const newTaskItem: Task = {                        
                        name: values.taskName, 
                        description: values.description,
                        dueDate: values.dueDate,
                        priority: values.priority, 
                        milestoneId: values.milestoneId,
                        projectId: (project?.id || "") as string,
                        status: taskItem.status,
                        assignedTo: taskItem.assignedTo,
                        dependentMilestones: taskItem.dependentMilestones,
                        dependentTasks: taskItem.dependentTasks,
                        qaTask: {
                            name: values.qaTaskName,
                            description: values.qaDescription,
                            dueDate: values.qaDueDate,
                            priority: values.qaPriority,
                            status: taskItem.qaTask.status,
                            assignedTo: taskItem.qaTask.assignedTo,
                        },
                        id: taskItem.id,
                        createdAt: taskItem.createdAt
                    }
                    setTaskItem(newTaskItem);
                    console.log(newTaskItem.priority);
                    handleUpdateTask(newTaskItem);
                    actions.resetForm();
                    } else {
                    console.log(response);
                    }
                }}
                >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit}>
                    <VStack
                        mx="auto"
                        w={{ base: "90%", md: 800 }}
                        h="80vh"
                        justifyContent="center"
                    >
                        <HStack>
                        <FormLabel> Parent Milestone: </FormLabel> 
                            <Menu>           
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                <Text id="mnameString">{project?.milestones?.find(item => item.id === taskItem.milestoneId)?.name}</Text>
                                </MenuButton>
                                <MenuList>
                                {project?.milestones?.map((milestone) => (
                                    <MenuItem key={milestone.id} onClick={() => {
                                        formik.setFieldValue("milestoneId", milestone.id);
                                        updateMilestoneButton(milestone.name)
                                        }}>
                                            {milestone.name}
                                    </MenuItem>
                                ))}
                                </MenuList>
                            </Menu> 
                        </HStack>
                        <HStack justifyContent="space-between" width="100%" paddingBottom={"50px"}>
                            <VStack width="45%">
                            <Heading>Edit Task</Heading>

                            <TextField
                            id="taskName"
                            name="taskName"
                            label="Task Name"
                            type="text"
                            variant="filled"
                            fontFamily="'Raleway', sans-serif"
                            />

                            <TextArea
                            id="description"
                            name="description"
                            label="Task Description"
                            type="text"
                            fontFamily="'Raleway', sans-serif"
                            />
                            
                            <DateChooser
                                id="dueDate"
                                name="dueDate"
                                selectedDateString={formik.values.dueDate}
                                setSelectedDateString={(date) => formik.setFieldValue("dueDate", date)}
                                startDate={new Date(taskItem.dueDate.split("T")[0])}
                            />

                            <HStack justifyContent="flex-start" width={"100%"}>
                                <FormLabel> Priority: </FormLabel> 
                                <Menu>           
                                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    <Text id="priorityStr">{taskItem.priority}</Text>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => {
                                            formik.setFieldValue("priority", "Low");
                                            updateMenuButton("Low")
                                            }}> 
                                            Low 
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            formik.setFieldValue("priority", "Medium");
                                            updateMenuButton("Medium")
                                            }}> 
                                            Medium 
                                        </MenuItem>                        
                                        <MenuItem onClick={() => {
                                            formik.setFieldValue("priority", "High");
                                            updateMenuButton("High")
                                            }}> 
                                            High 
                                        </MenuItem>
                                    </MenuList>
                                </Menu>   
                        </HStack>
                        </VStack>

                        <Divider orientation="vertical" borderColor="gray.200" height="100%" />

                        <VStack width="45%">
                        <Heading>Edit QA Task</Heading>
                        <TextField
                        id="qaTaskName"
                        name="qaTaskName"
                        label="QA Task Name"
                        type="text"
                        variant="filled"
                        fontFamily="'Raleway', sans-serif"
                        />

                        <TextArea
                        id="qaDescription"
                        name="qaDescription"
                        label="QA Description"
                        type="text"
                        fontFamily="'Raleway', sans-serif"
                        />
                        
                        <DateChooser
                            id="qaDueDate"
                            name="qaDueDate"
                            selectedDateString={formik.values.qaDueDate}
                            setSelectedDateString={(date) => formik.setFieldValue("qaDueDate", date)}
                            startDate={new Date(taskItem.qaTask.dueDate.split("T")[0])}

                        />

                        <HStack justifyContent="flex-start" width={"100%"}>
                            <FormLabel> QA Priority: </FormLabel> 
                            <Menu>           
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                <Text id="qaPriorityStr">{taskItem.qaTask.priority}</Text>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => {
                                        formik.setFieldValue("qaPriority", "Low");
                                        updateQAMenuButton("Low")
                                        }}> 
                                        Low 
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        formik.setFieldValue("qaPriority", "Medium");
                                        updateQAMenuButton("Medium")
                                        }}> 
                                        Medium 
                                    </MenuItem>                        
                                    <MenuItem onClick={() => {
                                        formik.setFieldValue("qaPriority", "High");
                                        updateQAMenuButton("High")
                                        }}> 
                                        High 
                                    </MenuItem>
                                </MenuList>
                            </Menu>   
                        </HStack>

                        </VStack>
                        </HStack>

                        <Stack spacing={4} direction="row" align="center">
                        <Button
                            colorScheme="teal"
                            variant="solid"
                            onClick={editModal.onClose}
                            width={"200px"}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" colorScheme="teal" variant="solid" width={"200px"} onClick={editModal.onClose}>
                            Save
                        </Button>
                        </Stack>
                    </VStack>
                    </form>
                )}
                </Formik>
                </ModalBody>

                </ModalContent>
                </Modal>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.onClose}
                    size="lg"
                    isCentered
                >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Delete Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={3} align="left">
                        <Text>Are you sure you would like to delete this task?</Text>
                        <Text fontWeight={"bold"}>{task.name}</Text>
                    </VStack>
                </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='teal' mr={3} onClick={deleteModal.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' mr={3} variant="solid" onClick={handleDeleteTask} id="taskDeleteButton">Delete Task</Button>
                    </ModalFooter>
                </ModalContent>
                </Modal>
                </>
            )
            }
        </Draggable>
    )
}

export function KanbanItemMilestone({milestone, index, change} : KanbanItemMilestoneProps) {
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();
    // const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const toast = useToast();
    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;

    const [milestoneName, setMilestoneName] = useState(milestone.name)
    const [milestoneDescription, setMilestoneDescription] = useState(milestone.description)
    const [milestoneDueDate, setMilestoneDueDate] = useState(milestone.dueDate)

    const deleteMilestone = async () => {
        const { data, error, response } = await client.DELETE("/milestones/{id}", {
            params: {
                path: {
                    id: milestone.id || ""
                }
            },
        });

        if (error) {
        console.log(error);
        toast({
            title: "Milestone Deletion Failed",
            description: "There was an error deleting your milestone.",
            status: "error",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        } else if (response.status === 200) {
        toast({
            title: "Milestone Deleted",
            description: "Your milestone has been successfully deleted.",
            status: "success",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        }
    }

    function handleDeleteMilestone() {
        deleteModal.onClose();
        deleteMilestone();
        change(milestone);
    }

    return (
        // requires task id
        <Draggable draggableId={milestone.id || ""} index={index}>
            {(provided, snapshot) => (
                <>
                <Card
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                    <CardBody>                            
                        <Box color={"gray"} fontSize={"small"}>  Milestone </Box>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>  
                                <FormLabel fontWeight={"bold"}>{milestoneName}</FormLabel>
                            </Box>
                            <HStack>
                                <Spacer />
                                <EditIcon onClick={editModal.onOpen} color={"teal"} boxSize={5} mr={2} cursor={"pointer"}/>
                                <DeleteIcon onClick={deleteModal.onOpen} boxSize={5} color={"#C0302F"} cursor={"pointer"}/>
                            </HStack>
                        </Stack>
                    </CardBody>
                </Card>
                <Card opacity={0}><Text maxH={"10px"}> spacer </Text></Card>
                <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                size="full"
                isCentered
                >
                <ModalOverlay />
                <ModalContent maxW="900px">
                <ModalHeader>Edit Milestone</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                <Formik
                initialValues={{
                    milestoneName: milestoneName,
                    description: milestoneDescription,
                    dueDate: milestoneDueDate,
                }}
                validationSchema={Yup.object({
                    milestoneName: Yup.string().required("Milestone name required"),
                    description: Yup.string().required("Milestone description required"),
                })}
                onSubmit={async (values, actions) => {
                    actions.resetForm();

                    const { data, error, response } = await client.PATCH("/milestones/{id}", {
                        params: {
                            path: {
                                id: milestone.id || ""
                            }
                        },
                        body: {
                            name: values.milestoneName,
                            description: values.description,
                            dueDate: values.dueDate,
                        }
                    });

                    if (error) {
                    console.log(error);
                    toast({
                        title: "Milestone Modification Failed",
                        description: "There was an error modifying your milestone.",
                        status: "error",
                        duration: 8000,
                        isClosable: true,
                        position: "top",
                    });
                    } else if (response.status === 200) {
                    actions.resetForm();
                    toast({
                        title: "Milestone Updated",
                        description: "Your milestone has been successfully updated.",
                        status: "success",
                        duration: 8000,
                        isClosable: true,
                        position: "top",
                    });
                    setMilestoneName(values.milestoneName)
                    setMilestoneDescription(values.description)
                    setMilestoneDueDate(values.dueDate)

                    } else {
                    console.log(response);
                    }
                }}
                >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit}>
                    <VStack
                        mx="auto"
                        w={{ base: "90%", md: 500 }}
                        h="70vh"
                        justifyContent="center"
                    >
                        <Heading>Edit Milestone</Heading>

                        <TextField
                        id="milestoneName"
                        name="milestoneName"
                        label="Milestone Name"
                        type="text"
                        variant="filled"
                        placeholder={milestoneName}
                        />

                        <TextArea
                        id="description"
                        name="description"
                        label="Description"
                        type="text"
                        placeholder={milestoneDescription}
                        />

                        <DateChooser
                            id="dueDate"
                            name="dueDate"
                            selectedDateString={formik.values.dueDate}
                            setSelectedDateString={(date) => formik.setFieldValue("dueDate", date)}
                            startDate={new Date(milestoneDueDate.split("T")[0])}
                        />

                        <Stack spacing={4} direction="row" align="center">
                        <Button
                            colorScheme="teal"
                            variant="solid"
                            onClick={editModal.onClose}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" colorScheme="teal" variant="solid" onClick={editModal.onClose}>
                            Save
                        </Button>
                        </Stack>
                    </VStack>
                    </form>
                )}
                </Formik>
                </ModalBody>
    
                </ModalContent>
                </Modal>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.onClose}
                    size="lg"
                    isCentered
                >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Delete Milestone</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={3} align="left">
                        <Text>Are you sure you would like to delete this milestone?</Text>
                        <Text fontWeight={"bold"}>{milestone.name}</Text>
                        <HStack>
                            <Text color={"red"} fontWeight={"bold"}>Warning:</Text>
                            <Text>All of the milestone's subtasks will be deleted</Text>
                        </HStack>
                    </VStack>
                </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='teal' mr={3} onClick={deleteModal.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' mr={3} variant="solid" onClick={handleDeleteMilestone} id="milestoneDeleteButton">Delete Milestone</Button>
                    </ModalFooter>
                </ModalContent>
                </Modal>
                </>
            )
            }
        </Draggable>
    )
}

export function KanbanItemQATask({task, index, updateParentTask, deleteParentTask} : KanbanItemQATaskProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const editModal = useDisclosure();
    const deleteModal = useDisclosure();
    const toast = useToast();
    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;

    const [taskItem, setTaskItem] = useState(task);
    const dragId = taskItem.id + "QA";

    let statusColor = "grey";

    if (task.qaTask.priority === "High") {
        statusColor = "red";
    } else if (task.qaTask.priority === "Medium") {
        statusColor = "yellow";
    } else if (task.qaTask.priority === "Low") {
        statusColor = "green";
    }

    function updateMilestoneButton(mname: string) {
        const btn = document.getElementById("mnameStringQA");
        if (btn) {
            btn.innerText = mname;
        }
    }

    function updateMenuButton(pri: string) {
        const btn = document.getElementById("priorityStrQA");
        if (btn) {
            btn.innerText = pri;
        }
      }
    
    function updateQAMenuButton(pri: string){
    const btn = document.getElementById("qaPriorityStrQA");
    if (btn) {
        btn.innerText = pri;
    }
    }

    const deleteTask = async () => {
        const { data, error, response } = await client.DELETE("/tasks/{id}", {
            params: {
                path: {
                    id: task.id || ""
                }
            },
        });

        if (error) {
        console.log(error);
        toast({
            title: "Task Deletion Failed",
            description: "There was an error deleting your task.",
            status: "error",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        } else if (response.status === 200) {
        toast({
            title: "Task Deleted",
            description: "Your task has been successfully deleted.",
            status: "success",
            duration: 8000,
            isClosable: true,
            position: "top",
        });
        }
    }

    function handleDeleteTask(){
        deleteModal.onClose();
        deleteTask();
        deleteParentTask(task);
    }

    function handleUpdateTask(t: Task){
        if (t)
            updateParentTask(t);
    }

    return (
        // requires task id
        <Draggable draggableId={dragId || ""} index={index}>
            {(provided, snapshot) => (
                <>
                <Card
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                onClick={onOpen}    >
                    <CardBody>
                        <Box color={"gray"} fontSize={"small"}>  QA Task </Box>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box fontWeight={"bold"}>  {taskItem.qaTask.name} </Box>
                            <HStack>
                                {task.qaTask.assignedTo !== "Unassigned" &&
                                    <Tooltip label={task.qaTask.assignedTo}>
                                        <Avatar name={task.qaTask.assignedTo} size={"sm"} mr={2}></Avatar>
                                    </Tooltip>
                                }
                                <Tag colorScheme={statusColor}>{task.qaTask.priority}</Tag>
                                <Spacer />
                                <EditIcon onClick={editModal.onOpen} color={"teal"} boxSize={5} mr={2} cursor={"pointer"}/>
                                <DeleteIcon onClick={deleteModal.onOpen} boxSize={5} color={"#C0302F"} cursor={"pointer"}/>
                            </HStack>
                        </Stack>
                    </CardBody>
                </Card>
                <Card opacity={0}><Text maxH={"10px"}> spacer </Text></Card>
                <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                size="full"
                >
                <ModalOverlay />
                <ModalContent maxW="900px">
                <ModalHeader>Edit Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                <Formik
                initialValues={{
                    taskName: taskItem.name,
                    description: taskItem.description,
                    dueDate: taskItem.dueDate,
                    priority: taskItem.priority,    
                    milestoneId: taskItem.milestoneId,
                    qaTaskName: taskItem.qaTask.name,
                    qaDescription: taskItem.qaTask.description,
                    qaDueDate: taskItem.qaTask.dueDate,
                    qaPriority: taskItem.qaTask.priority,     
                }}
                validationSchema={Yup.object({
                    taskName: Yup.string().required("Task name required"),
                    qaTaskName: Yup.string().required("QA task name required"),
                    milestoneId: Yup.string().required("Parent milestone required"),
                })}
                onSubmit={async (values, actions) => {
                    const { data, error, response } = await client.PATCH("/tasks/{id}", { 
                    params: {
                        path: {
                            id: taskItem.id || ""
                        }
                    },   
                    body: { 
                        name: values.taskName, 
                        description: values.description,
                        dueDate: values.dueDate,
                        priority: values.priority, 
                        projectId: (project?.id || "") as string,
                        milestoneId: values.milestoneId,
                        status: taskItem.status,
                        assignedTo: taskItem.assignedTo,
                        qaTask: {
                            name: values.qaTaskName,
                            description: values.qaDescription,
                            dueDate: values.qaDueDate,
                            priority: values.qaPriority,
                            status: taskItem.qaTask.status,
                            assignedTo: taskItem.qaTask.assignedTo
                        },
                        dependentMilestones: taskItem.dependentMilestones,
                        dependentTasks: taskItem.dependentTasks
                    }});

                    if (error) {
                    console.log(error);
                    actions.resetForm();
                    toast({
                        title: "Task Update Failed",
                        description: "There was an error updating your task.",
                        status: "error",
                        duration: 8000,
                        isClosable: true,
                        position: "top",
                    });
                    } else if (response.status === 200) {
                    toast({
                        title: "Task Updated",
                        description: "Your task has been successfully Updated.",
                        status: "success",
                        duration: 8000,
                        isClosable: true,
                        position: "top",
                    });
                    const newTaskItem: Task = {                        
                        name: values.taskName, 
                        description: values.description,
                        dueDate: values.dueDate,
                        priority: values.priority, 
                        milestoneId: values.milestoneId,
                        projectId: (project?.id || "") as string,
                        status: taskItem.status,
                        assignedTo: taskItem.assignedTo,
                        dependentMilestones: taskItem.dependentMilestones,
                        dependentTasks: taskItem.dependentTasks,
                        qaTask: {
                            name: values.qaTaskName,
                            description: values.qaDescription,
                            dueDate: values.qaDueDate,
                            priority: values.qaPriority,
                            status: taskItem.qaTask.status,
                            assignedTo: taskItem.qaTask.assignedTo,
                        },
                        id: taskItem.id,
                        createdAt: taskItem.createdAt
                    }
                    setTaskItem(newTaskItem);
                    console.log(newTaskItem.qaTask.priority);
                    handleUpdateTask(newTaskItem);
                    actions.resetForm();
                    } else {
                    console.log(response);
                    }
                }}
                >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit}>
                    <VStack
                        mx="auto"
                        w={{ base: "90%", md: 800 }}
                        h="80vh"
                        justifyContent="center"
                    >
                        <HStack>
                        <FormLabel> Parent Milestone: </FormLabel> 
                            <Menu>           
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                <Text id="mnameStringQA">{project?.milestones?.find(item => item.id === taskItem.milestoneId)?.name}</Text>
                                </MenuButton>
                                <MenuList>
                                {project?.milestones?.map((milestone) => (
                                    <MenuItem key={milestone.id} onClick={() => {
                                        formik.setFieldValue("milestoneId", milestone.id);
                                        updateMilestoneButton(milestone.name)
                                        }}>
                                            {milestone.name}
                                    </MenuItem>
                                ))}
                                </MenuList>
                            </Menu> 
                        </HStack>
                        <HStack justifyContent="space-between" width="100%" paddingBottom={"50px"}>
                            <VStack width="45%">
                            <Heading>Edit Task</Heading>

                            <TextField
                            id="taskName"
                            name="taskName"
                            label="Task Name"
                            type="text"
                            variant="filled"
                            fontFamily="'Raleway', sans-serif"
                            />

                            <TextArea
                            id="description"
                            name="description"
                            label="Task Description"
                            type="text"
                            fontFamily="'Raleway', sans-serif"
                            />
                            
                            <DateChooser
                                id="dueDate"
                                name="dueDate"
                                selectedDateString={formik.values.dueDate}
                                setSelectedDateString={(date) => formik.setFieldValue("dueDate", date)}
                                startDate={new Date(taskItem.dueDate.split("T")[0])}
                            />

                            <HStack justifyContent="flex-start" width={"100%"}>
                                <FormLabel> Priority: </FormLabel> 
                                <Menu>           
                                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    <Text id="priorityStrQA">{taskItem.priority}</Text>
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => {
                                            formik.setFieldValue("priority", "Low");
                                            updateMenuButton("Low")
                                            }}> 
                                            Low 
                                        </MenuItem>
                                        <MenuItem onClick={() => {
                                            formik.setFieldValue("priority", "Medium");
                                            updateMenuButton("Medium")
                                            }}> 
                                            Medium 
                                        </MenuItem>                        
                                        <MenuItem onClick={() => {
                                            formik.setFieldValue("priority", "High");
                                            updateMenuButton("High")
                                            }}> 
                                            High 
                                        </MenuItem>
                                    </MenuList>
                                </Menu>   
                        </HStack>
                        </VStack>

                        <Divider orientation="vertical" borderColor="gray.200" height="100%" />

                        <VStack width="45%">
                        <Heading>Edit QA Task</Heading>
                        <TextField
                        id="qaTaskName"
                        name="qaTaskName"
                        label="QA Task Name"
                        type="text"
                        variant="filled"
                        fontFamily="'Raleway', sans-serif"
                        />

                        <TextArea
                        id="qaDescription"
                        name="qaDescription"
                        label="QA Description"
                        type="text"
                        fontFamily="'Raleway', sans-serif"
                        />
                        
                        <DateChooser
                            id="qaDueDate"
                            name="qaDueDate"
                            selectedDateString={formik.values.qaDueDate}
                            setSelectedDateString={(date) => formik.setFieldValue("qaDueDate", date)}
                            startDate={new Date(taskItem.qaTask.dueDate.split("T")[0])}

                        />

                        <HStack justifyContent="flex-start" width={"100%"}>
                            <FormLabel> QA Priority: </FormLabel> 
                            <Menu>           
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                <Text id="qaPriorityStrQA">{taskItem.qaTask.priority}</Text>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => {
                                        formik.setFieldValue("qaPriority", "Low");
                                        updateQAMenuButton("Low")
                                        }}> 
                                        Low 
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        formik.setFieldValue("qaPriority", "Medium");
                                        updateQAMenuButton("Medium")
                                        }}> 
                                        Medium 
                                    </MenuItem>                        
                                    <MenuItem onClick={() => {
                                        formik.setFieldValue("qaPriority", "High");
                                        updateQAMenuButton("High")
                                        }}> 
                                        High 
                                    </MenuItem>
                                </MenuList>
                            </Menu>   
                        </HStack>

                        </VStack>
                        </HStack>

                        <Stack spacing={4} direction="row" align="center">
                        <Button
                            colorScheme="teal"
                            variant="solid"
                            onClick={editModal.onClose}
                            width={"200px"}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" colorScheme="teal" variant="solid" width={"200px"} onClick={editModal.onClose}>
                            Save
                        </Button>
                        </Stack>
                    </VStack>
                    </form>
                )}
                </Formik>
                </ModalBody>

                </ModalContent>
                </Modal>
                <Modal
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.onClose}
                    size="lg"
                    isCentered
                >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Delete QA Task</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={3} align="left">
                        <Text>Are you sure you would like to delete this QA task?</Text>
                        <Text fontWeight={"bold"}>{task.qaTask.name}</Text>
                        <HStack>
                            <Text color={"red"} fontWeight={"bold"}>Warning:</Text>
                            <Text>The associated task <b>{task.name}</b> will be deleted</Text>
                        </HStack>
                    </VStack>
                </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='teal' mr={3} onClick={deleteModal.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' mr={3} variant="solid" onClick={handleDeleteTask} id="taskDeleteButton">Delete Task</Button>
                    </ModalFooter>
                </ModalContent>
                </Modal>
                </>
            )
            }
        </Draggable>
    )
}