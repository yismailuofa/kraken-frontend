import { VStack, Stack, Heading, Button, useToast, Menu, MenuList, MenuItem, HStack, Text, MenuButton, Divider, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext, MaybeProject } from "../contexts/ApiContext";
import { DateChooser } from "./DateChooser";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from '@chakra-ui/icons';


export function AddTaskForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const default_date = new Date();

  const fetchProjectUsers = async() => {
    if (project && project.id) {
      const { error, data } = await client.GET("/projects/{id}/users", {
        params: { path: { id: project.id } },
      });

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        initAvailableUsers(data);
      }
    }
  } 

  useEffect(() => {
    fetchProjectUsers();
  }, [client]);

  const initAvailableUsers = (data: any) => {
    if (data) {
      console.log(data);
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

  function updateMilestoneButton(mname: string) {
    const btn = document.getElementById("mnameString");
    if (btn) {
        btn.innerText = mname;
    }
  }

  return (
    <Formik
      initialValues={{
        taskName: "",
        description: "",
        dueDate: default_date.toISOString(),
        priority: undefined as "Low" | "Medium" | "High" | undefined,    
        milestoneId: "",
        qaTaskName: "",
        qaDescription: "",
        qaDueDate: default_date.toISOString(),
        qaPriority: undefined as "Low" | "Medium" | "High" | undefined,     
      }}
      validationSchema={Yup.object({
        taskName: Yup.string().required("Task name required"),
        qaTaskName: Yup.string().required("QA task name required"),
        milestoneId: Yup.string().required("Parent milestone required"),
      })}
      onSubmit={async (values, actions) => {
        actions.resetForm();

        const { data, error, response } = await client.POST("/tasks/", { body: { 
            name: values.taskName, 
            description: values.description,
            dueDate: values.dueDate,
            priority: values.priority, 
            status: "Todo", 
            assignedTo: "Unassigned",
            projectId: (project?.id || "") as string,
            milestoneId: values.milestoneId,
            dependentMilestones: [],
            dependentTasks: [],
            qaTask: {
              name: values.qaTaskName,
              description: values.qaDescription,
              dueDate: values.qaDueDate,
              priority: values.qaPriority,
              status: "Todo",
              assignedTo: "Unassigned"
            }
        }});

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
            w={{ base: "90%", md: 800 }}
            h="100vh"
            justifyContent="center"
          >
            <HStack>
            <FormLabel> Parent Milestone: </FormLabel> 
                <Menu>           
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Text id="mnameString">Select Parent Milestone</Text>
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
                    startDate={new Date()}
                />

                <HStack justifyContent="flex-start" width={"100%"}>
                    <FormLabel> Priority: </FormLabel> 
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
            </VStack>

            <Divider orientation="vertical" borderColor="gray.200" height="100%" />

            <VStack width="45%">
            <Heading>Create QA Task</Heading>
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
                startDate={new Date()}

            />

            <HStack justifyContent="flex-start" width={"100%"}>
                <FormLabel> QA Priority: </FormLabel> 
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

            </VStack>
            </HStack>

            <Stack spacing={4} direction="row" align="center">
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => navigate("/kanban")}
                width={"200px"}
              >
                Cancel
              </Button>

              <Button type="submit" colorScheme="teal" variant="solid" width={"200px"}>
                Create Task
              </Button>
            </Stack>
          </VStack>
        </form>
      )}
    </Formik>
  );
}
