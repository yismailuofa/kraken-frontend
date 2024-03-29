import { VStack, Stack, Heading, Button, useToast, Menu, MenuList, MenuItem, HStack, Text, MenuButton, FormLabel } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext, useEffect } from "react";
import { ApiContext, MaybeProject } from "../contexts/ApiContext";
import { DateChooser } from "./DateChooser";
import Multiselect from 'multiselect-react-dropdown';


export function AddMilestoneForm() {
    const navigate = useNavigate();
    const toast = useToast();
    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;
    const default_date = new Date()

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
                dependentMilestones: milestone_state.selectedValue,
                dependentTasks: task_state.selectedValue
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
            // onSelect={this.onSelect} // Function will trigger on select event
            // onRemove={this.onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
            />
            </HStack>

            <HStack justifyContent="flex-start" width="100%" alignItems="center">
            <FormLabel>Dependent Milestones:</FormLabel>
            <Multiselect
            options={milestone_state.options} // Options to display in the dropdown
            selectedValues={milestone_state.selectedValue} // Preselected value to persist in dropdown
            // onSelect={this.onSelect} // Function will trigger on select event
            // onRemove={this.onRemove} // Function will trigger on remove event
            displayValue="name" // Property name to display in the dropdown options
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
