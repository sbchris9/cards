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
  function handleClickOutside(event: MouseEvent) {
    if (!ref.current?.contains(event.target)) {
      handler();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};
