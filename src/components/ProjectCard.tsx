import { Heading, Text, Card, CardBody, CardHeader } from "@chakra-ui/react";

export function ProjectCard({ name, description }: any) {
  return (
    <Card maxWidth={350}>
      <CardHeader>
        <Heading size="md">{name}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{description}</Text>
      </CardBody>
    </Card>
  );
}
