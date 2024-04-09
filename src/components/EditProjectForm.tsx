/**
 * FR 7
 * Form for updating a project
 */

import { useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ApiContext, MaybeProject } from "../contexts/ApiContext";
import { AddEditProjectBase } from "./AddEditProjectBase";

interface EditProjectProps {
  onProjectUpdated: (project: MaybeProject) => void;
}

export function EditProjectForm({onProjectUpdated}: EditProjectProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  async function onSubmitForm(values: { projectName: string; description: string; }, actions: { resetForm: () => void; }) {
    // Make a request to update the project in the database
    const { data, error, response } = await client.PATCH("/projects/{id}", {
      params: {
        path: {
          id: project?.id!
        },
      },
      body: {
        name: values.projectName,
        description: values.description,
      },
    });

    // If there is an error updating the project notify the user with a toast message
    if (error) {
      console.log(error);
      toast({
        title: "Project Update Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error updating the project.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    // If the response is valid naviagte to the settings page and notify the user with a success toast message
    } else if (response.status === 200) {
      actions.resetForm();
      onProjectUpdated(data); // Update the project context
      navigate("/settings", {state: {location: "/kanban"}});
      toast({
        title: "Project Successfully Updated",
        description: "The project has been successfully updated.",
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else {
      console.log(response);
    }

  };

  return (
    <AddEditProjectBase onSubmitForm={onSubmitForm} title="Edit Project" posButton="Save" originPage="/settings" />
  );
}