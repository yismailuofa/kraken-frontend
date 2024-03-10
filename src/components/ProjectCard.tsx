import { Heading, Text, Card, CardBody, CardHeader } from "@chakra-ui/react";

export function ProjectCard({ name, description, onClick }: any) {
  return (
    <Card maxWidth={350} onClick={onClick} cursor={"pointer"}>
      <CardHeader>
        <Heading size="md">{name}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{description}</Text>
      </CardBody>
    </Card>
  );
}
