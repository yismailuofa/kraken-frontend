import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";
import { AddEditProjectBase } from "./AddEditProjectBase";

export function EditProjectForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;

  async function onSubmitForm(values: { projectName: string; description: string; }, actions: { resetForm: () => void; }) {
    console.log("Edited Project");
  };

  return (
    <AddEditProjectBase onSubmitForm={onSubmitForm} title="Edit Project" posButton="Save" originPage="/settings" />
  );
}