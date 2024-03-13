import { Box, Button, Container, Flex, Heading, IconButton, Spacer, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { components } from "../client/api";
import { ApiContext } from "../contexts/ApiContext";
import { FaWindowClose } from "react-icons/fa";
import { RemoveMemberModal } from "./RemoveMemberModal";
import { AddMemberModal } from "./AddMemberModal";

type UserView = components["schemas"]["UserView"];

export function ProjectMemberTable() {
  const [projectMembers, setProjectMembers] = useState<UserView[]>();
  const [memberToRemove, setMemberToRemove] = useState<UserView>();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const toast = useToast();

  const { 
    isOpen: isOpenRemoveMemberModal, 
    onOpen: onOpenRemoveMemberModal, 
    onClose: onCloseRemoveMemberModal 
  } = useDisclosure()

  const { 
    isOpen: isOpenAddMemberModal, 
    onOpen: onOpenAddMemberModal, 
    onClose: onCloseAddMemberModal 
  } = useDisclosure()

  async function onConfirmRemoveMember(member: UserView) {
    const { error, data, response } = await client.DELETE("/projects/{id}/users", {
      params: {
        query: {
          userID: member.id!
        },
        path: {
          id: project?.id!
        },
      },
    });
    
    if (error) {
      console.log(error);
      toast({
        title: "Remove Member Failed",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an error removing " + member.username + " the from the project.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
    } else if (response.status === 200) {
      console.log(data);
      toast({
        title: "Successfully Removed " + member.username + " From Project",
        description: member.username + " is no longer a member on the project.",
        status: "success",
        duration: 8000,
        isClosable: true,
        position: "top",
      });      
      fetchProjectMembers();
    } else {
      console.log(response);
    }
  }

  // Get a list of members on the project
  const fetchProjectMembers = async () => {
    const { error, data } = await client.GET("/projects/{id}/users", {
        params: {
            path: {
                id: project?.id!
            },
        },
    });

    // If the request to retrieve project members failed, notify the user with a toast
    if (error) {
      console.error(error);
      toast({
        title: "Failed to Retrieve Project Members",
        description: error.detail?.toString() ? error.detail?.toString() : "There was an retrieving project members.",
        status: "error",
        duration: 8000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setProjectMembers(data);
  };

  useEffect(() => {
    fetchProjectMembers();
  }, [client]);

  const showHeading = () => (
    <Flex>

      <RemoveMemberModal
        onConfirmRemoveMember={onConfirmRemoveMember}
        member={memberToRemove!}
        isOpen={isOpenRemoveMemberModal}
        onClose={onCloseRemoveMemberModal}
      />
      <AddMemberModal fetchProjectMembers={fetchProjectMembers} isOpen={isOpenAddMemberModal} onClose={onCloseAddMemberModal}/>

      <Box>
        <Heading fontSize={"xl"}>Project Members</Heading>
      </Box>
      <Spacer />
      <Box>
        <Button colorScheme={"teal"} onClick={onOpenAddMemberModal}>Add Member</Button>
      </Box>
    </Flex>
  )

  const showMembers = () => (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {projectMembers?.map((member) => (
            <Tr key={member.id}>
              <Td>{member.username}</Td>
              <Td>{member.email}</Td>
              <Td>
              <IconButton
                colorScheme="red"
                _hover={{
                    background: "white",
                    color: "red.700",
                }}
                aria-label="Settings"
                size="lg"
                fontSize={32}
                variant='ghost'
                icon={<FaWindowClose />}
                onClick={() => {setMemberToRemove(member); onOpenRemoveMemberModal();}}
                />
                
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )

  return (
    <Box w="100vw" p={4}>
      <Stack spacing={4} as={Container} maxW={"3xl"}>
        {showHeading()}
        {showMembers()}
      </Stack>
    </Box>
  );
};