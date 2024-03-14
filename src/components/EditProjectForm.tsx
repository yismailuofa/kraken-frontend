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
  const {state} = useLocation();

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

    if (error) {
      console.log(error);
    } else if (response.status === 200) {
      actions.resetForm();
      onProjectUpdated(data);
      navigate("/settings");
      console.log(data);
    } else {
      console.log(response);
    }

  };

  return (
    <AddEditProjectBase onSubmitForm={onSubmitForm} title="Edit Project" posButton="Save" originPage="/settings" />
  );
}