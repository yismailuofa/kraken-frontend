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
import { IoMdAdd } from "react-icons/io";

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
        height={"10vh"}
        >
            <Heading as="h1">Kanban</Heading>
            <Spacer />
            <HStack spacing="20px" alignItems="right">
            <Menu>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<IoMdAdd />}
                variant='outline'
            />
            <MenuList>
                <MenuItem onClick={() => navigate("/addtask")}>
                Add Task
                </MenuItem>
                <MenuItem onClick={() => {}}>Add Milstone</MenuItem>
            </MenuList>
            </Menu>
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