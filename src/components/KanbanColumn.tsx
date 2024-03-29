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

interface KanbanColumnTaskProps {
    name: string, 
    id: string, 
    tasks: Task[], 
    updateParentTask: (updated: Task) => void, 
    deleteParentTask: (deleted: Task) => void
}

interface KanbanColumnMilestoneProps {
    name: string, 
    id: string, 
    milestones: Milestone[], 
    change: any
}

interface KanbanColumnQATaskProps {
    name: string, 
    id: string, 
    tasks: Task[], 
    updateParentTask: (updated: Task) => void, 
    deleteParentTask: (deleted: Task) => void
}

export function KanbanColumnTask({name, id, tasks, updateParentTask, deleteParentTask} : KanbanColumnTaskProps) {
    let taskItems = tasks.map((task) => <li key={task.id}>
        <KanbanItemTask task={task} index={tasks.indexOf(task)} updateParentTask={updateParentTask} deleteParentTask={deleteParentTask}/></li>);

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

export function KanbanColumnMilestone({name, id, milestones=[], change} : KanbanColumnMilestoneProps) {
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

export function KanbanColumnQATask({name, id, tasks=[], updateParentTask, deleteParentTask} : KanbanColumnQATaskProps) {    
    let taskItems = tasks.map((task) => <li key={task.id + "QA"}>
        <KanbanItemQATask task={task} index={tasks.indexOf(task)} 
        updateParentTask={updateParentTask} deleteParentTask={deleteParentTask}/></li>);

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