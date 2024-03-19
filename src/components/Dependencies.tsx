import { ArrowBackIcon } from "@chakra-ui/icons";
import { Alert, Box, Button, Container } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import { useContext, useEffect, useState } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import Cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import SidebarWithHeader from "./SideBarWithHeader";

Cytoscape.use(dagre);

interface DependenciesProps {
  onLogout: (user: MaybeUser) => void;
}

export function Dependencies({onLogout}: DependenciesProps) {
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
        content={<DependenciesContent />}
        headerButtons={null}
        pageTitle="Dependency Analysis"
    />
    </>
  );
}

export const DependenciesContent = () => {
  const navigate = useNavigate();
  const { project } = useContext(ApiContext);
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([]);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!project) {
      return;
    }

    const elements: cytoscape.ElementDefinition[] = [];

    for (const task of project.tasks!) {
      elements.push({
        data: {
          id: task.id!,
          label: `${task.name}\n(${task.status})`,
          type: "task",
        },
      });

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

      elements.push({
        data: {
          source: task.milestoneId,
          target: task.id,
          type: "milestone",
        },
      });
    }

    for (const milestone of project.milestones!) {
      elements.push({
        data: {
          id: milestone.id!,
          label: `${milestone.name}\n(${milestone.status})`,
          type: "milestone",
        },
      });

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
  }, [project]);

  useEffect(() => {
    if (cy) {
      cy.layout({ name: "dagre", spacingFactor: 2 } as any).run();
    }
  }, [cy, elements]);

  if (!project) {
    return <Alert status="error">No project found</Alert>;
  }

  return (
    <Container maxW="container.lg">
      <Box p={4}>
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => {
            navigate(-1);
          }}
        >
          Go Back
        </Button>
      </Box>
      <Box p={4} bg="gray.50" borderWidth="1px" borderRadius="sm">
        <CytoscapeComponent
          elements={elements}
          style={{ width: "100%", height: "70vh" }}
          stylesheet={[
            {
              selector: "edge",
              style: {
                "curve-style": "bezier",
                "target-arrow-shape": "triangle",
                width: 10,
              },
            },
            {
              selector: "node",
              style: {
                label: "data(label)",
                "text-wrap": "wrap",
                "text-valign": "center",
                shape: "roundrectangle",
                "border-width": 1,
                padding: 40,
              } as any,
            },
            {
              selector: "node[type = 'task']",
              style: {
                "background-color": "#9dbaea",
              },
            },
            {
              selector: "node[type = 'milestone']",
              style: {
                "background-color": "#f0a6ca",
              },
            },
            {
              selector: "node[type = 'dependency']",
              style: {
                "background-color": "#f0a6ca",
              },
            },
            {
              selector: "edge[type = 'dependency']",
              style: {
                "line-style": "dashed",
              },
            },
            {
              selector: "edge[type = 'milestone']",
              style: {},
            },
          ]}
          cy={setCy}
        />
      </Box>
    </Container>
  );
};
