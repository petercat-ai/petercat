'use client';
import { LLMToken, useTokenList } from '@/app/hooks/useToken';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/table";
import {
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { DeleteIcon } from '@/public/icons/DeleteIcon';
import { deleteToken } from '@/app/services/TokensController';
import { useMutation } from '@tanstack/react-query';
import DeleteModal from './components/DeleteModal';
import CreateButton from './components/CreateButton';

export default function List() {
  const { data = [], refetch } = useTokenList();

  const { isOpen: deleteIsOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [currentToken, setCurrentToken] = useState<LLMToken>();

  const deleteMutation = useMutation({
    mutationFn: deleteToken,
    onSuccess() {
      onDeleteClose();
      refetch();
    }
  });

  
  const onConfirmDelete = useCallback((token: LLMToken) => {
    setCurrentToken(token);
    onDeleteOpen()
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <CreateButton />
        </div>
      </div>
    );
  }, []);
  return (
    <div className="justify-items-center px-[40px]">
      <Table
        aria-label="User tokens"
        topContent={topContent}
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>SLUG</TableColumn>
          <TableColumn>LLM</TableColumn>
          <TableColumn>Token( Sanitized )</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map(line => (
            <TableRow key="1">
              <TableCell><pre><code>{line.id}</code></pre></TableCell>
              <TableCell>{line.slug}</TableCell>
              <TableCell>{line.llm}</TableCell>
              <TableCell><pre><code>{line.sanitized_token}</code></pre></TableCell>
              <TableCell>
                <Button isIconOnly color="danger" onClick={() => onConfirmDelete(line)}>
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteModal
        onClose={onDeleteClose}
        isOpen={deleteIsOpen}
        onConfirm={() => deleteMutation.mutate(currentToken!.id)}
        isLoading={deleteMutation.isPending}
        currentToken={currentToken}
      />
    </div>
  );
}