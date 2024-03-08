import React from "react";
import {
    VStack,
    Stack,
    Heading,
    Button,
    Grid,
    GridItem,
    Flex,
} from "@chakra-ui/react"
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { KanbanTopBar } from "./KanbanTopBar";
import { KanbanColumn, KanbanColumnFilled } from "./KanbanColumn";

class Task {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

export function KanbanBoard() {
    let plannedTaskList = [new Task("fix frontend error", "1"), new Task("fix backend error", "2"), new Task("add new feature", "3"),
        new Task("fix frontend error", "4"), new Task("fix backend error", "5"), new Task("add new feature", "6")
    ];
    let inProgressTaskList = [];
    let completedTaskList = [];

    const [plannedTaskItems, setPlannedTaskItems] = useState(plannedTaskList)
    const [inProgressTaskItems, setInProgressTaskItems] = useState(inProgressTaskList)
    const [completedTaskItems, setCompletedTaskItems] = useState(completedTaskList)
    
    const updateTaskList = (id, list) => {
        if (id === "0") {
            setPlannedTaskItems([...list]);
        }
        if (id === "1") {
            setInProgressTaskItems([...list]);
        }
        if (id === "2") {
            setCompletedTaskItems([...list]);
        }
    }

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        let draggedItem, temp_dest, temp_src;

        if (!destination || source.droppableId === destination.droppableId) return;

        if (source.droppableId === "0" && destination.droppableId === "1") {
            draggedItem = plannedTaskItems.find(item => item.id === draggableId);
            temp_src = plannedTaskItems.filter(item => item.id !== draggableId);
            temp_dest = [...inProgressTaskItems, draggedItem];
        }
        if (source.droppableId === "0" && destination.droppableId === "2") {
            draggedItem = plannedTaskItems.find(item => item.id === draggableId);
            temp_src = plannedTaskItems.filter(item => item.id !== draggableId);
            temp_dest = [...completedTaskItems, draggedItem];
        }
        if (source.droppableId === "1" && destination.droppableId === "0") {
            draggedItem = inProgressTaskItems.find(item => item.id === draggableId);
            temp_src = inProgressTaskItems.filter(item => item.id !== draggableId);
            temp_dest = [...plannedTaskItems, draggedItem];
        }
        if (source.droppableId === "1" && destination.droppableId === "2") {
            draggedItem = inProgressTaskItems.find(item => item.id === draggableId);
            temp_src = inProgressTaskItems.filter(item => item.id !== draggableId);
            temp_dest = [...completedTaskItems, draggedItem];
        }
        if (source.droppableId === "2" && destination.droppableId === "0") {
            draggedItem = completedTaskItems.find(item => item.id === draggableId);
            temp_src = completedTaskItems.filter(item => item.id !== draggableId);
            temp_dest = [...plannedTaskItems, draggedItem];
        }
        if (source.droppableId === "2" && destination.droppableId === "1") {
            draggedItem = completedTaskItems.find(item => item.id === draggableId);
            temp_src = completedTaskItems.filter(item => item.id !== draggableId);
            temp_dest = [...inProgressTaskItems, draggedItem];
        }

        updateTaskList(source.droppableId, temp_src)
        updateTaskList(destination.droppableId, temp_dest)
        console.log(plannedTaskItems, inProgressTaskItems, completedTaskItems)
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <KanbanTopBar/>
            <Flex justifyContent={"space-evenly"} gap={10}>
                <KanbanColumn name="To Do" id={"0"} tasks={plannedTaskItems}/>
                <KanbanColumn name="In Progress" id={"1"} tasks={inProgressTaskItems}/>
                <KanbanColumn name="Completed" id={"2"} tasks={completedTaskItems}/>
            </Flex>
        </DragDropContext>
    )
}