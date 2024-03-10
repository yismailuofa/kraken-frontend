import React from "react";
import {
    Heading,
    Card, 
    CardHeader, 
    CardBody, 
} from "@chakra-ui/react"
import { Droppable } from "react-beautiful-dnd";
import { KanbanItem } from "./KanbanItem";
import { Task } from "../contexts/ApiContext";


export function KanbanColumn({name, id, tasks=[]} : { name: string, id: string, tasks: Task[] }) {
    let taskItems = tasks.map((task) => <li key={task.id}>
        <KanbanItem task={task} index={tasks.indexOf(task)}/></li>);

    console.log(tasks);

    return (
        <Card>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '25vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : 'LightGray',
                    overflowY: "auto", maxHeight: "75vh"
                }}
                {...provided.droppableProps}
                >
                    <ul>{taskItems}</ul>

                    {provided.placeholder}
                </CardBody>
            )}
            </Droppable>
        </Card>
    )
}