import {
  Alert,
  Box,
  Container,
  FormControl,
  FormLabel,
  List,
  ListIcon,
  ListItem,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import { useContext, useEffect, useState } from "react";
import {
  ApiContext,
  MaybeUser,
  ProjectView,
  Status,
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

  useEffect(() => {
    if (!project) {
      return;
    }

    const elements: cytoscape.ElementDefinition[] = [];

    for (const task of project.tasks!) {
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
        elements.push({
          data: {
            source: dep,
            target: task.id,
            type: "dependency",
          },
        });
      }

      // Add the milestone dependency
      elements.push({
        data: {
          source: task.milestoneId,
          target: task.id,
          type: "milestone",
        },
      });
    }

    for (const milestone of project.milestones!) {
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
  }, [project, showQaTasks]);

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
