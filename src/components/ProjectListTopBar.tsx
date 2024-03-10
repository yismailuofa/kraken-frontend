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
  const { client, user } = useContext(ApiContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Flex as="nav" p="20px" alignItems="center">
      <Heading as="h1">Projects</Heading>
      <Spacer />

      <JoinProjectModal isOpen={isOpen} onClose={onClose} fetchProjects={fetchProjects}></JoinProjectModal>

      <HStack spacing="20px" alignItems="right">
        <IconButton
          colorScheme="teal"
          aria-label="Add Project"
          size="lg"
          icon={<IoMdAdd />}
          onClick={() => navigate("/addproject")}
        />
        <IconButton
          colorScheme="teal"
          aria-label="Join Project"
          size="lg"
          icon={<FaUserPlus />}
          onClick={onOpen}
        />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<Avatar name={user.username} />}
            variant="nooutline"
          />
          <MenuList>
            <MenuItem onClick={() => navigate("/changepassword")}>
              Change Password
            </MenuItem>
            <MenuItem onClick={() => onLogout(null)}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}