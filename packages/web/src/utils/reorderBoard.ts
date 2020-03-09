import { DraggableLocation } from 'react-beautiful-dnd';
import { MutationFunctionOptions, ExecutionResult } from '@apollo/react-common';
import {
  DELETE_CARD,
  CREATE_CARD,
  ROW,
  DELETE_ROW,
  CREATE_ROW,
  CARD
} from '../config/constants';
import { Board } from '../containers/Board';
import {
  CreateRowMutation,
  CreateRowMutationVariables,
  RemoveRowMutation,
  RemoveRowMutationVariables,
  UpdateRowMutation,
  UpdateRowMutationVariables,
  CreateCardMutationVariables,
  CreateCardMutation,
  RemoveCardMutationVariables,
  RemoveCardMutation,
  UpdateCardMutation,
  UpdateCardMutationVariables
} from '../generated/graphql';
import store from '../store';

const clientIdPrefix = 'CLIENT__';
function generateClientId() {
  return `${clientIdPrefix}${Math.floor(Math.random() * 100000)}`;
}
function isClientId(id: string) {
  return id.startsWith(clientIdPrefix);
}

// FIXME Memory leak: Should clean up keys after store updated
type WaitingForId = {
  [key: string]: Promise<string | undefined>;
};
const waitingForId: WaitingForId = {};

type Mutation<TData, TVariables> = (
  options?: MutationFunctionOptions<TData, TVariables>
) => Promise<ExecutionResult<TData>>;

interface BoardMutations {
  createRow: Mutation<CreateRowMutation, CreateRowMutationVariables>;
  removeRow: Mutation<RemoveRowMutation, RemoveRowMutationVariables>;
  updateRow: Mutation<UpdateRowMutation, UpdateRowMutationVariables>;
  createCard: Mutation<CreateCardMutation, CreateCardMutationVariables>;
  removeCard: Mutation<RemoveCardMutation, RemoveCardMutationVariables>;
  updateCard: Mutation<UpdateCardMutation, UpdateCardMutationVariables>;
}

interface ReorderArgs {
  board: Board;
  draggableId: string;
  source: DraggableLocation;
  destination: DraggableLocation;
  type: string;
  mutations: BoardMutations;
}

export const reorderBoard = ({
  board,
  draggableId,
  source,
  destination,
  type,
  mutations: {
    createRow,
    removeRow,
    updateRow,
    createCard,
    removeCard,
    updateCard
  }
}: ReorderArgs) => {
  //
  // ─── ROW ────────────────────────────────────────────────────────────────────────
  //
  if (type === ROW) {
    if (source.droppableId === CREATE_ROW) {
      if (destination.droppableId === DELETE_ROW) return;
      if (destination.droppableId === CREATE_ROW) return;
      const enable = store.getActions().board.enableCreation;
      const clientId = generateClientId();
      waitingForId[clientId] = createRow({
        variables: { boardID: board.id, position: destination.index },
        optimisticResponse: {
          __typename: 'Mutation',
          createRow: {
            __typename: 'Row',
            id: clientId,
            position: destination.index
          }
        }
      }).then(res => {
        enable();
        return res.data?.createRow.id;
      });
    } else if (destination.droppableId === DELETE_ROW) {
      const rm = (id: string) =>
        removeRow({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            removeRow: {
              __typename: 'Row',
              id: draggableId
            }
          }
        });
      if (isClientId(draggableId)) {
        //TODO more optimism
        waitingForId[draggableId].then(id => rm(id!));
      } else {
        rm(draggableId);
      }
    } else {
      updateRow({
        variables: { id: draggableId, position: destination.index },
        optimisticResponse: {
          __typename: 'Mutation',
          updateRow: {
            __typename: 'Row',
            id: draggableId,
            position: destination.index
          }
        }
      });
    }
  }
  //
  // ─── CARD ───────────────────────────────────────────────────────────────────────
  //
  else if (type === CARD) {
    if (source.droppableId === CREATE_CARD) {
      if (destination.droppableId === DELETE_CARD) return;
      if (destination.droppableId === CREATE_CARD) return;
      const clientId = generateClientId();
      const mut = (rowId: string) => {
        waitingForId[clientId] = createCard({
          variables: {
            rowId: rowId,
            cardData: { position: destination.index }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createCard: {
              __typename: 'Card',
              row: { id: rowId },
              id: clientId,
              position: destination.index
            }
          }
        }).then(res => res.data?.createCard.id);
      };
      if (isClientId(destination.droppableId)) {
        waitingForId[destination.droppableId].then(id => mut(id!));
      } else {
        mut(destination.droppableId); // TODO more optimism
      }
    } else if (destination.droppableId === DELETE_CARD) {
      // FIXME Should consider pending row ids
      const mut = (id: string) =>
        removeCard({
          variables: { id },
          optimisticResponse: {
            __typename: 'Mutation',
            removeCard: {
              __typename: 'Card',
              id,
              row: { __typename: 'Row', id: source.droppableId }
            }
          }
        });
      if (isClientId(draggableId) || isClientId(destination.droppableId)) {
        //TODO more optimism
        waitingForId[draggableId].then(id => mut(id!));
      } else {
        mut(draggableId);
      }
    } else {
      // FIXME Should consider pending row ids
      const mut = (id: string, rowId: string) =>
        updateCard({
          variables: {
            id,
            cardData: {
              position: destination.index,
              rowId: rowId
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateCard: {
              __typename: 'Card',
              id: draggableId,
              position: destination.index,
              row: { __typename: 'Row', id: rowId }
            }
          }
        });

      //TODO more optimism
      const pendingIds: [
        Promise<string | undefined>,
        Promise<string | undefined>
      ] = [
        Promise.resolve(draggableId),
        Promise.resolve(destination.droppableId)
      ];
      if (isClientId(draggableId)) {
        pendingIds[0] = waitingForId[draggableId];
      }
      if (isClientId(destination.droppableId)) {
        pendingIds[1] = waitingForId[destination.droppableId];
      }
      Promise.all(Object.values(pendingIds)).then(([id, rowId]) => {
        mut(id!, rowId!);
      });
    }
  }
};
