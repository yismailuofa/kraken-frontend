/**
 * FR 8
 * Form for user joining project via access code
 */

import { VStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

export function JoinProjectModal({isOpen, onClose, fetchProjects}: any) {
  const client = useContext(ApiContext).client;
  const toast = useToast();
  
	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Join Project</ModalHeader>
					<ModalCloseButton />

					<Formik
							initialValues={{
									projectCode: "",
							}}
							validationSchema={Yup.object({
									projectCode: Yup.string().required("Project code required")
							})}
							onSubmit={async (values, actions) => {
                // Make a request to the database to join the project
                const { data, error, response } = await client.POST("/projects/{id}/join", {
                	params: {
                    path: {
                      id: values.projectCode,
                    },
                  },
                });

                // If there is an error joining the project notify the user with a toast message
                if (error) {
                  console.log(error);

                  // Inform the user specifically if the request fails due to an invalid project code
                  // Otherwise, display a more general error message
                  let msg = "";
                  if (error.detail?.toString() === "Invalid ObjectId") {
                    msg = "The project code entered is invalid"
                  }

                  toast({
                    title: "Joining Project Failed",
                    description: msg === "" ? "There was an error joining the project." : msg,
                    status: "error",
                    duration: 8000,
                    isClosable: true,
                    position: "top",
                  });
                  // If the response is valid close the modal and notify the user with a success toast message
                } else if (response.status === 200) {
                  actions.resetForm();
                  fetchProjects(); // Update the project list
                  onClose();
                  toast({
                    title: "Successfully Joined Project",
                    description: "The new project should appear in your projects list",
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
															id="projectCode"
															name="projectCode"
															label="Project Code"
															type="text"
															variant="filled"
															placeholder="enter code..."
															/>
													</VStack>
											</ModalBody>
											<ModalFooter>
													<Button colorScheme='teal' mr={3} onClick={onClose}>
															Close
													</Button>
													<Button colorScheme='teal' mr={3} type="submit">Join</Button>
											</ModalFooter>                    
									</form>
							)}
					</Formik>
				</ModalContent>
			</Modal>
		</>
	)
}
