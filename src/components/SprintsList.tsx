import { Box, Button, Accordion, AccordionPanel, AccordionItem, AccordionButton, AccordionIcon, Text, HStack } from "@chakra-ui/react";
import { useContext } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { SideNavBar } from "./SideNavBar";
import { SprintsTopBar } from "./SprintsTopBar";
import { Sprint } from "./Sprint";


interface SprintsListProps {
  onLogout: (user: MaybeUser) => void;
}

export function SprintsList({onLogout}: SprintsListProps) {
  const client = useContext(ApiContext).client;
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
        <SprintsTopBar onLogout={onLogout}/>
        <HStack>
        <SideNavBar />
        <Box h="100vh" w="80vw" mt={10} alignContent={"top"}>
          <Accordion defaultIndex={[0]} allowMultiple={true}>
            {sprints?.map((sprint) => (
              <Sprint
                key={sprint.id}
                name={sprint.name}
                description={sprint.description}
                milestones={sprint.milestones}
                tasks={sprint.tasks}
              />
            ))}
          </Accordion>
        </Box>
        </HStack>
    </Box>
  );
}