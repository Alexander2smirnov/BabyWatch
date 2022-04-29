const defaultState = {
   user: {
      userId: null,
   },   
};

export default function userReducer (state = defaultState, action) {
   switch (action.type) {
      case 'changeUser':
         return {...state, user: {...state.user, userId: action.payload?.userId}};

      default: return state;
   }
};
