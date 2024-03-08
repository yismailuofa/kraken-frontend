    import React from "react";
    import {
        Flex,
        VStack,
        Stack,
        StackDivider,
        Box,
        Card, 
        CardHeader, 
        CardBody, 
        CardFooter 
    } from "@chakra-ui/react"
    import { Draggable } from "react-beautiful-dnd";

    const test = (id, index) => {
        console.log(id, index);
    }
    export function KanbanItem({task, index}) {
        return (
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <Card
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                        <CardBody onClick={test(task.id, index)}>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>  #{task.id} </Box>
                                <Box>  {task.name} </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                )
                }
            </Draggable>
        )
    }