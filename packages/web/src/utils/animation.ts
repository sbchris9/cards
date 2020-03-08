import {
  DraggingStyle,
  NotDraggingStyle,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { DELETE_ROW, DELETE_CARD } from '../config/constants';

export function getDraggableAnimationStyle(
  style: DraggingStyle | NotDraggingStyle | undefined,
  snapshot: DraggableStateSnapshot
) {
  if (
    !snapshot.isDropAnimating ||
    (snapshot.draggingOver !== DELETE_ROW &&
      snapshot.draggingOver !== DELETE_CARD)
  ) {
    return style;
  }

  return {
    ...style,
    transitionDuration: `0.001s`
  };
}
