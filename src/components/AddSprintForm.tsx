import { VStack, Stack, Heading, Button, Box, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext, MaybeProject } from "../contexts/ApiContext";
import { DateRangeChooser } from "./DateRangeChooser";

interface AddSprintProps {
  onProjectUpdated: (project: MaybeProject) => void;
}

export function AddSprintForm({onProjectUpdated}: AddSprintProps) {
  const navigate = useNavigate();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const toast = useToast();
  const defaultStartDate = new Date();
  let defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 6);

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  return (
    <Box>
      <Formik
        initialValues={{
            sprintName: "",
            description: "",
            startDate: defaultStartDate.toISOString(),
            endDate: defaultEndDate.toISOString(),
        }}
        validationSchema={Yup.object({
          sprintName: Yup.string().required("Sprint name required"),
        })}
        onSubmit={async (values, actions) => {
          // Make a request to add the sprint in the database
          const { data, error, response } = await client.POST("/sprints/", {
            body: {
              name: values.sprintName,
              description: values.description,
              startDate: values.startDate,
              endDate: values.endDate,
              projectId: project.id!,
            },
          });

          if (error) {
            console.log(error);
            toast({
              title: "Create Sprint Failed",
              description: error.detail?.toString() ? error.detail?.toString() : "There was an error creating the sprint.",
              status: "error",
              duration: 8000,
              isClosable: true,
              position: "top",
            });
          } else if (response.status === 200) {
            actions.resetForm();

            const { data, error, response } = await client.GET("/projects/{id}", {
              params: {
                path: {
                  id: project.id!
                },
              },
            });

            if (data) {
              onProjectUpdated(data); // Update the project context
            }
            navigate("/sprintslist");
            toast({
              title: "Sprint Successfully Created",
              description: "Your sprint has been successfully created.",
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
              <Heading>Create Sprint</Heading>

              <TextField
                id="sprintName"
                name="sprintName"
                label="Sprint Name"
                type="text"
                variant="filled"
                placeholder="enter sprint name..."
              />

              <TextArea
                id="description"
                name="description"
                label="Description"
                type="text"
                placeholder="enter description..."
              />

              <DateRangeChooser
                id="date"
                name="date"
                label="Start Date - End Date"
                initStartDate={defaultStartDate}
                initEndDate={defaultEndDate}
                selectedStartDateString={formik.values.startDate}
                selectedEndDateString={formik.values.startDate}
                setSelectedStartDateString={(startDate: any) => formik.setFieldValue("startDate", startDate)}
                setSelectedEndDateString={(endDate: any) => formik.setFieldValue("endDate", endDate)}
              />

              <Stack spacing={4} direction="row" align="center">
                <Button
                  colorScheme="teal"
                  variant="solid"
                  onClick={() => navigate("/sprintslist")}
                >
                  Cancel
                </Button>

                <Button type="submit" colorScheme="teal" variant="solid">
                  Create
                </Button>
              </Stack>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}