import {
    Box,
    SimpleGrid,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "./ProjectCard";
import { ProjectListTopBar } from "./ProjectListTopBar";
import { useState } from "react";

export function ProjectList({client, onLogout}: any) {
    const navigate = useNavigate();
    const [projectItems, setProjectItems] = useState([]);

    client.GET("/projects/").then((res: any) => {
      // Map list of projects to ProjectCard Items
      const projectItems = res.data.map((project: { createdAt: any; description: any; id: any; name: any;}) =>
        <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
        />
      );
      setProjectItems(projectItems);
    });

    return (
        <Box>
            <ProjectListTopBar onLogout={onLogout}/>
            <SimpleGrid columns={5} spacing={10} minChildWidth="300px" padding={10}>
                {projectItems}
            </SimpleGrid>
        </Box>   
    );
}