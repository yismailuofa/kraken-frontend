import { VStack, Stack, Heading, Button, Box, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useLocation, useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext, MaybeProject, Sprint } from "../contexts/ApiContext";
import { DateRangeChooser } from "./DateRangeChooser";

interface EditSprintProps {
  onProjectUpdated: (project: MaybeProject) => void;
}

export function EditSprintForm({onProjectUpdated}: EditSprintProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const toast = useToast();

  if (!location) {
    navigate("/sprintslist")
    return null;
  }

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  const currentSprint = location.state.sprint;

  return (
    <Box>
      <Formik
        initialValues={{
            sprintName: currentSprint.name,
            description: currentSprint.description,
            startDate: (new Date(currentSprint.startDate)).toISOString(),
            endDate: (new Date(currentSprint.endDate)).toISOString(),
        }}
        validationSchema={Yup.object({
          sprintName: Yup.string().required("Sprint name required"),
        })}
        onSubmit={async (values, actions) => {
          // Make a request to update the sprint in the database
          const { data, error, response } = await client.PATCH("/sprints/{id}", {
            params: {
              path: {
                id: currentSprint.id
              },
            },
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
              title: "Update Sprint Failed",
              description: error.detail?.toString() ? error.detail?.toString() : "There was an error updating the sprint.",
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
              title: "Sprint Successfully Updated",
              description: "Your sprint has been successfully updated.",
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
              <Heading>Edit Sprint</Heading>

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
                initStartDate={currentSprint.startDate}
                initEndDate={currentSprint.endDate}
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
                  Save
                </Button>
              </Stack>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}