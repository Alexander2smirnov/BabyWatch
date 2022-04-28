import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth} from './firebaseCustom';

const provider = new GoogleAuthProvider();

export default function Welcome() {
    function onGoogleAuthClick () {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(token);
                
            }).catch((error) => {
                
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                
            });
    }


    return <div>
       
        <button
            onClick={onGoogleAuthClick}>
            Sign in with Google

        </button>
    </div>
}