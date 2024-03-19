import { Box, Button, Accordion, HStack, IconButton } from "@chakra-ui/react";
import { useContext } from "react";
import { ApiContext, MaybeProject, MaybeUser } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { Sprint } from "./Sprint";
import SidebarWithHeader from "./SideBarWithHeader";
import { IoMdAdd } from "react-icons/io";


interface SprintsListProps {
  onLogout: (user: MaybeUser) => void;
  onProjectUpdated: (project: MaybeProject) => void;
}

interface SprintPageContentProps {
  onProjectUpdated: (project: MaybeProject) => void;
}


function SprintPageContent({onProjectUpdated}: SprintPageContentProps) {
  const project = useContext(ApiContext).project;
  const navigate = useNavigate();

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  // Sort the sprints by increasing start date
  const sprints = project.sprints?.sort((a, b) => new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf());

  return (
    <Box>
        <HStack>
        <Box h="100vh" w="80vw" mt={10} alignContent={"top"}>
          <Accordion defaultIndex={[0]} allowMultiple={true}>
            {sprints?.map((sprint) => (
              <Sprint
                key={sprint.id}
                sprint={sprint}
                onProjectUpdated={onProjectUpdated}
              />
            ))}
          </Accordion>
        </Box>
        </HStack>
    </Box>
  );
}

export function SprintsList({onLogout, onProjectUpdated}: SprintsListProps) {
  const project = useContext(ApiContext).project;
  const navigate = useNavigate();

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  return (
    <>
    <SidebarWithHeader
        onLogout={onLogout}
        content={<SprintPageContent onProjectUpdated={onProjectUpdated}></SprintPageContent>}
        headerButtons={
          <IconButton
            mr={5}
            colorScheme="teal"
            aria-label="Add Sprint"
            size="lg"
            icon={<IoMdAdd />}
            onClick={() => navigate("/addsprint")}
          />
        }
        pageTitle="Sprints"
    />
    </>
  );
}