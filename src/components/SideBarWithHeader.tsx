/**
 * Side bar for a project, which can be used for navigating between project page, kanban page, 
 * timeline page, depedency page, and sprint page 
 */

'use client'

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Heading,
  Spacer,
  Center,
} from '@chakra-ui/react'
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi'
import { BsKanban, BsFillGrid3X3GapFill } from "react-icons/bs";
import { GrCycle } from "react-icons/gr";
import { CgArrowLongRightC } from "react-icons/cg";
import { MdTimeline  } from "react-icons/md";
// import { FiMenu } from "react-icons/fi";
import { IconType } from 'react-icons'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ApiContext, MaybeUser } from '../contexts/ApiContext'
import { IoMdSettings } from 'react-icons/io';

interface LinkItemProps {
  name: string
  icon: IconType
  page: string
}

interface NavItemProps extends FlexProps {
  icon: IconType
  children: React.ReactNode
}

interface MobileProps extends FlexProps {
  onOpen: () => void
  onLogout: (user: MaybeUser) => void;
  headerButtons: React.ReactNode;
  pageTitle: string;
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Kanban", icon: BsKanban, page: "/kanban" },
  { name: "Sprints", icon: GrCycle, page: "/sprintslist" },
  { name: "Timeline", icon: MdTimeline, page: "/timeline" },
  { name: "Dependencies", icon: CgArrowLongRightC, page: "/dependencies" },
  { name: "Projects", icon: BsFillGrid3X3GapFill, page: "/projectlist" },
]

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" w="100%">
          <Center w="100%">
            <Text mr={3}>Kraken 🐙</Text>
          </Center>
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} onClick={() => navigate(link.page)}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'teal',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

export const MobileNav = ({ onOpen, onLogout, headerButtons, pageTitle, ...rest }: MobileProps) => {
  const navigate = useNavigate();
  const { user } = useContext(ApiContext);

  const backgroundColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!user) {
    navigate("/login");
    return null;
  }
  
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={backgroundColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      // justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Heading alignContent={"left"} as="h1" ml={3}>{pageTitle}</Heading>

      <Spacer />

      <HStack spacing={{ base: '0', md: '6' }} mr={3}>
        <Flex alignItems={'center'}>
          {headerButtons}
          <IconButton
            mr={5}
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
            onClick={() => navigate("/settings")}
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
  )
}

interface LayoutProps {
    content: React.ReactNode;
    onLogout: (user: MaybeUser) => void;
    headerButtons: React.ReactNode;
    pageTitle: string;
  }

const SidebarWithHeader = ({content, onLogout, headerButtons, pageTitle}: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" bg={"white"}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} onLogout={onLogout} headerButtons={headerButtons} pageTitle={pageTitle}/>
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
        {content}
      </Box>
    </Box>
  )
}

export default SidebarWithHeader