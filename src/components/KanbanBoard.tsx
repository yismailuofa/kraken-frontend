import React from "react";
import {
    Flex, useToast,
} from "@chakra-ui/react"
import { ApiContext, MaybeUser, MaybeProject } from "../contexts/ApiContext";
import { components } from "../client/api";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { KanbanTopBar } from "./KanbanTopBar";
import { KanbanColumn } from "./KanbanColumn";
import { Task } from "../contexts/ApiContext";

interface KanbanBoardProps {
    onLogout: (token: MaybeUser) => void;
    onProjectUpdated: (project: MaybeProject) => void;
}

export function KanbanBoard({ onLogout, onProjectUpdated }: KanbanBoardProps) {
    // let plannedTaskList = [new Task("fix frontend error", "1"), new Task("fix backend error", "2"), new Task("add new feature", "3"),
    //     new Task("fix frontend error", "4"), new Task("fix backend error", "5"), new Task("add new feature", "6")
    // ];
    const plannedTaskList: Task[] = [];
    const inProgressTaskList: Task[] = [];
    const completedTaskList: Task[] = [];

    const [plannedTaskItems, setPlannedTaskItems] = useState(plannedTaskList)
    const [inProgressTaskItems, setInProgressTaskItems] = useState(inProgressTaskList)
    const [completedTaskItems, setCompletedTaskItems] = useState(completedTaskList)

    const client = useContext(ApiContext).client;
    const project = useContext(ApiContext).project;
    const navigate = useNavigate();
    const toast = useToast();

    const setTaskByStatus = (data: MaybeProject) => {
        if (data && data.tasks) {
            const tasklist = data.tasks;
            const temp_planned = tasklist?.filter(task => task.status === "Todo");
            const temp_started = tasklist?.filter(task => task.status === "In Progress");
            const temp_completed = tasklist?.filter(task => task.status === "Completed");

            setPlannedTaskItems(temp_planned);
            setInProgressTaskItems(temp_started);
            setCompletedTaskItems(temp_completed);
            console.log(plannedTaskItems, inProgressTaskItems, completedTaskItems);
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

    const updateTaskStatus = async (task: Task, endStatus: "Todo" | "In Progress" | "Completed" | null | undefined) => {
        const { data, error, response } = await client.PATCH(`/tasks/{id}`, 
        {   params: {
                path: {
                    id: task.id || ""
                }
            },
            body: {
                "name": task.name,
                "description": task.description,
                "dueDate": task.dueDate,
                "priority": task.priority,
                "status": endStatus,
                "assignedTo": task.assignedTo,
                "projectId": task.projectId,
                "milestoneId": task.milestoneId,
                "qaTask": {
                    "name": task.qaTask.name,
                    "description": task.qaTask.description,
                    "dueDate": task.qaTask.dueDate,
                    "priority": task.qaTask.priority,
                    "status": task.qaTask.status,
                    "assignedTo": task.qaTask.assignedTo
                },
                "dependentMilestones": task.dependentMilestones,
                "dependentTasks": task.dependentTasks
            }
        });

        if (error) {
            console.log(error);
          } else {
            console.log(response);
          }
    };
    

    const handleDragEnd = (result: DropResult) => {
        console.log(project?.id);
        const { destination, source, draggableId } = result;
        let draggedItem: Task | undefined;
        let temp_dest: Task[] = [];
        let temp_src: Task[] = [];
        let dest_status: "Todo" | "In Progress" | "Completed" | null | undefined;

        if (!destination || source.droppableId === destination.droppableId) return;

        if (source.droppableId === "0" && destination.droppableId === "1") {
            draggedItem = plannedTaskItems.find(item => item.id === draggableId);
            temp_src = plannedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...inProgressTaskItems, draggedItem];
                dest_status = "In Progress";
        }
        if (source.droppableId === "0" && destination.droppableId === "2") {
            draggedItem = plannedTaskItems.find(item => item.id === draggableId);
            temp_src = plannedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...completedTaskItems, draggedItem];
                dest_status = "Completed";
        }
        if (source.droppableId === "1" && destination.droppableId === "0") {
            draggedItem = inProgressTaskItems.find(item => item.id === draggableId);
            temp_src = inProgressTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...plannedTaskItems, draggedItem];
                dest_status = "Todo";
        }
        if (source.droppableId === "1" && destination.droppableId === "2") {
            draggedItem = inProgressTaskItems.find(item => item.id === draggableId);
            temp_src = inProgressTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...completedTaskItems, draggedItem];
                dest_status = "Completed";
        }
        if (source.droppableId === "2" && destination.droppableId === "0") {
            draggedItem = completedTaskItems.find(item => item.id === draggableId);
            temp_src = completedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...plannedTaskItems, draggedItem];
                dest_status = "Todo";
        }
        if (source.droppableId === "2" && destination.droppableId === "1") {
            draggedItem = completedTaskItems.find(item => item.id === draggableId);
            temp_src = completedTaskItems.filter(item => item.id !== draggableId);
            if (draggedItem)
                temp_dest = [...inProgressTaskItems, draggedItem];
                dest_status = "In Progress";
        }

        updateTaskList(source.droppableId, temp_src);
        updateTaskList(destination.droppableId, temp_dest);
        if (draggedItem)
            updateTaskStatus(draggedItem, dest_status);
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