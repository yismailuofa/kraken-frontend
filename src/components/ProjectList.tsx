import { Box, SimpleGrid } from "@chakra-ui/react";
import { ProjectCard } from "./ProjectCard";
import { ProjectListTopBar } from "./ProjectListTopBar";
import { useContext, useEffect, useState } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { components } from "../client/api";

interface ProjectListProps {
  onLogout: (user: MaybeUser) => void;
}

type Project = components["schemas"]["Project"];

export function ProjectList({ onLogout }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const client = useContext(ApiContext).client;

  const fetchProjects = async () => {
    const { error, data } = await client.GET("/projects/");

    if (error) {
      console.error(error);
      // Maybe toast here
      return;
    }

    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, [client]);

  return (
    <Box>
      <ProjectListTopBar onLogout={onLogout} />
      <SimpleGrid columns={5} spacing={10} minChildWidth="300px" padding={10}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
