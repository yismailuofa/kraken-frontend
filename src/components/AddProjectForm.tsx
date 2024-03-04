import {
    VStack,
    Stack,
    Heading,
    Button,
    useDisclosure
} from "@chakra-ui/react"
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField"
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";

export function AddProjectForm() {
    const navigate = useNavigate();
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
      <Formik
        initialValues={{
            projectName: "",
            description: "",
        }}
        validationSchema={Yup.object({
            projectName: Yup.string().required("Project name required"),
        })}
        onSubmit= { (values, actions) => {
            alert(JSON.stringify(values, null, 2));
            actions.resetForm();
        }}
      >
        {formik => (
          <form onSubmit={formik.handleSubmit}>
          <VStack
            mx="auto"
            w={{ base: "90%", md: 500}}
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

            <Stack spacing={4} direction='row' align='center'>
                <Button colorScheme="teal" variant="solid" onClick={() => navigate("/projectlist")}>
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