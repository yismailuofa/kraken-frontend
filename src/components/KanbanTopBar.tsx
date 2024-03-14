import {
    Heading,
    Button,
    Flex,
    Spacer,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useContext } from "react";
import { IoMdAdd, IoMdSettings } from "react-icons/io";

interface KanbanTopBarProps {
    onLogout: (token: MaybeUser) => void;
}

export function KanbanTopBar({ onLogout }: KanbanTopBarProps) {
    const navigate = useNavigate();

    const { client, user } = useContext(ApiContext);

    if (!user) {
      navigate("/login");
      return null;
    }

    return (
        <Flex
        as="nav"
        p="20px"
        alignItems="center"
        borderBottom="1px"
        borderBottomColor={'gray.200'}
        >
            <Heading as="h1" flex={2}>Kanban</Heading>
            <Spacer />
            <HStack spacing="20px" alignItems="right">
            <Menu>
                <MenuButton
                    as={IconButton}
                    colorScheme="teal"
                    size="lg"
                    aria-label='Options'
                    icon={<IoMdAdd />}
                    variant='outline'
                />
                <MenuList>
                    <MenuItem onClick={() => navigate("/addtask")}> Add Task </MenuItem>
                    <MenuItem onClick={() => navigate("/addmilestone")}> Add Milestone </MenuItem>
                </MenuList>
            </Menu>
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
                onClick={() => navigate("/settings", {state: {location: "/kanban"}})}
            />
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<Avatar name={user.username} />}
                    variant="nooutline"
                />
                <MenuList>
                    <MenuItem onClick={() => navigate("/changepassword")}> Change Password </MenuItem>
                    <MenuItem onClick={() => onLogout(null)}> Logout </MenuItem>
                </MenuList>
            </Menu>
        </HStack>
        </Flex>
    );
}