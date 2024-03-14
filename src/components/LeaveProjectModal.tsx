import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text, VStack } from "@chakra-ui/react";

export function LeaveProjectModal({onConfirmLeave, isOpen, onClose}: any) { 
	return (
		<>
			<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Confirm Leave Project</ModalHeader>
          <ModalBody>
            <VStack spacing={3} align="left">
              <Text>Are you sure you want to leave the project?</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
              <Button colorScheme='teal' mr={3} onClick={() => onClose()}>
                  Cancel
              </Button>
              <Button colorScheme='red' mr={3} type="submit" onClick={() => {onClose(); onConfirmLeave();}}>Leave</Button>
          </ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}