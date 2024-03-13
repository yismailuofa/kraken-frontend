import { VStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";

export function AddMemberModal({fetchProjectMembers, isOpen, onClose}: any) {
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const navigate = useNavigate();
  const toast = useToast();

  if (!project) {
    navigate("/projectlist");
    return null;
  }
  
	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Project Member</ModalHeader>
					<ModalCloseButton />

					<Formik
            initialValues={{
                email: "",
            }}
            validationSchema={Yup.object({
                email: Yup.string().required("Email required")
            })}
            onSubmit={async (values, actions) => {
              // Make a request to the database add the member to the project
              const { data, error, response } = await client.POST("/projects/{id}/users", {
                params: {
                  query: {
                    email: values.email,
                  },
                  path: {
                    id: project.id!,
                  },
                },
              });

              // If there is an error adding the member to the project notify the user with a toast message
              if (error) {
                console.log(error);
                toast({
                  title: "Add Project Member Failed",
                  description: error.detail?.toString() ?
                  error.detail?.toString() + ". Please verify the email is correct and the user is registered with the system." :
                  "There was an error adding the member to the project. Please verify the email is correct and the user is registered with the system.",
                  status: "error",
                  duration: 8000,
                  isClosable: true,
                  position: "top",
                });
              // If the response is valid fetch the new list of project members and notify the user with a success toast message
              } else if (response.status === 200) {
                console.log(data);
                fetchProjectMembers(); // Update the list of project members
                onClose();
                toast({
                  title: "Successfully Added Member To Project",
                  description: data.username + " has been successfully added to the project",
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
                <ModalBody>
                  <VStack
                      mx="auto"
                      justifyContent="center"
                  >
                      <TextField
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      variant="filled"
                      placeholder="enter email address..."
                      />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='teal' mr={3} onClick={onClose}>
                      Close
                  </Button>
                  <Button colorScheme='teal' mr={3} type="submit">Add</Button>
                </ModalFooter>                    
              </form>
            )}
					</Formik>
				</ModalContent>
			</Modal>
		</>
	)
}
