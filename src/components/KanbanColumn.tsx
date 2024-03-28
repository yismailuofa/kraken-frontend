import React from "react";
import {
    Heading,
    Card, 
    CardHeader, 
    CardBody, 
} from "@chakra-ui/react"
import { Droppable } from "react-beautiful-dnd";
import { KanbanItemTask, KanbanItemMilestone, KanbanItemQATask } from "./KanbanItem";
import { Milestone, Task } from "../contexts/ApiContext";


export function KanbanColumnTask({name, id, tasks=[], change} : { name: string, id: string, tasks: Task[], change: any }) {
    let taskItems = tasks.map((task) => <li key={task.id}>
        <KanbanItemTask task={task} index={tasks.indexOf(task)} change={change}/></li>);

    return (
        <Card width={"20vw"}>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '20vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : 'LightGray',
                    overflowY: "auto", maxHeight: "60vh"
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

export function KanbanColumnMilestone({name, id, milestones=[], change} : { name: string, id: string, milestones: Milestone[], change: any }) {
    let mItems = milestones.map((milestone) => <li key={milestone.id}>
        <KanbanItemMilestone milestone={milestone} index={milestones.indexOf(milestone)} change={change}/></li>);

    return (
        <Card width={"20vw"}>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '20vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : 'LightGray',
                    overflowY: "auto", maxHeight: "60vh"
                }}
                {...provided.droppableProps}
                >
                    <ul>{mItems}</ul>

                    {provided.placeholder}
                </CardBody>
            )}
            </Droppable>
        </Card>
    )
}

export function KanbanColumnQATask({name, id, tasks=[], change} : { name: string, id: string, tasks: Task[], change: any }) {
    let taskItems = tasks.map((task) => <li key={task.id}>
        <KanbanItemQATask task={task} index={tasks.indexOf(task)} change={change}/></li>);

    return (
        <Card width={"20vw"}>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '20vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : 'LightGray',
                    overflowY: "auto", maxHeight: "60vh"
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