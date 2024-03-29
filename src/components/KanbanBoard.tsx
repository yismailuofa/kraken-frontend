import {
  Box,
  Flex,
  Button,
  useToast,
  Menu,
  MenuList,
  MenuItem,
  Text,
  MenuButton,
  IconButton,
  Spacer,
  FormLabel,
  HStack,
  VStack
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ApiContext, MaybeUser, MaybeProject } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { KanbanColumnTask, KanbanColumnMilestone, KanbanColumnQATask } from "./KanbanColumn";
import { Task, Milestone } from "../contexts/ApiContext";
import SidebarWithHeader from "./SideBarWithHeader";
import { IoMdAdd } from "react-icons/io";

interface KanbanBoardProps {
  onLogout: (token: MaybeUser) => void;
  onProjectUpdated: (project: MaybeProject) => void;
}

interface KanbanBoardContentProps {
  onProjectUpdated: (project: MaybeProject) => void;
}

export function KanbanBoard({ onLogout, onProjectUpdated }: KanbanBoardProps) {
  const { user, project } = useContext(ApiContext);
  const navigate = useNavigate();

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <SidebarWithHeader
        onLogout={onLogout}
        content={
          <KanbanBoardContent
            onProjectUpdated={onProjectUpdated}
          ></KanbanBoardContent>
        }
        headerButtons={
          <Menu>
            <MenuButton
              mr={5}
              as={IconButton}
              colorScheme="teal"
              size="lg"
              aria-label="Options"
              icon={<IoMdAdd />}
              variant="solid"
            />
            <MenuList>
              <MenuItem onClick={() => navigate("/addtask")}>
                {" "}
                Add Task{" "}
              </MenuItem>
              <MenuItem onClick={() => navigate("/addmilestone")}>
                {" "}
                Add Milestone{" "}
              </MenuItem>
            </MenuList>
          </Menu>
        }
        pageTitle="Kanban"
      />
    </>
  );
}

