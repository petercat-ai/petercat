import { Button, ButtonProps, useDisclosure } from '@nextui-org/react';
import CreateModal from './CreateModal';
import { useTokenList } from '@/app/hooks/useToken';
import { useMutation } from '@tanstack/react-query';
import { createToken } from '@/app/services/TokensController';

export default function CreateButton(props: ButtonProps) {
  const { refetch } = useTokenList();
  const { isOpen: createIsOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  
  const createMutation = useMutation({
    mutationFn: createToken,
    onSuccess() {
      onCreateClose();
      refetch();
    }
  });

  return (
    <>
      <Button {...props} onClick={() => onCreateOpen()}>创建 Token</Button>
      <CreateModal
        isOpen={createIsOpen}
        onClose={onCreateClose}
        onOpen={onCreateOpen}
        onCreate={data => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />
    </>
  )
}
