import {
  Box,
  Flex,
  Button,
  useToast,
  Menu,
  MenuList,
  MenuItem,
  HStack,
  Text,
  MenuButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ApiContext, MaybeUser, MaybeProject } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { KanbanTopBar } from "./KanbanTopBar";
import { KanbanColumnTask, KanbanColumnMilestone } from "./KanbanColumn";
import { Task, Milestone } from "../contexts/ApiContext";
import { SideNavBar } from "./SideNavBar";

interface KanbanBoardProps {
  onLogout: (token: MaybeUser) => void;
  onProjectUpdated: (project: MaybeProject) => void;
}

export function KanbanBoard({ onLogout, onProjectUpdated }: KanbanBoardProps) {
  const [currentDisplay, setCurrentDisplay] = useState(1);
  const plannedTaskList: Task[] = [];
  const inProgressTaskList: Task[] = [];
  const completedTaskList: Task[] = [];

  const [plannedTaskItems, setPlannedTaskItems] = useState(plannedTaskList);
  const [inProgressTaskItems, setInProgressTaskItems] =
    useState(inProgressTaskList);
  const [completedTaskItems, setCompletedTaskItems] =
    useState(completedTaskList);

  const plannedMilestoneList: Milestone[] = [];
  const inProgressMilestoneList: Milestone[] = [];
  const completedMilestoneList: Milestone[] = [];

  const [plannedMilestoneItems, setPlannedMilestoneItems] =
    useState(plannedMilestoneList);
  const [inProgressMilestoneItems, setInProgressMilestoneItems] = useState(
    inProgressMilestoneList
  );
  const [completedMilestoneItems, setCompletedMilestoneItems] = useState(
    completedMilestoneList
  );

  const { client, project } = useContext(ApiContext);
  const navigate = useNavigate();
  const toast = useToast();

  if (!project) {
    navigate("/projectlist");
  }

  const setTaskByStatus = (data: MaybeProject) => {
    // TO DO: display QA tasks?
    if (data && data.tasks) {
      const tasklist = data.tasks;
      const temp_planned = tasklist?.filter((task) => task.status === "Todo");
      const temp_started = tasklist?.filter(
        (task) => task.status === "In Progress"
      );
      const temp_completed = tasklist?.filter(
        (task) => task.status === "Completed"
      );

      setPlannedTaskItems(temp_planned);
      setInProgressTaskItems(temp_started);
      setCompletedTaskItems(temp_completed);
      console.log(plannedTaskItems, inProgressTaskItems, completedTaskItems);
    }
  };

  const setMilestoneByStatus = (data: MaybeProject) => {
    if (data && data.milestones) {
      const mlist = data.milestones;
      const temp_planned = mlist?.filter(
        (milestone) => milestone.status === "Todo"
      );
      const temp_started = mlist?.filter(
        (milestone) => milestone.status === "In Progress"
      );
      const temp_completed = mlist?.filter(
        (milestone) => milestone.status === "Completed"
      );

      setPlannedMilestoneItems(temp_planned);
      setInProgressMilestoneItems(temp_started);
      setCompletedMilestoneItems(temp_completed);
    }
  };

  const fetchTasks = async () => {
    if (project && project.id) {
      const { error, data } = await client.GET("/projects/{id}", {
        params: { path: { id: project.id } },
      });

      if (error) {
        console.error(error);
        return;
      }

      setTaskByStatus(data);
      setMilestoneByStatus(data);
      onProjectUpdated(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [client]);

  const updateTaskList = (id: string, list: Task[]) => {
    if (id === "t0") {
      setPlannedTaskItems([...list]);
    }
    if (id === "t1") {
      setInProgressTaskItems([...list]);
    }
    if (id === "t2") {
      setCompletedTaskItems([...list]);
    }
  };

  const updateMilestoneList = (id: string, list: Milestone[]) => {
    if (id === "m0") {
      setPlannedMilestoneItems([...list]);
    }
    if (id === "m1") {
      setInProgressMilestoneItems([...list]);
    }
    if (id === "m2") {
      setCompletedMilestoneItems([...list]);
    }
  };

  const updateTaskStatus = async (
    task: Task,
    endStatus: "Todo" | "In Progress" | "Completed" | null | undefined
  ) => {
    // TO DO: update QA task
    const { data, error, response } = await client.PATCH(`/tasks/{id}`, {
      params: {
        path: {
          id: task.id || "",
        },
      },
      body: {
        status: endStatus,
      },
    });

    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  };

  const updateMilestoneStatus = async (
    milestone: Milestone,
    endStatus: "Todo" | "In Progress" | "Completed" | null | undefined
  ) => {
    // TO DO: update QA task
    const { data, error, response } = await client.PATCH(`/milestones/{id}`, {
      params: {
        path: {
          id: milestone.id || "",
        },
      },
      body: {
        status: endStatus,
      },
    });

    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  };

  const handleDisplayChange = (num: number) => {
    let textToChange = document.getElementById("currentDisplayText");
    let taskBlock = document.getElementById("taskDisplay");
    let milestoneBlock = document.getElementById("milestoneDisplay");

    if (textToChange && taskBlock && milestoneBlock && num === 1) {
      setCurrentDisplay(1);
      textToChange.innerHTML = "Task";
      taskBlock.style.display = "flex";
      milestoneBlock.style.display = "none";
    }
    if (textToChange && taskBlock && milestoneBlock && num === 2) {
      setCurrentDisplay(2);
      textToChange.innerHTML = "Milstone";
      taskBlock.style.display = "none";
      milestoneBlock.style.display = "flex";
    }
  };

  const handleDragTask = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    let draggedItem: Task | undefined;
    let temp_dest: Task[] = [];
    let temp_src: Task[] = [];
    let dest_status: "Todo" | "In Progress" | "Completed" | null | undefined;

    if (!destination || source.droppableId === destination.droppableId) return;

    if (source.droppableId === "t0" && destination.droppableId === "t1") {
      draggedItem = plannedTaskItems.find((item) => item.id === draggableId);
      temp_src = plannedTaskItems.filter((item) => item.id !== draggableId);
      if (draggedItem) temp_dest = [...inProgressTaskItems, draggedItem];
      dest_status = "In Progress";
    }
    if (source.droppableId === "t0" && destination.droppableId === "t2") {
      draggedItem = plannedTaskItems.find((item) => item.id === draggableId);
      temp_src = plannedTaskItems.filter((item) => item.id !== draggableId);
      if (draggedItem) temp_dest = [...completedTaskItems, draggedItem];
      dest_status = "Completed";
    }
    if (source.droppableId === "t1" && destination.droppableId === "t0") {
      draggedItem = inProgressTaskItems.find((item) => item.id === draggableId);
      temp_src = inProgressTaskItems.filter((item) => item.id !== draggableId);
      if (draggedItem) temp_dest = [...plannedTaskItems, draggedItem];
      dest_status = "Todo";
    }
    if (source.droppableId === "t1" && destination.droppableId === "t2") {
      draggedItem = inProgressTaskItems.find((item) => item.id === draggableId);
      temp_src = inProgressTaskItems.filter((item) => item.id !== draggableId);
      if (draggedItem) temp_dest = [...completedTaskItems, draggedItem];
      dest_status = "Completed";
    }
    if (source.droppableId === "t2" && destination.droppableId === "t0") {
      draggedItem = completedTaskItems.find((item) => item.id === draggableId);
      temp_src = completedTaskItems.filter((item) => item.id !== draggableId);
      if (draggedItem) temp_dest = [...plannedTaskItems, draggedItem];
      dest_status = "Todo";
    }
    if (source.droppableId === "t2" && destination.droppableId === "t1") {
      draggedItem = completedTaskItems.find((item) => item.id === draggableId);
      temp_src = completedTaskItems.filter((item) => item.id !== draggableId);
      if (draggedItem) temp_dest = [...inProgressTaskItems, draggedItem];
      dest_status = "In Progress";
    }

    updateTaskList(source.droppableId, temp_src);
    updateTaskList(destination.droppableId, temp_dest);
    if (draggedItem) updateTaskStatus(draggedItem, dest_status);
    console.log(plannedTaskItems, inProgressTaskItems, completedTaskItems);
  };

  const handleDragMilestone = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    let draggedItem: Milestone | undefined;
    let temp_dest: Milestone[] = [];
    let temp_src: Milestone[] = [];
    let dest_status: "Todo" | "In Progress" | "Completed" | null | undefined;

    if (!destination || source.droppableId === destination.droppableId) return;

    if (source.droppableId === "m0" && destination.droppableId === "m1") {
      draggedItem = plannedMilestoneItems.find(
        (item) => item.id === draggableId
      );
      temp_src = plannedMilestoneItems.filter(
        (item) => item.id !== draggableId
      );
      if (draggedItem) temp_dest = [...inProgressMilestoneItems, draggedItem];
      dest_status = "In Progress";
    }
    if (source.droppableId === "m0" && destination.droppableId === "m2") {
      draggedItem = plannedMilestoneItems.find(
        (item) => item.id === draggableId
      );
      temp_src = plannedMilestoneItems.filter(
        (item) => item.id !== draggableId
      );
      if (draggedItem) temp_dest = [...completedMilestoneItems, draggedItem];
      dest_status = "Completed";
    }
    if (source.droppableId === "m1" && destination.droppableId === "m0") {
      draggedItem = inProgressMilestoneItems.find(
        (item) => item.id === draggableId
      );
      temp_src = inProgressMilestoneItems.filter(
        (item) => item.id !== draggableId
      );
      if (draggedItem) temp_dest = [...plannedMilestoneItems, draggedItem];
      dest_status = "Todo";
    }
    if (source.droppableId === "m1" && destination.droppableId === "m2") {
      draggedItem = inProgressMilestoneItems.find(
        (item) => item.id === draggableId
      );
      temp_src = inProgressMilestoneItems.filter(
        (item) => item.id !== draggableId
      );
      if (draggedItem) temp_dest = [...completedMilestoneItems, draggedItem];
      dest_status = "Completed";
    }
    if (source.droppableId === "m2" && destination.droppableId === "m0") {
      draggedItem = completedMilestoneItems.find(
        (item) => item.id === draggableId
      );
      temp_src = completedMilestoneItems.filter(
        (item) => item.id !== draggableId
      );
      if (draggedItem) temp_dest = [...plannedMilestoneItems, draggedItem];
      dest_status = "Todo";
    }
    if (source.droppableId === "m2" && destination.droppableId === "m1") {
      draggedItem = completedMilestoneItems.find(
        (item) => item.id === draggableId
      );
      temp_src = completedMilestoneItems.filter(
        (item) => item.id !== draggableId
      );
      if (draggedItem) temp_dest = [...inProgressMilestoneItems, draggedItem];
      dest_status = "In Progress";
    }

    updateMilestoneList(source.droppableId, temp_src);
    updateMilestoneList(destination.droppableId, temp_dest);
    if (draggedItem) updateMilestoneStatus(draggedItem, dest_status);
    console.log(
      plannedMilestoneItems,
      inProgressMilestoneItems,
      completedMilestoneItems
    );
  };

  const handleDragEnd = (result: DropResult) => {
    console.log("currentDisplay:" + currentDisplay);
    if (currentDisplay === 1) {
      handleDragTask(result);
    }
    if (currentDisplay === 2) {
      handleDragMilestone(result);
    }
  };

  function handleTaskDeletion(deleted: Task) {
    let temp_list;
    temp_list = plannedTaskItems.filter((item) => item.id !== deleted.id);
    updateTaskList("t0", temp_list);
    temp_list = inProgressTaskItems.filter((item) => item.id !== deleted.id);
    updateTaskList("t1", temp_list);
    temp_list = completedTaskList.filter((item) => item.id !== deleted.id);
    updateTaskList("t2", temp_list);
  }

  function handleMilestoneDeletion(deleted: Milestone) {
    let temp_list;
    temp_list = plannedMilestoneItems.filter((item) => item.id !== deleted.id);
    updateMilestoneList("m0", temp_list);
    temp_list = inProgressMilestoneItems.filter(
      (item) => item.id !== deleted.id
    );
    updateMilestoneList("m1", temp_list);
    temp_list = completedMilestoneList.filter((item) => item.id !== deleted.id);
    updateMilestoneList("m2", temp_list);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <KanbanTopBar onLogout={onLogout} />
      <HStack w="100vw">
        <SideNavBar />
        <Box h="100vh" alignContent={"top"}>
          <Flex
            justifyContent={"center"}
            paddingBottom={"10px"}
            paddingTop={"10px"}
          >
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Text id="currentDisplayText">Task</Text>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    handleDisplayChange(1);
                  }}
                >
                  Task
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDisplayChange(2);
                  }}
                >
                  Milestone
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex
            justifyContent={"space-evenly"}
            gap={20}
            id="taskDisplay"
            display={"flex"}
          >
            <KanbanColumnTask
              name="To Do"
              id={"t0"}
              tasks={plannedTaskItems}
              change={handleTaskDeletion}
            />
            <KanbanColumnTask
              name="In Progress"
              id={"t1"}
              tasks={inProgressTaskItems}
              change={handleTaskDeletion}
            />
            <KanbanColumnTask
              name="Completed"
              id={"t2"}
              tasks={completedTaskItems}
              change={handleTaskDeletion}
            />
          </Flex>

          <Flex
            justifyContent={"space-evenly"}
            gap={20}
            id="milestoneDisplay"
            display={"none"}
          >
            <KanbanColumnMilestone
              name="To Do"
              id={"m0"}
              milestones={plannedMilestoneItems}
              change={handleMilestoneDeletion}
            />
            <KanbanColumnMilestone
              name="In Progress"
              id={"m1"}
              milestones={inProgressMilestoneItems}
              change={handleMilestoneDeletion}
            />
            <KanbanColumnMilestone
              name="Completed"
              id={"m2"}
              milestones={completedMilestoneItems}
              change={handleMilestoneDeletion}
            />
          </Flex>
        </Box>
      </HStack>
    </DragDropContext>
  );
}
