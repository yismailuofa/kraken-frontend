import {
    Heading,
    Button,
    Flex,
    Spacer,
    HStack,
    IconButton,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";

export function ProjectListTopBar({onLogout}: any) {
    const navigate = useNavigate();

    return (
        <Flex
        as="nav"
        p="20px"
        alignItems="center"
        >
            <Heading as="h1">Projects</Heading>
            <Spacer />

            <HStack spacing="20px" alignItems="right">
                <IconButton colorScheme='teal' aria-label='Add Project' size='lg' icon={<IoMdAdd />} onClick={() => navigate("/addproject")}/>
                <Button colorScheme='teal' size='lg' onClick={() => onLogout(null)}>Logout</Button>
            </HStack>
        </Flex>
    );
}