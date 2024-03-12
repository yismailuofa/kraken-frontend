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
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useContext } from "react";

interface ProjectSettingsTopBarProps {
  onLogout: (token: MaybeUser) => void;
}
  
export function SettingsTopBar({ onLogout }: ProjectSettingsTopBarProps) {
  const navigate = useNavigate();
  const { client, user } = useContext(ApiContext);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Flex as="nav" p="20px" h="12vh" alignItems="center" borderBottom="1px" borderBottomColor={'gray.200'}>
      <Heading as="h1">Settings</Heading>
      <Spacer />

      <HStack spacing="20px" alignItems="right">
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