import React from "react";
import {
    Heading,
    Card, 
    CardHeader, 
    CardBody,
    Box, 
} from "@chakra-ui/react"
import { Droppable } from "react-beautiful-dnd";
import { KanbanItemTask, KanbanItemMilestone } from "./KanbanItem";
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
    let taskItems = tasks.map((task) => <Box key={task.id}>
        <KanbanItemTask task={task} index={tasks.indexOf(task)} updateParentTask={updateParentTask} 
        deleteParentTask={deleteParentTask} type="task"/></Box>);

    return (
        <Card width={"25vw"}>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '25vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : '#B6D6CC',
                    overflowY: "auto", maxHeight: "60vh"
                }}
                {...provided.droppableProps}
                >
                    {taskItems}

                    {provided.placeholder}
                </CardBody>
            )}
            </Droppable>
        </Card>
    )
}

export function KanbanColumnMilestone({name, id, milestones=[], change} : KanbanColumnMilestoneProps) {
    let mItems = milestones.map((milestone) => <Box key={milestone.id}>
        <KanbanItemMilestone milestone={milestone} index={milestones.indexOf(milestone)} change={change}/></Box>);

    return (
        <Card width={"25vw"}>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '25vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : '#B6D6CC',
                    overflowY: "auto", maxHeight: "60vh"
                }}
                {...provided.droppableProps}
                >
                    {mItems}

                    {provided.placeholder}
                </CardBody>
            )}
            </Droppable>
        </Card>
    )
}

export function KanbanColumnQATask({name, id, tasks=[], updateParentTask, deleteParentTask} : KanbanColumnQATaskProps) {    
    console.log(tasks);
    let taskItems = tasks.map((task) => <Box key={task.id + "QA"}>
        <KanbanItemTask task={task} index={tasks.indexOf(task)} type="qatask"
        updateParentTask={updateParentTask} deleteParentTask={deleteParentTask}/></Box>);

    return (
        <Card width={"25vw"}>
            <CardHeader><Heading as="h1">{name}</Heading> </CardHeader>
            <Droppable droppableId={id}>
            {(provided, snapshot) => (
                <CardBody
                ref={provided.innerRef}
                style={{ 
                    width: '25vw',
                    backgroundColor: snapshot.isDraggingOver ? 'teal' : '#B6D6CC',
                    overflowY: "auto", maxHeight: "60vh"
                }}
                {...provided.droppableProps}
                >
                    {taskItems}

                    {provided.placeholder}
                </CardBody>
            )}
            </Droppable>
        </Card>
    )
}