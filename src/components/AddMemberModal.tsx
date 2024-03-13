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

              if (error) {
                console.log(error);
              } else if (response.status === 200) {
                console.log(data);
                fetchProjectMembers();
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
