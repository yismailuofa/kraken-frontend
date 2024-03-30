import { VStack, Stack, Heading, Button, useToast, Menu, MenuList, MenuItem, HStack, Text, MenuButton, FormLabel } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext, useEffect, useState } from "react";
import { Task, Milestone } from "../contexts/ApiContext";
import { ApiContext, MaybeProject } from "../contexts/ApiContext";
import { DateChooser } from "./DateChooser";
import Multiselect from 'multiselect-react-dropdown';


export function AddMilestoneForm() {
    const navigate = useNavigate();
    const toast = useToast();
    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;
    const default_date = new Date()

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

  return (
    <Formik
      initialValues={{
        milestoneName: "",
        description: "",
        dueDate: default_date.toISOString(),
      }}
      validationSchema={Yup.object({
        milestoneName: Yup.string().required("Milestone name required"),
        description: Yup.string().required("Milestone description required"),
      })}
      onSubmit={async (values, actions) => {
        actions.resetForm();

        const { data, error, response } = await client.POST("/milestones/", {
            body: {
                name: values.milestoneName,
                description: values.description,
                dueDate: values.dueDate,
                projectId: (project?.id || "") as string,
                dependentMilestones: selectedMilestones,
                dependentTasks: selectedTasks
            }
        });

        if (error) {
          console.log(error);
          toast({
            title: "Milestone Creation Failed",
            description: "There was an error creating your milestone.",
            status: "error",
            duration: 8000,
            isClosable: true,
            position: "top",
          });
        } else if (response.status === 200) {
          actions.resetForm();
          navigate("/kanban");
          toast({
            title: "Milestone Created",
            description: "Your milestone has been successfully created.",
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
            <Heading>Create Milestone</Heading>

            <TextField
              id="milestoneName"
              name="milestoneName"
              label="Milestone Name"
              type="text"
              variant="filled"
              placeholder="enter milestone name..."
            />

            <TextArea
              id="description"
              name="description"
              label="Description"
              type="text"
              placeholder="enter description..."
            />

            <DateChooser
                id="dueDate"
                name="dueDate"
                selectedDateString={formik.values.dueDate}
                setSelectedDateString={(date) => formik.setFieldValue("dueDate", date)}
                startDate={new Date()}
            />

            <HStack justifyContent="flex-start" width="100%" alignItems="center">
            <FormLabel>Dependent Tasks:</FormLabel>
            <Multiselect
            options={task_state.options} // Options to display in the dropdown
            selectedValues={task_state.selectedValue} // Preselected value to persist in dropdown
            displayValue="name" // Property name to display in the dropdown options
            onSelect={onTaskSelect}
            onRemove={onTaskRemove}
            />
            </HStack>

            <HStack justifyContent="flex-start" width="100%" alignItems="center">
            <FormLabel>Dependent Milestones:</FormLabel>
            <Multiselect
            options={milestone_state.options} // Options to display in the dropdown
            selectedValues={milestone_state.selectedValue} // Preselected value to persist in dropdown
            displayValue="name" // Property name to display in the dropdown options
            onSelect={onMilestoneSelect}
            onRemove={onMilestoneRemove}
            /> 
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
                Create Milestone
              </Button>
            </Stack>
          </VStack>
        </form>
      )}
    </Formik>
  );
}
