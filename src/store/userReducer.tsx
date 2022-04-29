interface State {
   user: User;
}

interface User {
   userId: string;
}

interface Action {
   type: string;
   payload: null | Payload;
}

interface Payload {
   userId: string;
}

const defaultState = {
   user: {
      userId: null,
   },   
};

export default function userReducer (state: State = defaultState, action: Action) {
   switch (action.type) {
      case 'changeUser':
         return {...state, user: {...state.user, userId: action.payload?.userId}};

      default: return state;
   }
};
