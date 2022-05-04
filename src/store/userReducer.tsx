import { DocumentReference } from "firebase/firestore";

interface State {
   user: User | null;
   families: DocumentReference[];
}

export interface User {
   id: string;
}

interface Action {
   type: string;
   payload: null | LoginPayload | FamiliesPayload;
}

interface LoginPayload {
   id: string;
}

type FamiliesPayload = DocumentReference[];

const defaultState = {
   user: null,
   families: [],
};

export default function userReducer(state: State = defaultState, action: Action): State {
   switch (action.type) {
      case 'logIn':
         return {...state, user: {...state.user, id: (action.payload as LoginPayload).id}};
         
      case 'logOut':
         return {...state, user: null};

      case 'setFamilies':
         return {...state, families: action.payload as FamiliesPayload}

      default: return state;
   }
};
