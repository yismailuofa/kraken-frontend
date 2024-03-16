import { Stack, StackDivider, Text, Box, AccordionPanel, AccordionItem, AccordionButton, AccordionIcon, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { components } from "../client/api";
type Milestone = components["schemas"]["Milestone"];
type Task = components["schemas"]["Task"];

export function Sprint({ name, description, milestones, tasks }: any) {
  return (
    <AccordionItem>
      <h2>
      <AccordionButton border="1px" borderColor={'gray.200'} alignContent="center" minH={16}>
          <Box as="span" flex='1' textAlign='left'>
          {name}
          </Box>
          <AccordionIcon />
      </AccordionButton>
      </h2>
      <AccordionPanel border="1px" borderColor={'gray.200'} pb={4}>
      <Stack divider={<StackDivider />} spacing='4'>
        <Text>{description}</Text>
        <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Priority</Th>
              <Th>Assigned To</Th>
              <Th>Due Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {milestones?.map((milestone: Milestone) => (
              <Tr key={milestone.id}>
                <Td>{milestone.name}</Td>
                <Td overflow="clip">{milestone.description}</Td>
                <Td>{milestone.status}</Td>
                <Td></Td>
                <Td></Td>
                <Td>{milestone.dueDate}</Td>
              </Tr>
            ))}
            {tasks?.map((task: Task) => (
              <Tr key={task.id}>
                <Td>{task.name}</Td>
                <Td overflow="clip">{task.description}</Td>
                <Td>{task.status}</Td>
                <Td>{task.priority}</Td>
                <Td>{task.assignedTo}</Td>
                <Td>{task.dueDate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
      </AccordionPanel>
    </AccordionItem>
  );
}