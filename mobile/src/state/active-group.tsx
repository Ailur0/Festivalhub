import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { GroupSummary } from '@/data/types';
import { loadJSON, saveJSON } from '@/lib/storage';
import { useMyGroups } from '@/state/queries';

const STORAGE_KEY = 'festivalhub.active-group';

type ActiveGroupValue = {
  activeGroupId: string | null;
  activeGroup: GroupSummary | null;
  groups: GroupSummary[];
  isLoading: boolean;
  error: Error | null;
  setActiveGroupId: (groupId: string) => void;
  refetch: () => void;
};

const ActiveGroupContext = createContext<ActiveGroupValue | null>(null);

/** Remembers which group the Group and Finances tabs are showing. */
export function ActiveGroupProvider({ children }: { children: ReactNode }) {
  const { data: groups, isPending, error, refetch } = useMyGroups();
  const [storedId, setStoredId] = useState<string | null>(() => loadJSON<string>(STORAGE_KEY));

  // Fall back to the first group if the stored one is gone (left, deleted, or another account)
  const activeGroup = useMemo(() => {
    if (!groups?.length) return null;
    return groups.find((group) => group.id === storedId) ?? groups[0];
  }, [groups, storedId]);

  useEffect(() => {
    if (activeGroup && activeGroup.id !== storedId) {
      saveJSON(STORAGE_KEY, activeGroup.id);
      setStoredId(activeGroup.id);
    }
  }, [activeGroup, storedId]);

  const setActiveGroupId = useCallback((groupId: string) => {
    setStoredId(groupId);
    saveJSON(STORAGE_KEY, groupId);
  }, []);

  const value = useMemo<ActiveGroupValue>(
    () => ({
      activeGroupId: activeGroup?.id ?? null,
      activeGroup,
      groups: groups ?? [],
      isLoading: isPending,
      error: error as Error | null,
      setActiveGroupId,
      refetch,
    }),
    [activeGroup, groups, isPending, error, setActiveGroupId, refetch],
  );

  return <ActiveGroupContext value={value}>{children}</ActiveGroupContext>;
}

export function useActiveGroup() {
  const value = use(ActiveGroupContext);
  if (!value) throw new Error('useActiveGroup must be used inside ActiveGroupProvider');
  return value;
}
