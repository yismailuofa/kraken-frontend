/**
 * FR 1, FR 2
 * Home screen that provides interface for login and sign up 
 */

import { VStack, Stack, Heading, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SiOctopusdeploy } from "react-icons/si";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

export function Home() {
  const navigate = useNavigate();
  const { user } = useContext(ApiContext);

  if (user) {
    navigate("/projectlist");
  }

  return (
    <VStack
      mx="auto"
      w={{ base: "90%", md: 500 }}
      h="100vh"
      justifyContent="center"
      spacing={10}
    >
      <Stack w="100vw" align="center">
        <Heading fontSize={128}>Kraken 🐙</Heading>
        <Text fontSize={32}>Get Crackin'</Text>
      </Stack>

      <Stack spacing={4} direction="row" align="center">
        <Button colorScheme="teal" size="lg" onClick={() => navigate("/login")}>
          Login
        </Button>

        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => navigate("/registration")}
        >
          Sign up
        </Button>
      </Stack>
    </VStack>
  );
}
