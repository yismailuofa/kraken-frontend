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



function viewTaskDetail(task: Task){
}

export function KanbanItemTask({task, index} : {task: Task, index: number}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
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
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>  #{task.id} </Box>
                            <Box>  {task.name} </Box>
                        </Stack>
                    </CardBody>
                </Card>
                <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Create your account</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                    <FormLabel>First name</FormLabel>
                    <Input ref={initialRef} placeholder='First name' />
                    </FormControl>
    
                    <FormControl mt={4}>
                    <FormLabel>Last name</FormLabel>
                    <Input placeholder='Last name' />
                    </FormControl>
                </ModalBody>
    
                <ModalFooter>
                    <Button colorScheme='blue' mr={3}>
                    Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
                </Modal>
                </>
            )
            }
        </Draggable>
    )
}

export function KanbanItemMilestone({milestone, index} : {milestone: Milestone, index: number}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    const toast = useToast();
    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;

    const [milestoneName, setMilestoneName] = useState(milestone.name)
    const [milestoneDescription, setMilestoneDescription] = useState(milestone.description)
    const [milestoneDueDate, setMilestoneDueDate] = useState(milestone.dueDate)


    return (
        // requires task id
        <Draggable draggableId={milestone.id || ""} index={index}>
            {(provided, snapshot) => (
                <>
                <Card
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                onClick={onOpen}>
                    <CardBody>
                        <Stack divider={<StackDivider />} spacing='4'>
                            <Box>  #{milestone.id} </Box>
                            <Box>  {milestoneName} </Box>
                        </Stack>
                    </CardBody>
                </Card>
                <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
                size="xl"
                >
                <ModalOverlay />
                <ModalContent>
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
                    alert(JSON.stringify(values, null, 2));
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
                        <Heading>Update Milestone</Heading>

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
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" colorScheme="teal" variant="solid" onClick={onClose}>
                            Update Milestone
                        </Button>
                        </Stack>
                    </VStack>
                    </form>
                )}
                </Formik>
                </ModalBody>
    
                {/* <ModalFooter>
                    <Button colorScheme='blue' mr={3}>
                    Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter> */}
                </ModalContent>
                </Modal>
                </>
            )
            }
        </Draggable>
    )
}