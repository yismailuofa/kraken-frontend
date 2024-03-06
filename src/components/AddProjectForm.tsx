import { VStack, Stack, Heading, Button, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

export function AddProjectForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;

  return (
    <Formik
      initialValues={{
        projectName: "",
        description: "",
      }}
      validationSchema={Yup.object({
        projectName: Yup.string().required("Project name required"),
      })}
      onSubmit={async (values, actions) => {
        alert(JSON.stringify(values, null, 2));
        actions.resetForm();

        // Make a request to add the project to the database
        const { data, error, response } = await client.POST("/projects/", {
          body: {
            name: values.projectName,
            description: values.description,
          },
        });

        // If there is an error creating the project notify the user with a toast message
        if (error) {
          console.log(error);
          toast({
            title: "Project Creation Failed",
            description: "There was an error creating your project.",
            status: "error",
            duration: 8000,
            isClosable: true,
            position: "top",
          });
          // If the response is valid naviagte to the project list page and notify the user with a success toast message
        } else if (response.status === 200) {
          actions.resetForm();
          navigate("/projectlist");
          toast({
            title: "Project Created",
            description: "Your project has been successfully created.",
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
            <Heading>Create Project</Heading>

            <TextField
              id="projectName"
              name="projectName"
              label="Project Name"
              type="text"
              variant="filled"
              placeholder="enter project name..."
            />

            <TextArea
              id="description"
              name="description"
              label="Description"
              type="text"
              placeholder="enter description..."
            />

            <Stack spacing={4} direction="row" align="center">
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => navigate("/projectlist")}
              >
                Cancel
              </Button>

              <Button type="submit" colorScheme="teal" variant="solid">
                Create Project
              </Button>
            </Stack>
          </VStack>
        </form>
      )}
    </Formik>
  );
}
