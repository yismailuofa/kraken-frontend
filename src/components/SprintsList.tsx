import { Box, Button, Accordion, AccordionPanel, AccordionItem, AccordionButton, AccordionIcon, Text, HStack } from "@chakra-ui/react";
import { useContext } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";
import { SideNavBar } from "./SideNavBar";
import { SprintsTopBar } from "./SprintsTopBar";


interface SprintsListProps {
  onLogout: (user: MaybeUser) => void;
}

export function SprintsList({onLogout}: SprintsListProps) {
  const client = useContext(ApiContext).client;
  const navigate = useNavigate();


  return (
    <Box>
        <SprintsTopBar onLogout={onLogout}/>
        <HStack>
        <SideNavBar />
        <Box h="100vh" w="80vw" mt={10} alignContent={"top"}>
          <Accordion defaultIndex={[0]} allowMultiple={true}>
            <AccordionItem>
                <h2>
                <AccordionButton>
                    <Box as="span" flex='1' textAlign='left'>
                    Sprint 1
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
                </Text>
                
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
              <AccordionButton>
                  <Box as="span" flex='1' textAlign='left'>
                  Sprint 2
                  </Box>
                  <AccordionIcon />
              </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
        </HStack>
    </Box>
  );
}