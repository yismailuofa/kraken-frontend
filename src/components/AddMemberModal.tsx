import { VStack, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

export function AddMemberModal({isOpen, onClose}: any) {
  const client = useContext(ApiContext).client;
  
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
              console.log("Adding member");
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
