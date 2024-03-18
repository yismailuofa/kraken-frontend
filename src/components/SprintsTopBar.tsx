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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSettings } from "react-icons/io";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useContext } from "react";

interface ProjectListTopBarProps {
  onLogout: (token: MaybeUser) => void;
}

export function SprintsTopBar({ onLogout }: ProjectListTopBarProps) {
  const navigate = useNavigate();
  const { client, user } = useContext(ApiContext);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Flex as="nav" p="20px" alignItems="center" borderBottom="1px" borderBottomColor={'gray.200'}>
      <Heading as="h1">Sprints</Heading>
      <Spacer />

      <HStack spacing="20px" alignItems="right">
        <IconButton
          colorScheme="teal"
          aria-label="Add Sprint"
          size="lg"
          icon={<IoMdAdd />}
          onClick={() => navigate("/addsprint")}
        />
        <IconButton
          colorScheme="teal"
          _hover={{
              background: "white",
              color: "teal.700",
          }}
          aria-label="Settings"
          size="lg"
          fontSize={55}
          variant='ghost'
          icon={<IoMdSettings />}
          onClick={() => navigate("/settings", {state: {location: "/sprintslist"}})}
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