export function KanbanBoardContent({
  onProjectUpdated,
}: KanbanBoardContentProps) {
  const [currentDisplay, setCurrentDisplay] = useState(1);
  const [plannedTaskList, setPlannedTaskList] = useState<Task[]>([]);
  const [inProgressTaskList, setInProgressTaskList] = useState<Task[]>([]);
  const [completedTaskList, setCompletedTaskList] = useState<Task[]>([]);

  const [plannedTaskItems, setPlannedTaskItems] = useState<Task[]>([]);
  const [inProgressTaskItems, setInProgressTaskItems] = useState<Task[]>([]);
  const [completedTaskItems, setCompletedTaskItems] = useState<Task[]>([]);

  const [plannedMilestoneList, setPlannedMilestoneList] = useState<Milestone[]>([]);
  const [inProgressMilestoneList, setInProgressMilestoneList]= useState<Milestone[]>([]);
  const [completedMilestoneList, setCompletedMilestoneList] = useState<Milestone[]>([]);

  const [plannedMilestoneItems, setPlannedMilestoneItems] = useState<Milestone[]>([]);
  const [inProgressMilestoneItems, setInProgressMilestoneItems] = useState<Milestone[]>([]);
  const [completedMilestoneItems, setCompletedMilestoneItems] = useState<Milestone[]>([]);

  const [plannedQATaskList, setPlannedQATaskList] = useState<Task[]>([]);
  const [inProgressQATaskList, setInProgressQATaskList] = useState<Task[]>([]);
  const [completedQATaskList, setCompletedQATaskList] = useState<Task[]>([]);

  const [plannedQATaskItems, setPlannedQATaskItems] = useState<Task[]>([]);
  const [inProgressQATaskItems, setInProgressQATaskItems] = useState<Task[]>([]);
  const [completedQATaskItems, setCompletedQATaskItems] = useState<Task[]>([]);

  const { client, project } = useContext(ApiContext);
  const navigate = useNavigate();
  const toast = useToast();

  if (!project) {
    navigate("/projectlist");
  }

  const setTaskByStatus = (data: MaybeProject) => {
    // sets both task and qa task
    if (data && data.tasks) {
      const tasklist = data.tasks;
      const plannedTaskList = tasklist?.filter((task) => task.status === "Todo");
      const inProgressTaskList = tasklist?.filter(
        (task) => task.status === "In Progress"
      );
      const completedTaskList = tasklist?.filter(
        (task) => task.status === "Completed"
      );

      const plannedQATaskList = tasklist?.filter((task) => task.qaTask.status === "Todo");
      const inProgressQATaskList = tasklist?.filter(
        (task) => task.qaTask.status === "In Progress"
      );
      const completedQATaskList = tasklist?.filter(
        (task) => task.qaTask.status === "Completed"
      );

      setPlannedTaskList(plannedTaskList);
      setInProgressTaskList(inProgressTaskList);
      setCompletedTaskList(completedTaskList);

      setPlannedTaskItems(plannedTaskList);
      setInProgressTaskItems(inProgressTaskList);
      setCompletedTaskItems(completedTaskList);
      console.log(plannedTaskList, inProgressTaskList, completedTaskList);

      setPlannedQATaskList(plannedQATaskList);
      setInProgressQATaskList(inProgressQATaskList);
      setCompletedQATaskList(completedQATaskList);

      setPlannedQATaskItems(plannedQATaskList);
      setInProgressQATaskItems(inProgressQATaskList);
      setCompletedQATaskItems(completedQATaskList);

      console.log(plannedQATaskList, inProgressQATaskList, completedQATaskList)
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

      setPlannedMilestoneList(temp_planned);
      setInProgressMilestoneList(temp_started);
      setCompletedMilestoneList(temp_completed);

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

  const updateTaskList = (id: string, list: Task[], taskItem: Task, add: Boolean) => {
    let temp_list;
    if (id === "t0") {
      if (add) {
        setPlannedTaskList([...plannedTaskList, taskItem]);
      } else {
        temp_list = plannedTaskList.filter(item => item.id !== taskItem.id);
        setPlannedTaskList([...temp_list]);
      }

      setPlannedTaskItems([...list]);
    }
    if (id === "t1") {
      if (add) {
        setInProgressTaskList([...inProgressTaskList, taskItem])
      } else {
        temp_list = inProgressTaskList.filter(item => item.id !== taskItem.id);
        setInProgressTaskList([...temp_list]);
      }
      setInProgressTaskItems([...list]);
    }
    if (id === "t2") {
      if (add) {
        setCompletedTaskList([...completedTaskList, taskItem])
      } else {
        temp_list = completedTaskList.filter(item => item.id !== taskItem.id);
        setCompletedTaskList([...temp_list]);
      }

      setCompletedTaskItems([...list]);
    }
  };

  const updateQATaskList = (id: string, list: Task[], taskItem: Task, add: Boolean) => {
    let temp_list;
    if (id === "qt0") {
      if (add) {
        setPlannedQATaskList([...plannedQATaskList, taskItem]);
      } else {
        temp_list = plannedQATaskList.filter(item => item.id !== taskItem.id);
        setPlannedQATaskList([...temp_list]);
      }

      console.log("sadsa:" + plannedQATaskList)

      setPlannedQATaskItems([...list]);
    }
    if (id === "qt1") {
      if (add) {
        setInProgressQATaskList([...inProgressQATaskList, taskItem])
      } else {
        temp_list = inProgressQATaskList.filter(item => item.id !== taskItem.id);
        setInProgressQATaskList([...temp_list]);
      }
      setInProgressQATaskItems([...list]);
    }
    if (id === "qt2") {
      if (add) {
        setCompletedQATaskList([...completedQATaskList, taskItem])
      } else {
        temp_list = completedQATaskList.filter(item => item.id !== taskItem.id);
        setCompletedQATaskList([...temp_list]);
      }

      setCompletedQATaskItems([...list]);
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
    endTaskStatus: "Todo" | "In Progress" | "Completed" | null | undefined,
    endQATaskStatus: "Todo" | "In Progress" | "Completed" | null | undefined
  ) => {
    const { data, error, response } = await client.PATCH(`/tasks/{id}`, {
      params: {
        path: {
          id: task.id || "",
        },
      },
      body: {
        status: endTaskStatus,
        qaTask: {
          status: endQATaskStatus,
        }
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

  const handleTaskUpdate = (updated: Task) => {
    let temp_task_list, temp_qa_list;

    if (plannedTaskList.find((item) => item.id === updated.id)){
      temp_task_list = plannedTaskList.filter((item) => item.id !== updated.id);
      console.log("handle: " + updated.priority)
      setPlannedTaskList([...temp_task_list, updated]);
      console.log(plannedTaskList);
    }
    if (plannedQATaskList.find((item) => item.id === updated.id)){
      temp_qa_list = plannedQATaskList.filter((item) => item.id !== updated.id);
      setPlannedQATaskList([...temp_qa_list, updated]);
    }
    if (inProgressTaskList.find((item) => item.id === updated.id)){
      temp_task_list = inProgressTaskList.filter((item) => item.id !== updated.id);
      setInProgressTaskList([...temp_task_list, updated]);
    }
    if (inProgressQATaskList.find((item) => item.id === updated.id)){
      temp_qa_list = inProgressQATaskList.filter((item) => item.id !== updated.id);
      setInProgressQATaskList([...temp_qa_list, updated]);
    }
    if (completedTaskList.find((item) => item.id === updated.id)){
      temp_task_list = completedTaskList.filter((item) => item.id !== updated.id);
      setCompletedTaskList([...temp_task_list, updated]);
    }
    if (completedQATaskList.find((item) => item.id === updated.id)){
      temp_qa_list = completedQATaskList.filter((item) => item.id !== updated.id);
      setCompletedQATaskList([...temp_qa_list, updated]);
      console.log(updated.priority);
      console.log(completedQATaskList);
    }

    handleFilterChange(7);

    console.log(plannedTaskList, inProgressTaskList, completedTaskList);
  }

  const handleDisplayChange = (num: number) => {
    let textToChange = document.getElementById("currentDisplayText");
    let taskBlock = document.getElementById("taskDisplay");
    let milestoneBlock = document.getElementById("milestoneDisplay");
    let qaTaskBlock = document.getElementById("QATaskDisplay");
    let priorityFilter = document.getElementById("priorityFilter");

    if (textToChange && taskBlock && milestoneBlock && qaTaskBlock && priorityFilter && num === 1) {
      setCurrentDisplay(1);
      textToChange.innerHTML = "Task";
      taskBlock.style.display = "flex";
      milestoneBlock.style.display = "none";
      qaTaskBlock.style.display = "none";
      priorityFilter.style.display = "inline-block";

      handleFilterChange(0);
      handleFilterChange(7);
    }
    if (textToChange && taskBlock && milestoneBlock && qaTaskBlock && priorityFilter && num === 2) {
      setCurrentDisplay(2);
      textToChange.innerHTML = "Milestone";
      taskBlock.style.display = "none";
      milestoneBlock.style.display = "flex";
      qaTaskBlock.style.display = "none";
      priorityFilter.style.display = "none";
      handleFilterChange(0);
    }
    if (textToChange && taskBlock && milestoneBlock && qaTaskBlock && priorityFilter && num === 3) {
      setCurrentDisplay(3);
      textToChange.innerHTML = "QA Task";
      taskBlock.style.display = "none";
      milestoneBlock.style.display = "none";
      qaTaskBlock.style.display = "flex";
      priorityFilter.style.display = "inline-block";
      handleFilterChange(0);
      handleFilterChange(7);
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

    if (draggedItem) {
      updateTaskList(source.droppableId, temp_src, draggedItem, false);
      updateTaskList(destination.droppableId, temp_dest, draggedItem, true);
    }
    if (draggedItem) updateTaskStatus(draggedItem, dest_status, draggedItem.qaTask.status);
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

  const handleDragQATask = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    let draggedItem: Task | undefined;
    let temp_dest: Task[] = [];
    let temp_src: Task[] = [];
    let dest_status: "Todo" | "In Progress" | "Completed" | null | undefined;

    if (!destination || source.droppableId === destination.droppableId) return;

    if (source.droppableId === "qt0" && destination.droppableId === "qt1") {
      draggedItem = plannedQATaskItems.find((item) => item.id === draggableId.slice(0, -2));
      temp_src = plannedQATaskItems.filter((item) => item.id !== draggableId.slice(0, -2));
      if (draggedItem) temp_dest = [...inProgressQATaskItems, draggedItem];
      dest_status = "In Progress";
    }
    if (source.droppableId === "qt0" && destination.droppableId === "qt2") {
      draggedItem = plannedQATaskItems.find((item) => item.id === draggableId.slice(0, -2));
      temp_src = plannedQATaskItems.filter((item) => item.id !== draggableId.slice(0, -2));
      if (draggedItem) temp_dest = [...completedQATaskItems, draggedItem];
      dest_status = "Completed";
    }
    if (source.droppableId === "qt1" && destination.droppableId === "qt0") {
      draggedItem = inProgressQATaskItems.find((item) => item.id === draggableId.slice(0, -2));
      temp_src = inProgressQATaskItems.filter((item) => item.id !== draggableId.slice(0, -2));
      if (draggedItem) temp_dest = [...plannedQATaskItems, draggedItem];
      dest_status = "Todo";
    }
    if (source.droppableId === "qt1" && destination.droppableId === "qt2") {
      draggedItem = inProgressQATaskItems.find((item) => item.id === draggableId.slice(0, -2));
      temp_src = inProgressQATaskItems.filter((item) => item.id !== draggableId.slice(0, -2));
      if (draggedItem) temp_dest = [...completedQATaskItems, draggedItem];
      dest_status = "Completed";
    }
    if (source.droppableId === "qt2" && destination.droppableId === "qt0") {
      draggedItem = completedQATaskItems.find((item) => item.id === draggableId.slice(0, -2));
      temp_src = completedQATaskItems.filter((item) => item.id !== draggableId.slice(0, -2));
      if (draggedItem) temp_dest = [...plannedQATaskItems, draggedItem];
      dest_status = "Todo";
    }
    if (source.droppableId === "qt2" && destination.droppableId === "qt1") {
      draggedItem = completedQATaskItems.find((item) => item.id === draggableId.slice(0, -2));
      temp_src = completedQATaskItems.filter((item) => item.id !== draggableId.slice(0, -2));
      if (draggedItem) temp_dest = [...inProgressQATaskItems, draggedItem];
      dest_status = "In Progress";
    }

    if (draggedItem) {
      updateQATaskList(source.droppableId, temp_src, draggedItem, false);
      updateQATaskList(destination.droppableId, temp_dest, draggedItem, true);
    }
    if (draggedItem) updateTaskStatus(draggedItem, draggedItem.status, dest_status);
    console.log(plannedQATaskItems, inProgressQATaskItems, completedQATaskItems);
  };

  const handleDragEnd = (result: DropResult) => {
    console.log("currentDisplay:" + currentDisplay);
    if (currentDisplay === 1) {
      handleDragTask(result);
    }
    if (currentDisplay === 2) {
      handleDragMilestone(result);
    }
    if (currentDisplay === 3) {
      handleDragQATask(result);
    }
  };

  function handleTaskDeletion(deleted: Task) {
    let temp_task_list, temp_qa_list, temp_task_item, temp_qa_item;
    temp_task_list = plannedTaskItems.filter((item) => item.id !== deleted.id);
    temp_qa_list = plannedQATaskItems.filter((item) => item.id !== deleted.id);
    temp_task_item = plannedTaskItems.find((item) => item.id === deleted.id);
    temp_qa_item = plannedQATaskItems.find((item) => item.id === deleted.id);
    if (temp_task_item && temp_qa_item) {
      updateTaskList("t0", temp_task_list, temp_task_item, false);
      updateQATaskList("qt0", temp_qa_list, temp_qa_item, false);
    }

    temp_task_list = inProgressTaskItems.filter((item) => item.id !== deleted.id);
    temp_qa_list = inProgressQATaskItems.filter((item) => item.id !== deleted.id);
    temp_task_item = inProgressTaskItems.find((item) => item.id === deleted.id);
    temp_qa_item = inProgressQATaskItems.find((item) => item.id === deleted.id);
    if (temp_task_item && temp_qa_item) {
      updateTaskList("t1", temp_task_list, temp_task_item, false);
      updateQATaskList("qt1", temp_qa_list, temp_qa_item, false);
    }

    temp_task_list = completedTaskItems.filter((item) => item.id !== deleted.id);
    temp_qa_list = completedQATaskItems.filter((item) => item.id !== deleted.id);
    temp_task_item = completedTaskItems.find((item) => item.id === deleted.id);
    temp_qa_item = completedQATaskItems.find((item) => item.id === deleted.id);
    if (temp_task_item && temp_qa_item) {
      updateTaskList("t2", temp_task_list, temp_task_item, false);
      updateQATaskList("qt2", temp_qa_list, temp_qa_item, false);
    }
  }

  function handleMilestoneDeletion(deleted: Milestone) {
    let temp_list;
    temp_list = plannedMilestoneItems.filter((item) => item.id !== deleted.id);
    updateMilestoneList("m0", temp_list);
    temp_list = inProgressMilestoneItems.filter((item) => item.id !== deleted.id);
    updateMilestoneList("m1", temp_list);
    temp_list = completedMilestoneItems.filter((item) => item.id !== deleted.id);
    updateMilestoneList("m2", temp_list);
  }

  function handleFilterChange(index: number) {
    const planned_task_column = document.getElementById('t0div');
    const in_progress_task_column = document.getElementById('t1div');
    const completed_task_column = document.getElementById('t2div');
    const planned_milestone_column = document.getElementById('m0div');
    const in_progress_milestone_column = document.getElementById('m1div');
    const completed_milestone_column = document.getElementById('m2div');
    const planned_qa_task_column = document.getElementById('qt0div');
    const in_progress_qa_task_column = document.getElementById('qt1div');
    const completed_qa_task_column = document.getElementById('qt2div');
    const status_filter_text = document.getElementById('currentStatusFilterText');
    const priority_filter_text = document.getElementById('currentPriorityFilterText');

    if ((currentDisplay === 1 || currentDisplay === 3) && planned_task_column && in_progress_task_column && 
      completed_task_column && planned_qa_task_column && in_progress_qa_task_column && completed_qa_task_column && 
      status_filter_text && priority_filter_text) {
      if (index === 0) {
        if (currentDisplay === 1) {
          status_filter_text.innerHTML = 'All'
          planned_task_column.style.display = 'flex';
          in_progress_task_column.style.display = 'flex'
          completed_task_column.style.display = 'flex'
        }
        if (currentDisplay === 3) {
          status_filter_text.innerHTML = 'All'
          planned_qa_task_column.style.display = 'flex';
          in_progress_qa_task_column.style.display = 'flex'
          completed_qa_task_column.style.display = 'flex'
        }
      }
      if (index === 1) {
        if (currentDisplay === 1) {
          status_filter_text.innerHTML = 'To Do'
          planned_task_column.style.display = 'flex';
          in_progress_task_column.style.display = 'none'
          completed_task_column.style.display = 'none'
        }
        if (currentDisplay === 3) {
          status_filter_text.innerHTML = 'To Do'
          planned_qa_task_column.style.display = 'flex';
          in_progress_qa_task_column.style.display = 'none'
          completed_qa_task_column.style.display = 'none'
        }
      }
      if (index === 2) {
        if (currentDisplay === 1) {
          status_filter_text.innerHTML = 'In Progress'
          planned_task_column.style.display = 'none';
          in_progress_task_column.style.display = 'flex'
          completed_task_column.style.display = 'none'
        }
        if (currentDisplay === 3) {
          status_filter_text.innerHTML = 'In Progress'
          planned_qa_task_column.style.display = 'none';
          in_progress_qa_task_column.style.display = 'flex'
          completed_qa_task_column.style.display = 'none'
        }
      }
      if (index === 3) {
        if (currentDisplay === 1) {
          status_filter_text.innerHTML = 'Completed'
          planned_task_column.style.display = 'none';
          in_progress_task_column.style.display = 'none'
          completed_task_column.style.display = 'flex'
        }
        if (currentDisplay === 3) {
          status_filter_text.innerHTML = 'Completed'
          planned_qa_task_column.style.display = 'none';
          in_progress_qa_task_column.style.display = 'none'
          completed_qa_task_column.style.display = 'flex'
        }
      }
      if (index === 4) {
        priority_filter_text.innerHTML = 'Low Priority'

        const temp_planned_list = plannedTaskList.filter(item => item.priority==="Low")
        const temp_started_list = inProgressTaskList.filter(item => item.priority==="Low")
        const temp_completed_list = completedTaskList.filter(item => item.priority==="Low")

        setPlannedTaskItems(temp_planned_list)
        setInProgressTaskItems(temp_started_list)
        setCompletedTaskItems(temp_completed_list)

        const temp_qa_planned_list = plannedQATaskList.filter(item => item.qaTask.priority==="Low")
        const temp_qa_started_list = inProgressQATaskList.filter(item => item.qaTask.priority==="Low")
        const temp_qa_completed_list = completedQATaskList.filter(item => item.qaTask.priority==="Low")

        setPlannedQATaskItems(temp_qa_planned_list)
        setInProgressQATaskItems(temp_qa_started_list)
        setCompletedQATaskItems(temp_qa_completed_list)
      }
      if (index === 5) {
        priority_filter_text.innerHTML = 'Medium Priority'

        const temp_planned_list = plannedTaskList.filter(item => item.priority==="Medium")
        const temp_started_list = inProgressTaskList.filter(item => item.priority==="Medium")
        const temp_completed_list = completedTaskList.filter(item => item.priority==="Medium")

        setPlannedTaskItems(temp_planned_list)
        setInProgressTaskItems(temp_started_list)
        setCompletedTaskItems(temp_completed_list)

        const temp_qa_planned_list = plannedQATaskList.filter(item => item.qaTask.priority==="Medium")
        const temp_qa_started_list = inProgressQATaskList.filter(item => item.qaTask.priority==="Medium")
        const temp_qa_completed_list = completedQATaskList.filter(item => item.qaTask.priority==="Medium")

        setPlannedQATaskItems(temp_qa_planned_list)
        setInProgressQATaskItems(temp_qa_started_list)
        setCompletedQATaskItems(temp_qa_completed_list)
      }
      if (index === 6) {
        priority_filter_text.innerHTML = 'High Priority'

        const temp_planned_list = plannedTaskList.filter(item => item.priority==="High")
        const temp_started_list = inProgressTaskList.filter(item => item.priority==="High")
        const temp_completed_list = completedTaskList.filter(item => item.priority==="High")

        console.log(temp_planned_list, temp_started_list, temp_completed_list)

        setPlannedTaskItems(temp_planned_list)
        setInProgressTaskItems(temp_started_list)
        setCompletedTaskItems(temp_completed_list)

        const temp_qa_planned_list = plannedQATaskList.filter(item => item.qaTask.priority==="High")
        const temp_qa_started_list = inProgressQATaskList.filter(item => item.qaTask.priority==="High")
        const temp_qa_completed_list = completedQATaskList.filter(item => item.qaTask.priority==="High")

        setPlannedQATaskItems(temp_qa_planned_list)
        setInProgressQATaskItems(temp_qa_started_list)
        setCompletedQATaskItems(temp_qa_completed_list)

        console.log("high: " + temp_qa_completed_list);
      }
      if (index === 7) {
        priority_filter_text.innerHTML = 'All'

        setPlannedTaskItems(plannedTaskList)
        setInProgressTaskItems(inProgressTaskList)
        setCompletedTaskItems(completedTaskList)

        setPlannedQATaskItems(plannedQATaskList)
        setInProgressQATaskItems(inProgressQATaskList)
        setCompletedQATaskItems(completedQATaskList)
      }
    }

    if (currentDisplay === 2 && planned_milestone_column && in_progress_milestone_column && 
      completed_milestone_column && status_filter_text && priority_filter_text) {
      if (index === 0) {
        status_filter_text.innerHTML = 'All'
        planned_milestone_column.style.display = 'flex';
        in_progress_milestone_column.style.display = 'flex'
        completed_milestone_column.style.display = 'flex'
      }
      if (index === 1) {
        status_filter_text.innerHTML = 'To Do'
        planned_milestone_column.style.display = 'flex';
        in_progress_milestone_column.style.display = 'none'
        completed_milestone_column.style.display = 'none'
      }
      if (index === 2) {
        status_filter_text.innerHTML = 'In Progress'
        planned_milestone_column.style.display = 'none';
        in_progress_milestone_column.style.display = 'flex'
        completed_milestone_column.style.display = 'none'
      }
      if (index === 3) {
        status_filter_text.innerHTML = 'Completed'
        planned_milestone_column.style.display = 'none';
        in_progress_milestone_column.style.display = 'none'
        completed_milestone_column.style.display = 'flex'
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <VStack h="80vh" alignContent={"top"} justifyContent={"right"}>
        <HStack
          justifyContent={"space-between"}
          paddingBottom={"5px"}
          w={"100%"}
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
              <MenuItem
                onClick={() => {
                  handleDisplayChange(3);
                }}
              >
                QA Task
              </MenuItem>
            </MenuList>
          </Menu>

          <HStack justifyContent="flex-start" alignItems="center">
            <HStack id="statusFilter">
            <FormLabel minW={15}> Status: </FormLabel>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Text id="currentStatusFilterText"> Choose a status </Text>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(0);
                  }}
                >
                  All
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(1);
                  }}
                >
                  To Do
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(2);
                  }}
                >
                  In Progress
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(3);
                  }}
                >
                  Completed
                </MenuItem>
              </MenuList>
            </Menu>
            </HStack>
          
            <Flex id="priorityFilter">
            <HStack paddingLeft={"20px"}>
            <FormLabel minW={15}> Priority: </FormLabel>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Text id="currentPriorityFilterText"> Choose a prioirity </Text>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(7);
                  }}
                >
                  All
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(4);
                  }}
                >
                  Low Priority
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(5);
                  }}
                >
                  Medium Priority
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleFilterChange(6);
                  }}
                >
                  High Priority
                </MenuItem>
              </MenuList>
            </Menu>
            </HStack>
            </Flex>
          </HStack>
        </HStack>
        <Flex
          justifyContent={"space-evenly"}
          gap={20}
          id="taskDisplay"
          display={"flex"}
        >
          <Flex id="t0div">
          <KanbanColumnTask
            name="To Do"
            id={"t0"}
            tasks={plannedTaskItems}
            updateParentTask={handleTaskUpdate}
            deleteParentTask={handleTaskDeletion}
          />
          </Flex>
          <Flex id="t1div">
          <KanbanColumnTask
            name="In Progress"
            id={"t1"}
            tasks={inProgressTaskItems}
            updateParentTask={handleTaskUpdate}
            deleteParentTask={handleTaskDeletion}
          />
          </Flex>
          <Flex id="t2div">
          <KanbanColumnTask
            name="Completed"
            id={"t2"}
            tasks={completedTaskItems}
            updateParentTask={handleTaskUpdate}
            deleteParentTask={handleTaskDeletion}
          />
          </Flex>
        </Flex>

        <Flex
          justifyContent={"space-evenly"}
          gap={20}
          id="milestoneDisplay"
          display={"none"}
        >
          <Flex id="m0div">
          <KanbanColumnMilestone
            name="To Do"
            id={"m0"}
            milestones={plannedMilestoneItems}
            change={handleMilestoneDeletion}
          />
          </Flex>
          <Flex id="m1div">
          <KanbanColumnMilestone
            name="In Progress"
            id={"m1"}
            milestones={inProgressMilestoneItems}
            change={handleMilestoneDeletion}
          />
          </Flex>
          <Flex id="m2div">
          <KanbanColumnMilestone
            name="Completed"
            id={"m2"}
            milestones={completedMilestoneItems}
            change={handleMilestoneDeletion}
          />
          </Flex>
        </Flex>

        <Flex
          justifyContent={"space-evenly"}
          gap={20}
          id="QATaskDisplay"
          display={"none"}
        >
          <Flex id="qt0div">
          <KanbanColumnQATask
            name="To Do"
            id={"qt0"}
            tasks={plannedQATaskItems}
            updateParentTask={handleTaskUpdate}
            deleteParentTask={handleTaskDeletion}
          />
          </Flex>
          <Flex id="qt1div">
          <KanbanColumnQATask
            name="In Progress"
            id={"qt1"}
            tasks={inProgressQATaskItems}
            updateParentTask={handleTaskUpdate}
            deleteParentTask={handleTaskDeletion}
          />
          </Flex>
          <Flex id="qt2div">
          <KanbanColumnQATask
            name="Completed"
            id={"qt2"}
            tasks={completedQATaskItems}
            updateParentTask={handleTaskUpdate}
            deleteParentTask={handleTaskDeletion}
          />
          </Flex>
        </Flex>
      </VStack>
    </DragDropContext>
  );
}
