import { useMutation } from '@tanstack/react-query';
import { updateKnowledge } from '../services/BotsController';

export function useKnowledgeUpdate() {
  return useMutation({
    mutationKey: ['updateKnowledge'],
    mutationFn: updateKnowledge
  });
}
