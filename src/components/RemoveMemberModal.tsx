import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Text, VStack } from "@chakra-ui/react";
import { components } from "../client/api";

interface RemoveMemberModalProps {
  onConfirmRemoveMember: (member: UserView) => void;
  member: UserView;
  isOpen: boolean;
  onClose: () => void;
}

type UserView = components["schemas"]["UserView"];

export function RemoveMemberModal({onConfirmRemoveMember, member, isOpen, onClose}: RemoveMemberModalProps) { 
	return (
		<>
			<Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Confirm Remove Member</ModalHeader>
          <ModalBody>
            <VStack spacing={3} align="left">
              <Text>Are you sure you want to delete {member?.username ? member.username : ""} from the project?</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
              <Button colorScheme='teal' mr={3} onClick={() => onClose()}>
                  Cancel
              </Button>
              <Button colorScheme='red' mr={3} type="submit" onClick={() => {onClose(); onConfirmRemoveMember(member);}}>Remove</Button>
          </ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}