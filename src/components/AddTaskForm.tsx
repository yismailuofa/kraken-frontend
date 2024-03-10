import { VStack, Stack, Heading, Button, useToast, Menu, MenuList, MenuItem, HStack, Text, MenuButton } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext, MaybeProject } from "../contexts/ApiContext";
import { DateChooser } from "./DateChooser";
import { useState } from "react";
import {ChevronDownIcon} from '@chakra-ui/icons';

export function AddTaskForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;

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

  return (
    <Formik
      initialValues={{
        taskName: "",
        description: "",
        dueDate: "",
        priority: undefined as "Low" | "Medium" | "High" | undefined,    
        qaTaskName: "",
        qaDescription: "",
        qaDueDate: "",
        qaPriority: undefined as "Low" | "Medium" | "High" | undefined,     
      }}
      validationSchema={Yup.object({
        taskName: Yup.string().required("Task name required"),
        qaTaskName: Yup.string().required("Task name required"),
      })}
      onSubmit={async (values, actions) => {
        alert(JSON.stringify(values, null, 1));
        actions.resetForm();

        // const { data, error, response } = await client.POST("/tasks/", { body: { 
        //     name: values.taskName, 
        //     description: values.description,
        //     dueDate: values.dueDate,
        //     priority: values.priority, 
        //     status: "Todo", 
        //     assignedTo: "Unassigned",
        //     projectId: (project?.id || "") as string,
        //     milestoneId: "",
        //     dependentMilestones: [],
        //     dependentTasks: [],
        //     qaTask: {
        //       name: values.qaTaskName,
        //       description: values.qaDescription,
        //       dueDate: values.qaDueDate,
        //       priority: values.qaPriority,
        //       status: "Todo",
        //       assignedTo: "Unassigned"
        //     }
        // }});

        console.log(project?.id)

        const { data, error, response } = await client.POST("/tasks/", { body: { 
            name: "a", 
            description: "a",
            dueDate: "2011-10-05T14:48:00.000Z",
            priority: "Low", 
            status: "Todo", 
            assignedTo: "Unassigned",
            projectId: (project?.id || "") as string,
            milestoneId: "1",
            dependentMilestones: [],
            dependentTasks: [],
            qaTask: {
              name: "b",
              description: "b",
              dueDate: "2011-10-05T14:48:00.000Z",
              priority: "Low",
              status: "Todo",
              assignedTo: "Unassigned"
            }
        }});


        // If there is an error creating the project notify the user with a toast message
        if (error) {
          console.log(error);
          toast({
            title: "Task Creation Failed",
            description: "There was an error creating your task.",
            status: "error",
            duration: 8000,
            isClosable: true,
            position: "top",
          });
          // If the response is valid naviagte to the project list page and notify the user with a success toast message
        } else if (response.status === 200) {
          actions.resetForm();
          navigate("/kanban");
          toast({
            title: "Task Created",
            description: "Your task has been successfully created.",
            status: "success",
            duration: 8000,
            isClosable: true,
            position: "top",
          });
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
            h="100vh"
            justifyContent="center"
          >
            <Heading>Create Task</Heading>

            <TextField
              id="taskName"
              name="taskName"
              label="Task Name"
              type="text"
              variant="filled"
              placeholder="enter task name..."
              fontFamily="'Raleway', sans-serif"
            />

            <TextArea
              id="description"
              name="description"
              label="Task Description"
              type="text"
              placeholder="enter task description..."
              fontFamily="'Raleway', sans-serif"
            />
            
            <DateChooser
                id="dueDate"
                name="dueDate"
                selectedDateString={formik.values.dueDate}
                setSelectedDateString={(date) => formik.setFieldValue("dueDate", date)}
            />

            <HStack justifyContent="flex-start" width={"100%"}>
                <Text> Priority: </Text> 
                <Menu>           
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Text id="priorityStr">Change Priority</Text>
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

            <TextField
              id="qaTaskName"
              name="qaTaskName"
              label="QA Task Name"
              type="text"
              variant="filled"
              placeholder="enter quality assurance task name..."
              fontFamily="'Raleway', sans-serif"
            />

            <TextArea
              id="qaDescription"
              name="qaDescription"
              label="QA Description"
              type="text"
              placeholder="enter quality assurance task description..."
              fontFamily="'Raleway', sans-serif"
            />
            
            <DateChooser
                id="qaDueDate"
                name="qaDueDate"
                selectedDateString={formik.values.qaDueDate}
                setSelectedDateString={(date) => formik.setFieldValue("qaDueDate", date)}
            />

            <HStack justifyContent="flex-start" width={"100%"}>
                <Text> QA Priority: </Text> 
                <Menu>           
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Text id="qaPriorityStr">Change QA Priority</Text>
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

            <Stack spacing={4} direction="row" align="center">
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => navigate("/kanban")}
              >
                Cancel
              </Button>

              <Button type="submit" colorScheme="teal" variant="solid">
                Create Task
              </Button>
            </Stack>
          </VStack>
        </form>
      )}
    </Formik>
  );
}
