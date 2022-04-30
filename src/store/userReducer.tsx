interface State {
   user: User | null;
}

export interface User {
   id: string;
}

interface Action {
   type: string;
   payload: null | Payload;
}

interface Payload {
   id: string;
}

const defaultState = {
   user: null,
};

export default function userReducer(state: State = defaultState, action: Action): State {
   switch (action.type) {
      case 'logIn':
         return {...state, user: {...state.user, id: (action.payload as Payload)?.id}};
         
      case 'logOut':
         return {...state, user: null};

      default: return state;
   }
};
