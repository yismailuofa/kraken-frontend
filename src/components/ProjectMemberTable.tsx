import { Box, Button, Container, Flex, Heading, IconButton, Spacer, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { components } from "../client/api";
import { ApiContext } from "../contexts/ApiContext";
import { FaWindowClose } from "react-icons/fa";

type UserView = components["schemas"]["UserView"];

export function ProjectMemberTable() {
  const [projectMembers, setProjectMembers] = useState<UserView[]>();
  const client = useContext(ApiContext).client;
  const project = useContext(ApiContext).project;
  const toast = useToast();

  function test(id: string) {
    console.log(id);
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
      <Box>
        <Heading fontSize={"xl"}>Project Members</Heading>
      </Box>
      <Spacer />
      <Box>
        <Button colorScheme={"teal"}>Add Member</Button>
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
                onClick={() => test(member.id!)}
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