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
    import { Task } from "../models/Task";

    export function KanbanItem({task, index} : {task: Task, index: number}) {
        return (
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <Card
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                        <CardBody>
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