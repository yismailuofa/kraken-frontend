import {
    Box,
    SimpleGrid,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "./ProjectCard";
import { ProjectListTopBar } from "./ProjectListTopBar";

// Example projects for testing
export const projects = [{
    id: 0,
    name: 'Project 1',
    description: 'This is a project description',
  }, {
    id: 1,
    name: 'Project 2',
    description: 'Felis eget nunc lobortis mattis aliquam faucibus purus in. Ultricies mi quis hendrerit dolor magna. Felis eget velit aliquet sagittis id consectetur. Netus et malesuada fames ac turpis egestas maecenas pharetra convallis. Volutpat est velit egestas dui. Elementum pulvinar etiam non quam lacus suspendisse faucibus. Eu sem integer vitae justo eget magna. Nibh praesent tristique magna sit amet purus gravida. Et ultrices neque ornare aenean. Urna cursus eget nunc scelerisque viverra mauris in aliquam.',
  }, {
    id: 2,
    name: 'Project 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },{
    id: 3,
    name: 'Project 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },{
    id: 4,
    name: 'Project 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },];


export function ProjectList() {
    const navigate = useNavigate();

    // Map list of projects to ProjectCard Items
    const projectItems = projects.map(project =>
        <ProjectCard
            name={project.name}
            description={project.description}
        />
    );

    return (
        <Box>
            <ProjectListTopBar/>
            <SimpleGrid columns={5} spacing={10} minChildWidth="300px" padding={10}>
                {projectItems}
            </SimpleGrid>
        </Box>   
    );
}