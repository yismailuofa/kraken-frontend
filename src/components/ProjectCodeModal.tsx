/**
 * FR 8
 * Modal for displaying access code for project
 */

import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text, Flex, Input, useClipboard, VStack } from "@chakra-ui/react";

export function ProjectCodeModal({projectCode, onCloseModal, isOpen, onClose}: any) {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  
	return (
		<>
			<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Project Code</ModalHeader>
          <ModalBody>
            <VStack spacing={3} align="left">
              <Text>Your Project Code is:</Text>
              <Flex>
                <Input
                  isReadOnly={true}
                  value={projectCode}
                  mr={3}
                />
                <Button onClick={() => {onCopy(); setValue(projectCode);}}>{hasCopied ? "Copied!" : "Copy"}</Button>
              </Flex>
              <Text>Share this code to allow others to join the project</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
              <Button colorScheme='teal' onClick={() => {onClose(); onCloseModal();}}>
                  Close
              </Button>
          </ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
