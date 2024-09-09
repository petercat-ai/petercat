import { LLMTokenInsert, useCreateToken } from '@/app/hooks/useToken';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useEffect } from 'react';

export interface CreateModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onCreate: (data: LLMTokenInsert) => void;
  onClose: () => void;
  onOpen: () => void;
}


export default function CreateModal({ isOpen, onClose, isLoading, onCreate }: CreateModalProps) {
  const [llmToken, setLLMToken] = useCreateToken();
  console.log('CreateModal', { llmToken });
  useEffect(() => setLLMToken({}), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof LLMTokenInsert
    const value = e.target.value;
    setLLMToken((draft: LLMTokenInsert) => {
      // @ts-ignore
      draft[name] = value;
    });
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Create Token</ModalHeader>
            <ModalBody>
              <form>
                <div className="flex-1">
  
                  <div className="mb-[42px]">
                    <Input
                      name="slug"
                      label="密钥标识*"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="给 Token 取一个独一无二的标识"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mt-[42px]">
                    <Select
                      name="llm"
                      label="Select a llm"
                      required
                      onChange={handleChange}
                    >
                      <SelectItem key="openai">openai</SelectItem>
                      <SelectItem key="gemini">gemini</SelectItem>
                    </Select>
                  </div>
                  <div className="mt-[42px]">
                    <Input
                      name="token"
                      type="password"
                      label="密钥*"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="密钥"
                      required
                      onChange={handleChange}
                    />
                     <blockquote className="border px-4 py-3 rounded-xl [&amp;>p]:m-0 border-warning-100 bg-warning-50/20 my-2">
                      <p>Tokens are never stored in plaintext; RSA encryption is used. </p>
                      <p>Tokens are only used with your explicit permission.</p>
                    </blockquote>
                    </div>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                isLoading={isLoading}
                color="primary"
                onPress={() => onCreate(llmToken)}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
