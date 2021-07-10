import { useReducer } from 'react';

export default function useReducerWithThunk(reducer, initialState) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const getState = () => state;

    let customDispatch = (action) => {
        if (typeof action === 'function') {
            action(customDispatch, getState);
        } else {
            dispatch(action);
        }
    };
    
    return [state, customDispatch];
}