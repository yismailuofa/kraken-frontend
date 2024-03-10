import React from "react";
import {
    Flex,
} from "@chakra-ui/react"
import { ApiContext, MaybeUser, MaybeProject } from "../contexts/ApiContext";
import { components } from "../client/api";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { KanbanTopBar } from "./KanbanTopBar";
import { KanbanColumn } from "./KanbanColumn";
import { Task } from "../models/Task";

interface KanbanBoardProps {
    onLogout: (token: MaybeUser) => void;
    onProjectUpdated: (project: MaybeProject) => void;
}

export function KanbanBoard({ onLogout, onProjectUpdated }: KanbanBoardProps) {
    // let plannedTaskList = [new Task("fix frontend error", "1"), new Task("fix backend error", "2"), new Task("add new feature", "3"),
    //     new Task("fix frontend error", "4"), new Task("fix backend error", "5"), new Task("add new feature", "6")
    // ];
    let plannedTaskList: Task[] = [];
    let inProgressTaskList: Task[] = [];
    let completedTaskList: Task[] = [];

    const [plannedTaskItems, setPlannedTaskItems] = useState(plannedTaskList)
    const [inProgressTaskItems, setInProgressTaskItems] = useState(inProgressTaskList)
    const [completedTaskItems, setCompletedTaskItems] = useState(completedTaskList)

    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;
    const navigate = useNavigate();

    const setTaskByStatus = (data: MaybeProject) => {
        if (data) {
            console.log(data)
        }
    }

    const fetchTasks = async () => {
        if (project && project.id) {
            const { error, data } = await client.GET("/projects/{id}", {params: {path: {id: project.id}}});
    
            if (error) {
              console.error(error);
              return;
            }
        
            setTaskByStatus(data);
            onProjectUpdated(data);
        }
      };
    
      useEffect(() => {
        fetchTasks();
      }, [client]);
    
    const updateTaskList = (id: string, list: Task[]) => {
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

    const handleDragEnd = (result: DropResult) => {
        console.log(project?.id);
        const { destination, source, draggableId } = result;
        let draggedItem: Task | undefined;
        let temp_dest: Task[] = [];
        let temp_src: Task[] = [];

        if (!destination || source.droppableId === destination.droppableId) return;

        if (source.droppableId === "0" && destination.droppableId === "1") {
            draggedItem = plannedTaskItems.find(item => item.id === draggableId);
            temp_src = plannedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...inProgressTaskItems, draggedItem];
        }
        if (source.droppableId === "0" && destination.droppableId === "2") {
            draggedItem = plannedTaskItems.find(item => item.id === draggableId);
            temp_src = plannedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...completedTaskItems, draggedItem];
        }
        if (source.droppableId === "1" && destination.droppableId === "0") {
            draggedItem = inProgressTaskItems.find(item => item.id === draggableId);
            temp_src = inProgressTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...plannedTaskItems, draggedItem];
        }
        if (source.droppableId === "1" && destination.droppableId === "2") {
            draggedItem = inProgressTaskItems.find(item => item.id === draggableId);
            temp_src = inProgressTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...completedTaskItems, draggedItem];
        }
        if (source.droppableId === "2" && destination.droppableId === "0") {
            draggedItem = completedTaskItems.find(item => item.id === draggableId);
            temp_src = completedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...plannedTaskItems, draggedItem];
        }
        if (source.droppableId === "2" && destination.droppableId === "1") {
            draggedItem = completedTaskItems.find(item => item.id === draggableId);
            temp_src = completedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...inProgressTaskItems, draggedItem];
        }

        updateTaskList(source.droppableId, temp_src)
        updateTaskList(destination.droppableId, temp_dest)
        console.log(plannedTaskItems, inProgressTaskItems, completedTaskItems)
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <KanbanTopBar onLogout={onLogout}/>
            <Flex justifyContent={"space-evenly"} gap={10}>
                <KanbanColumn name="To Do" id={"0"} tasks={plannedTaskItems}/>
                <KanbanColumn name="In Progress" id={"1"} tasks={inProgressTaskItems}/>
                <KanbanColumn name="Completed" id={"2"} tasks={completedTaskItems}/>
            </Flex>
        </DragDropContext>
    )
}