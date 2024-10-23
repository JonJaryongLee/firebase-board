import { auth } from "../app.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    return error.code;
  }
}
async function signup(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    return error.code;
  }
}
async function googleSignup() {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    return {
      credential: credential,
      token: token,
      user: user,
    }
  } catch (error) {
    return error.code;
  }
}
async function logout() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return error.code;
  }
}
export { login, signup, googleSignup, logout };
