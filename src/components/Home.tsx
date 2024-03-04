import {
    VStack,
    Stack,
    Heading,
    Button,
    Text
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { SiOctopusdeploy } from "react-icons/si";

export function Home() {
    const navigate = useNavigate();

    return (
        <VStack
            mx="auto"
            w={{ base: "90%", md: 500}}
            h="100vh"
            justifyContent="center"
            spacing={10}
        >
            <Stack align='center'>
                <Stack spacing={4} direction='row' align='center'>
                    <Heading fontSize={128} >Kraken</Heading>
                    <SiOctopusdeploy size={128}/>
                </Stack>

                <Text fontSize={32}>Get Crackin'</Text>
            </Stack>
            
            <Stack spacing={4} direction='row' align='center'>
                <Button
                    colorScheme='teal'
                    size='lg'
                    onClick={() => navigate("/login")}
                >
                    Login
                </Button>

                <Button
                    colorScheme='teal'
                    size='lg'
                    onClick={() => navigate("/registration")}
                >
                    Sign up
                </Button>
            </Stack>
        </VStack>
    );
}