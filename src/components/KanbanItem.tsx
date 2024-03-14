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
    import { Milestone, Task } from "../contexts/ApiContext";

    export function KanbanItemTask({task, index} : {task: Task, index: number}) {
        return (
            // requires task id
            <Draggable draggableId={task.id || ""} index={index}>
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

    export function KanbanItemMilestone({milestone, index} : {milestone: Milestone, index: number}) {
        return (
            // requires task id
            <Draggable draggableId={milestone.id || ""} index={index}>
                {(provided, snapshot) => (
                    <Card
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>  #{milestone.id} </Box>
                                <Box>  {milestone.name} </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                )
                }
            </Draggable>
        )
    }