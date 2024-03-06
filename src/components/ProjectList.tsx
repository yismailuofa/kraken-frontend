import { Box, SimpleGrid } from "@chakra-ui/react";
import { ProjectCard } from "./ProjectCard";
import { ProjectListTopBar } from "./ProjectListTopBar";
import { useContext, useState } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";

interface ProjectListProps {
  onLogout: (user: MaybeUser) => void;
}

export function ProjectList({ onLogout }: ProjectListProps) {
  const [projectItems, setProjectItems] = useState([]);
  const client = useContext(ApiContext).client;

  client.GET("/users/me").then((res: any) => {
    console.log(res);
  });
  client.GET("/projects/").then((res: any) => {
    // Map list of projects to ProjectCard Items
    const projectItems = res.data.map(
      (project: { createdAt: any; description: any; id: any; name: any }) => (
        <ProjectCard
          key={project.id}
          name={project.name}
          description={project.description}
        />
      )
    );
    setProjectItems(projectItems);
  });

  return (
    <Box>
      <ProjectListTopBar onLogout={onLogout} />
      <SimpleGrid columns={5} spacing={10} minChildWidth="300px" padding={10}>
        {projectItems}
      </SimpleGrid>
    </Box>
  );
}
