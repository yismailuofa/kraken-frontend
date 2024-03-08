import { VStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";

export function JoinProjectModal({isOpen, onClose}: any) {
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
									alert(JSON.stringify(values, null, 1));
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
