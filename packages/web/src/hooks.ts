import { createTypedHooks } from 'easy-peasy';
import { StoreModel } from './model/model';
import { useEffect } from 'react';

const typedHooks = createTypedHooks<StoreModel>();

// We export the hooks from our store as they will contain the
// type information on them
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export const useHandleClickOutside = (
  ref: React.MutableRefObject<any>,
  handler: () => void
) => {
  /**
   * Alert if clicked on outside of element
   */
  function handleClickOutside(event: MouseEvent) {
    if (!ref.current?.contains(event.target)) {
      handler();
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};
