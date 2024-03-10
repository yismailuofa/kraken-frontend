import { Box, SimpleGrid } from "@chakra-ui/react";
import { ProjectCard } from "./ProjectCard";
import { ProjectListTopBar } from "./ProjectListTopBar";
import { useContext, useEffect, useState } from "react";
import { ApiContext, MaybeUser, MaybeProject } from "../contexts/ApiContext";
import { components } from "../client/api";
import { useNavigate } from "react-router-dom";


interface ProjectListProps {
  onLogout: (user: MaybeUser) => void;
  onProjectSelected: (project: MaybeProject) => void;
}

type Project = components["schemas"]["Project"];

export function ProjectList({ onLogout, onProjectSelected }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const client = useContext(ApiContext).client;
  const navigate = useNavigate();

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

  const showProjectKanban = (project: MaybeProject) => {
    if (project) {
      onProjectSelected(project);
      navigate('/kanban');
    }
  }


  return (
    <Box>
      <ProjectListTopBar onLogout={onLogout} fetchProjects={fetchProjects}/>
      <SimpleGrid columns={5} spacing={10} minChildWidth="300px" padding={10}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
            onClick={() => showProjectKanban(project)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
