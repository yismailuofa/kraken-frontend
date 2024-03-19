import {
  Heading,
  Flex,
  Spacer,
  HStack,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Avatar,
  MenuDivider,
  useColorModeValue,
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

      <Heading alignContent={"left"} as="h1" ml={3}>Settings</Heading>

      <Spacer />

      <HStack spacing={{ base: '0', md: '6' }} mr={3}>
        <Flex alignItems={'center'}>
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