import { auth } from "../app.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
async function logout() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return error.code;
  }
}
export { login, signup, logout };
