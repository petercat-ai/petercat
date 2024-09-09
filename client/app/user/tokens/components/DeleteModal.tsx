import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { LLMToken } from '@/app/hooks/useToken';

export interface DeleteModalProps {
  isOpen: boolean;
  isLoading: boolean;
  currentToken?: LLMToken;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ isOpen, isLoading, onConfirm, onClose, currentToken }: DeleteModalProps) {
  return (
    <Modal 
      size="md" 
      isOpen={isOpen} 
      onClose={onClose} 
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete Token</ModalHeader>
            <ModalBody>
              <p> 
                Confirm to delete token
                <pre>
                  <code>
                    {currentToken?.sanitized_token}
                  </code>
                </pre>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={onConfirm}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}