import { Action, action } from 'easy-peasy';
import { theme } from '../config/theme';

export type BoardMode = 'NORMAL' | 'EDITING' | 'REORDERING';

export interface BoardModel {
  mode: BoardMode;
  editedCardId: string;
  editedCardPosition: { x: number; y: number };
  creationDisabled: number;

  setBoardMode: Action<BoardModel, BoardMode>;
  enterEditMode: Action<
    BoardModel,
    { cardId: string; cardRef: HTMLDivElement }
  >;
  setEditedCardId: Action<BoardModel, string>;
  disableCreation: Action<BoardModel>;
  enableCreation: Action<BoardModel>;
}

export const board: BoardModel = {
  // State
  mode: 'NORMAL',
  editedCardId: '',
  editedCardPosition: { x: 0, y: 0 },
  creationDisabled: 0,

  // Actions
  setBoardMode: action((state, mode) => {
    state.mode = mode;
  }),
  setEditedCardId: action((state, id) => {
    state.editedCardId = id;
  }),
  enterEditMode: action((state, { cardId, cardRef }) => {
    state.editedCardId = cardId;
    state.mode = 'EDITING';
    const rect = cardRef.getBoundingClientRect();
    state.editedCardPosition = {
      x: Math.min(rect.left, window.innerWidth - theme.card.width * 1.5),
      y: Math.min(
        rect.top - 64, // TODO: this shouldnt be hardcoded
        window.innerHeight - theme.card.height * 1.5 - 64 - 20 // TODO: this shouldnt be hardcoded
      )
    };
  }),
  disableCreation: action(state => {
    state.creationDisabled++;
  }),
  enableCreation: action(state => {
    state.creationDisabled--;
  })
};
