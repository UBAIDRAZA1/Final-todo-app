import { useState, useCallback } from 'react';

interface UndoAction<T> {
  type: 'create' | 'update' | 'delete';
  item: T;
  previousState?: T;
}

export function useUndo<T>() {
  const [pastActions, setPastActions] = useState<UndoAction<T>[]>([]);
  const [futureActions, setFutureActions] = useState<UndoAction<T>[]>([]);

  const addAction = useCallback((action: UndoAction<T>) => {
    setPastActions(prev => [...prev, action]);
    setFutureActions([]); // Clear future actions when a new action is performed
  }, []);

  const undo = useCallback(() => {
    if (pastActions.length === 0) return;

    const lastAction = pastActions[pastActions.length - 1];
    setPastActions(prev => prev.slice(0, -1));
    setFutureActions(prev => [...prev, lastAction]);

    return lastAction;
  }, [pastActions]);

  const redo = useCallback(() => {
    if (futureActions.length === 0) return;

    const lastUndoneAction = futureActions[futureActions.length - 1];
    setFutureActions(prev => prev.slice(0, -1));
    setPastActions(prev => [...prev, lastUndoneAction]);

    return lastUndoneAction;
  }, [futureActions]);

  const clear = useCallback(() => {
    setPastActions([]);
    setFutureActions([]);
  }, []);

  return {
    addAction,
    undo,
    redo,
    clear,
    canUndo: pastActions.length > 0,
    canRedo: futureActions.length > 0,
    pastActions,
    futureActions
  };
}