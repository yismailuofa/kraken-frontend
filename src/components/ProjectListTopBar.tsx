import {
  Heading,
  Flex,
  Spacer,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Avatar,
  useDisclosure,
  useColorModeValue,
  MenuDivider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useContext } from "react";
import { JoinProjectModal } from "./JoinProjectModal";

interface ProjectListTopBarProps {
  onLogout: (token: MaybeUser) => void;
  fetchProjects: Function;
}

export function ProjectListTopBar({ onLogout, fetchProjects }: ProjectListTopBarProps) {
  const navigate = useNavigate();
  const { user } = useContext(ApiContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const backgroundColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Flex
    px={{ base: 4, md: 4 }}
    height="20"
    alignItems="center"
    bg={backgroundColor}
    borderBottomWidth="1px"
    borderBottomColor={borderColor}
    >
    
    <JoinProjectModal isOpen={isOpen} onClose={onClose} fetchProjects={fetchProjects}></JoinProjectModal>

    <Heading alignContent={"left"} as="h1" ml={3}>Projects</Heading>

    <Spacer />

    <HStack spacing={{ base: '0', md: '6' }} mr={3}>
      <Flex alignItems={'center'}>
      <IconButton
          mr={5}
          colorScheme="teal"
          aria-label="Add Project"
          size="lg"
          icon={<IoMdAdd />}
          onClick={() => navigate("/addproject")}
        />
        <IconButton
          mr={5}
          colorScheme="teal"
          aria-label="Join Project"
          size="lg"
          icon={<FaUserPlus />}
          onClick={onOpen}
        />
        <Menu>
          <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
            <HStack>
              <Avatar name={user.username}/>  
            </HStack>
          </MenuButton>
          <MenuList
            bg={backgroundColor}
            borderColor={borderColor}>
            <MenuItem onClick={() => navigate("/changepassword")}>Change Password</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => onLogout(null)}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  </Flex>
  );
}