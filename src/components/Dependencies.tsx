import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import { useContext, useEffect, useState } from "react";
import {
  ApiContext,
  MaybeUser,
  Milestone,
  ProjectView,
  Status,
  Task,
} from "../contexts/ApiContext";
import Cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import SidebarWithHeader from "./SideBarWithHeader";
// @ts-ignore
import nodeHtmlLabel from "cytoscape-node-html-label";
import { FaCircle } from "react-icons/fa";

Cytoscape.use(dagre);
nodeHtmlLabel(Cytoscape);

interface DependenciesProps {
  onLogout: (user: MaybeUser) => void;
}

export function Dependencies({ onLogout }: DependenciesProps) {
  const project = useContext(ApiContext).project;
  const navigate = useNavigate();

  if (!project) {
    navigate("/projectlist");
    return null;
  }

  return (
    <>
      <SidebarWithHeader
        onLogout={onLogout}
        content={<DependenciesContent project={project} />}
        headerButtons={null}
        pageTitle="Dependency Analysis"
      />
    </>
  );
}

interface DependenciesContentProps {
  project: ProjectView;
}

export const DependenciesContent = ({ project }: DependenciesContentProps) => {
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([]);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const [showQaTasks, setShowQaTasks] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "uncompleted">(
    "all"
  );
  // If QA Tasks are showing a task is only completed if both the task and the QA task are completed
  const [completeness, setCompleteness] = useState(1.0);

  useEffect(() => {
    if (!project) {
      return;
    }

    const elements: cytoscape.ElementDefinition[] = [];
    const idToMilestone: Record<string, Milestone> = {
      ...project.milestones!.reduce(
        (acc, milestone) => ({ ...acc, [milestone.id!]: milestone }),
        {}
      ),
    };
    const idToTask: Record<string, any> = {
      ...project.tasks!.reduce(
        (acc, task) => ({ ...acc, [task.id!]: task }),
        {}
      ),
    };

    const completedCache: Record<string, boolean> = {};

    const isMilestoneCompleted = (milestone: Milestone): boolean => {
      if (milestone.id! in completedCache) {
        return completedCache[milestone.id!];
      }

      const completed =
        milestone.status === "Completed" &&
        milestone.tasks!.every((taskId) => isTaskCompleted(idToTask[taskId])) &&
        milestone.dependentTasks!.every((taskId) =>
          isTaskCompleted(idToTask[taskId])
        ) &&
        milestone.dependentMilestones!.every((milestoneId) =>
          isMilestoneCompleted(idToMilestone[milestoneId])
        );

      completedCache[milestone.id!] = completed;

      return completed;
    };

    const isTaskCompleted = (task: Task): boolean => {
      if (task.id! in completedCache) {
        return completedCache[task.id!];
      }

      const dependenciesCompleted =
        task.dependentTasks!.every((taskId) =>
          isTaskCompleted(idToTask[taskId])
        ) &&
        task.dependentMilestones!.every((milestoneId) =>
          isMilestoneCompleted(idToMilestone[milestoneId])
        );

      const qaCompleted =
        showQaTasks && task.qaTask ? task.qaTask.status === "Completed" : true;

      const completed =
        task.status === "Completed" && dependenciesCompleted && qaCompleted;

      completedCache[task.id!] = completed;

      return completed;
    };

    const showTask = (task: Task) => {
      const taskCompleted = isTaskCompleted(task);

      if (
        (filter === "completed" && !taskCompleted) ||
        (filter === "uncompleted" && taskCompleted)
      ) {
        return false;
      }

      return true;
    };

    const showMilestone = (milestone: Milestone) => {
      const milestoneCompleted = isMilestoneCompleted(milestone);

      if (
        (filter === "completed" && !milestoneCompleted) ||
        (filter === "uncompleted" && milestoneCompleted)
      ) {
        return false;
      }

      return true;
    };

    let tasks = 0;
    let completedTasks = 0;

    for (const task of project.tasks!) {
      if (!showTask(task)) {
        continue;
      }

      tasks++;

      if (isTaskCompleted(task)) {
        completedTasks++;
      }

      // Add task node
      elements.push({
        data: {
          id: task.id!,
          label: task.name,
          type: "task",
          status: task.status,
        },
      });

      if (showQaTasks) {
        elements.push({
          data: {
            id: task.id + "_qa",
            label: "[QA] " + task.qaTask.name,
            type: "qaTask",
            status: task.qaTask.status,
          },
        });

        elements.push({
          data: {
            source: task.id,
            target: task.id + "_qa",
            type: "qaTask",
          },
        });
      }

      // Add tasks and milestones this task depends on
      for (const dep of [
        ...task.dependentTasks!,
        ...task.dependentMilestones!,
      ]) {
        if (dep in idToMilestone && !showMilestone(idToMilestone[dep])) {
          continue;
        }

        if (dep in idToTask && !showTask(idToTask[dep])) {
          continue;
        }

        elements.push({
          data: {
            source: dep,
            target: task.id,
            type: "dependency",
          },
        });
      }

      // Add the milestone dependency
      if (
        task.milestoneId in idToMilestone &&
        showMilestone(idToMilestone[task.milestoneId])
      ) {
        elements.push({
          data: {
            source: task.milestoneId,
            target: task.id,
            type: "milestone",
          },
        });
      }
    }

    for (const milestone of project.milestones!) {
      if (!showMilestone(milestone)) {
        continue;
      }

      // Add milestone node
      elements.push({
        data: {
          id: milestone.id!,
          label: milestone.name,
          type: "milestone",
          status: milestone.status,
        },
      });

      // Add tasks and milestones this milestone depends on
      for (const dep of [
        ...milestone.dependentTasks!,
        ...milestone.dependentMilestones!,
      ]) {
        if (dep in idToMilestone && !showMilestone(idToMilestone[dep])) {
          continue;
        }

        if (dep in idToTask && !showTask(idToTask[dep])) {
          continue;
        }

        elements.push({
          data: {
            source: dep,
            target: milestone.id,
            type: "dependency",
          },
        });
      }
    }

    setElements(elements);

    setCompleteness(completedTasks / tasks);
  }, [project, showQaTasks, filter]);

  useEffect(() => {
    if (cy) {
      cy.layout({ name: "dagre", spacingFactor: 2 } as any).run();

      cy.autounselectify(true);

      // @ts-ignore
      const createNodeWithBackgroundColor = (
        backgroundColor: string,
        data: any
      ) => {
        // This is a hack but it works lol
        const MAX_CHARACTERS = 80;
        if (data.label.length > MAX_CHARACTERS) {
          data.label = data.label.slice(0, MAX_CHARACTERS) + "...";
        }

        let status: Status = data.status;
        switch (status) {
          case "Todo":
            status += " ⏳";
            break;
          case "In Progress":
            status += " 🚧";
            break;
          case "Completed":
            status += " ✅";
            break;
        }

        return `
        <table style="background-color: ${backgroundColor}; border-collapse: collapse; width: 220px; height: 100px;">
        <tbody>
          <tr style="text-align: center; height: 80px;">
            <td style="padding: 5px; border-bottom: 1px solid #E2E8F0;">
              ${data.label}
            </td>
          </tr>
          <tr style="text-align: center; height: 40px;">
            <td style="padding: 5px;">
              ${status}
            </td>
          </tr>
        </tbody>
      </table>
        `;
      };

      // @ts-ignore
      cy.nodeHtmlLabel([
        {
          query: "node",
          tpl: (data: any) => createNodeWithBackgroundColor("white", data),
        },
      ] as any);
    }
  }, [cy, elements]);

  if (!project) {
    return <Alert status="error">No project found</Alert>;
  }

  return (
    <Container maxW="container.xl">
      <HStack align={"center"} justify={"space-between"} mb={2}>
        <Box mb={2}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="qa-toggle" mb="0">
              Toggle QA Tasks
            </FormLabel>
            <Switch
              id="qa-toggle"
              colorScheme="teal"
              onChange={() => setShowQaTasks(!showQaTasks)}
              isChecked={showQaTasks}
            />
          </FormControl>
        </Box>
        <Badge colorScheme="teal">
          {showQaTasks ? "QA Completeness " : "Alpha Completeness "}
          {completeness * 100}%
        </Badge>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} maxH="35px">
            Filter
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              title="Filter"
              type="radio"
              value={filter}
              onChange={(value) => setFilter(value as any)}
            >
              <MenuItemOption value="all">All</MenuItemOption>
              <MenuItemOption value="completed">Completed</MenuItemOption>
              <MenuItemOption value="uncompleted">Not Completed</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </HStack>
      <Box px={4} borderWidth="4px" borderRadius="sm">
        <CytoscapeComponent
          elements={elements}
          style={{ width: "100%", height: "70vh" }}
          stylesheet={[
            {
              selector: "edge",
              style: {
                "curve-style": "bezier",
                "target-arrow-shape": "triangle",
                "target-arrow-color": "#E2E8F0",
                width: 7,
                "line-color": "#E2E8F0",
              },
            },
            {
              selector: "node",
              style: {
                shape: "round-rectangle",
                width: "240px",
                height: "120px",
              },
            },
            {
              selector: "node[type = 'milestone']",
              style: {
                backgroundColor: "#EDAE0F",
              },
            },
            {
              selector: "node[type = 'task']",
              style: {
                backgroundColor: "#2C7A7B",
              },
            },
            {
              selector: "node[type = 'qaTask']",
              style: {
                backgroundColor: "#B6D6CC",
              },
            },
            {
              selector: "edge[type = 'dependency']",
              style: {
                "line-style": "dashed",
              },
            },
          ]}
          cy={setCy}
        />
      </Box>
      <Box>
        <Text fontSize="sd">Legend: </Text>
        <List>
          <ListItem>
            <ListIcon as={FaCircle} color="#EDAE0F" />
            Milestone
          </ListItem>
          <ListItem>
            <ListIcon as={FaCircle} color="#2C7A7B" />
            Task
          </ListItem>
          <ListItem>
            <ListIcon as={FaCircle} color="#B6D6CC" />
            QA Task
          </ListItem>
        </List>
      </Box>
    </Container>
  );
};
