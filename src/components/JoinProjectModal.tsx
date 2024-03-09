import { VStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

export function JoinProjectModal({isOpen, onClose, fetchProjects}: any) {
  const client = useContext(ApiContext).client;
  
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

                // If there is an error joining the project
                if (error) {
                  console.log(error);
                  // If the response is valid close the modal
                } else if (response.status === 200) {
                  actions.resetForm();
                  fetchProjects(); // Update the project list
                  onClose();
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
