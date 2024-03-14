import { VStack, Stack, Heading, Button, Box, } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

interface AddEditProjectProps {
  onSubmitForm : (values: { projectName: string; description: string; }, actions: { resetForm: () => void; }) => Promise<void>;
  title: string;
  posButton: string;
  originPage: string;
}

export function AddEditProjectBase({onSubmitForm, title, posButton, originPage}: AddEditProjectProps) {
  const navigate = useNavigate();
  const project = useContext(ApiContext).project;
  const initValues = project ? {projectName: project.name, description: project.description} : {projectName: "", description: ""};

  return (
    <Box>
      <Formik
        initialValues={initValues}
        validationSchema={Yup.object({
          projectName: Yup.string().required("Project name required"),
        })}
        onSubmit={onSubmitForm}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit}>
            <VStack
              mx="auto"
              w={{ base: "90%", md: 500 }}
              h="100vh"
              justifyContent="center"
            >
              <Heading>{title}</Heading>

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
                  onClick={() => navigate(originPage)}
                >
                  Cancel
                </Button>

                <Button type="submit" colorScheme="teal" variant="solid">
                  {posButton}
                </Button>
              </Stack>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}