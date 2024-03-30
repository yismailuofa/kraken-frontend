import { VStack, Stack, Heading, Button, useToast, Menu, MenuList, MenuItem, HStack, Text, MenuButton, Divider, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext, MaybeProject, MaybeUser } from "../contexts/ApiContext";
import { DateChooser } from "./DateChooser";
import { useState, useEffect } from "react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import Multiselect from 'multiselect-react-dropdown';

interface ProjUser { id: string | null, username: string, email: string }

export function AddTaskForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const default_date = new Date();

  const [projectUsers, setProjectUsers] = useState<ProjUser[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);

  const possibleChildTasks = project?.tasks?.map(({ name, id }) => {
    return { name: name, id: id };
  });

  const possibleChildMilestones = project?.milestones?.map(({name, id}) => {
    return { name: name, id: id };
  });

  const task_state = {
    options: possibleChildTasks,
    selectedValue:[] 
  };

  const milestone_state = {
    options: possibleChildMilestones,
    selectedValue:[] 
  };

  function onTaskSelect(selectedList: any, selectedItem: any) {
    const selectedTask = project?.tasks?.find((item) => item.id === selectedItem.id);
    console.log(selectedTask);

    if (selectedTask && selectedTask.id){
      const newList = [...selectedTasks, selectedTask.id];
      setSelectedTasks(newList);
    }
  }

  function onTaskRemove(selectedList: any, selectedItem: any) {
    const selectedTask = project?.tasks?.find((item) => item.id === selectedItem.id);

    if (selectedTask && selectedTask.id){
      const newList = selectedTasks.filter((item) => item !== selectedTask.id);
      setSelectedTasks(newList);
    }
  }

  function onMilestoneSelect(selectedList: any, selectedItem: any) {
    const selectedM = project?.milestones?.find((item) => item.id === selectedItem.id);

    if (selectedM && selectedM.id){
      const newList = [...selectedMilestones, selectedM.id];
      setSelectedMilestones(newList);
    }
  }

  function onMilestoneRemove(selectedList: any, selectedItem: any) {
    const selectedM = project?.milestones?.find((item) => item.id === selectedItem.id);

    if (selectedM && selectedM.id){
      const newList = selectedMilestones.filter((item) => item !== selectedM.id);
      setSelectedMilestones(newList);
    }
  }

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
        setProjectUsers(data);
      }
    }
  } 

  useEffect(() => {
    fetchProjectUsers();
  }, [client]);

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

  function updateAssignButton(a: string) {
    const btn = document.getElementById("assignStr");
    if (btn) {
        btn.innerText = a;
    }
  }

  function updateQAAssignButton(a: string) {
    const btn = document.getElementById("qaAssignStr");
    if (btn) {
        btn.innerText = a;
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
        assignTo: "",
        qaTaskName: "",
        qaDescription: "",
        qaDueDate: default_date.toISOString(),
        qaPriority: undefined as "Low" | "Medium" | "High" | undefined,   
        qaAssignTo:""  
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
            status: "To Do", 
            assignedTo: values.assignTo,
            projectId: (project?.id || "") as string,
            milestoneId: values.milestoneId,
            dependentMilestones: selectedMilestones,
            dependentTasks: selectedTasks,
            qaTask: {
              name: values.qaTaskName,
              description: values.qaDescription,
              dueDate: values.qaDueDate,
              priority: values.qaPriority,
              status: "To Do",
              assignedTo: values.qaAssignTo
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

                <HStack justifyContent="space-between" width={"100%"}>
                    <FormLabel> Priority: </FormLabel> 
                    <Menu>           
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Text id="priorityStr">Medium</Text>
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

            <HStack justifyContent="space-between" width={"100%"}>
                    <FormLabel> Assign To: </FormLabel> 
                    <Menu>           
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Text id="assignStr"></Text>
                        </MenuButton>
                        <MenuList>
                        {projectUsers.map((user) => 
                          <MenuItem onClick={() => {
                            formik.setFieldValue("assignTo", user.username);
                            updateAssignButton(user.username)
                            }}
                            key={user.id}> 
                            {user.username}
                          </MenuItem>)}
                        </MenuList>
                    </Menu>   
            </HStack>

            <HStack justifyContent="space-between" width={"100%"}>
              <FormLabel>Dependent Tasks:</FormLabel>
              <Multiselect
              options={task_state.options} // Options to display in the dropdown
              selectedValues={task_state.selectedValue} // Preselected value to persist in dropdown
              displayValue="name" // Property name to display in the dropdown options
              onSelect={onTaskSelect}
              onRemove={onTaskRemove}
              />
            </HStack>

            <HStack justifyContent="space-between" width={"100%"}>
              <FormLabel>Dependent Milestones:</FormLabel>
              <Multiselect
              options={milestone_state.options} // Options to display in the dropdown
              selectedValues={milestone_state.selectedValue} // Preselected value to persist in dropdown
              displayValue="name" // Property name to display in the dropdown options
              onSelect={onMilestoneSelect}
              onRemove={onMilestoneRemove}
              /> 
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

            <HStack justifyContent="space-between" width={"100%"}>
                <FormLabel> QA Priority: </FormLabel> 
                <Menu>           
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Text id="qaPriorityStr">Medium</Text>
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

            <HStack justifyContent="space-between" width={"100%"}>
                <FormLabel> Assign To: </FormLabel> 
                <Menu>           
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Text id="qaAssignStr"></Text>
                    </MenuButton>
                    <MenuList>
                      {projectUsers.map((user) => 
                      <MenuItem onClick={() => {
                        formik.setFieldValue("qaAssignTo", user.username);
                        updateQAAssignButton(user.username)
                        }}
                        key={user.id}> 
                        {user.username}
                      </MenuItem>)}
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
