import React from "react";
import {
    VStack,
    Stack,
    Heading,
    Button,
    Flex,
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter 
} from "@chakra-ui/react"
import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { KanbanItem } from "./KanbanItem";

export function KanbanColumn({name, id, tasks=[]}) {
    let taskItems = tasks.map((task) => <li key={task.id}>
        <KanbanItem task={task} index={tasks.indexOf(task)}/></li>);

    return (
        // <Flex className="column" w='100%' h='50vh' bg='teal' overflow-y="scroll" flex="1" flexDirection="column">
        <Card>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '25vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : 'LightGray' 
                }}
                {...provided.droppableProps}
                >
                    <ul>{taskItems}</ul>

                    {provided.placeholder}
                </CardBody>
            )}
            </Droppable>
        </Card>
        // </Flex>
    )
}