import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text, VStack } from "@chakra-ui/react";
import { components } from "../client/api";

interface DeleteSprintModalProps {
  sprint: Sprint;
  onConfirmDeleteSprint: (sprint: Sprint) => void;
  isOpen: boolean;
  onClose: () => void;
}

type Sprint = components["schemas"]["Sprint"];

export function DeleteSprintModal({sprint, onConfirmDeleteSprint, isOpen, onClose}: DeleteSprintModalProps) { 
	return (
		<>
			<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Confirm Sprint Deletion</ModalHeader>
          <ModalBody>
            <VStack spacing={3} align="left">
              <Text>Are you sure you want to delete sprint "{sprint.name}"?</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={() => onClose()}>
                Cancel
            </Button>
            <Button colorScheme='red' mr={3} type="submit" onClick={() => {onClose(); onConfirmDeleteSprint(sprint);}}>Delete</Button>
          </ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}