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
  Avatar
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useContext, useEffect, useState } from "react";

interface ProjectListTopBarProps {
  onLogout: (token: MaybeUser) => void;
}

export function ProjectListTopBar({ onLogout }: ProjectListTopBarProps) {
  const [username, setUsername] = useState("Username Lastname");

  const navigate = useNavigate();
  const client = useContext(ApiContext).client;

  // Get the username to set the profile avatar
  useEffect(() => {
    client.GET("/users/me").then((res: any) => {
      const username = res.data.username;
      setUsername(username);
    });
  }, [username]);

  return (
    <Flex as="nav" p="20px" alignItems="center">
      <Heading as="h1">Projects</Heading>
      <Spacer />

      <HStack spacing="20px" alignItems="right">
        <IconButton
          colorScheme="teal"
          aria-label="Add Project"
          size="lg"
          icon={<IoMdAdd />}
          onClick={() => navigate("/addproject")}
        />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<Avatar name={username} />}
            variant='nooutline'
          />
          <MenuList>
            <MenuItem onClick={() => navigate("/changepassword")}>
              Change Password
            </MenuItem>
            <MenuItem onClick={() => onLogout(null)}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}
