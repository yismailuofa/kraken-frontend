/**
 * FR 6
 * Form for creating a new project
 */

import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";
import { ProjectCodeModal } from "./ProjectCodeModal";
import { AddEditProjectBase } from "./AddEditProjectBase";

export function AddProjectForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;
  const [projectCode, setProjectCode] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  function onProjectAdded(code: string) {
    setProjectCode(code);
  }

  function onCloseModal() {
    navigate("/projectlist");
  }

  async function onSubmitForm(values: { projectName: string; description: string; }, actions: { resetForm: () => void; }) {
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
      onProjectAdded(data.id!);
      onOpen();
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
  }

  return (
    <Box>
      <ProjectCodeModal projectCode={projectCode} onCloseModal={onCloseModal} isOpen={isOpen} onClose={onClose}></ProjectCodeModal>
      <AddEditProjectBase onSubmitForm={onSubmitForm} title="Create Project" posButton="Create Project" originPage="/projectlist" />
    </Box>
  );
}
