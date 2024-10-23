import {
  collection,
  getDocs,
  getDoc,
  doc,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db, auth } from "../app.js";

let currentUser;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  }
});

async function getArticles() {
  try {
    const collectionRef = await collection(db, "articles");
    const q = await query(collectionRef, orderBy("createdAt", "desc"));
    const querySnapShot = await getDocs(q);
    const articles = querySnapShot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return articles;
  } catch (error) {
    return error.code;
  }
}

async function getArticle(id) {
  try {
    const docRef = await doc(db, "articles", id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const article = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      return article;
    } else {
      return 404;
    }
  } catch (error) {
    return error.code;
  }
}

async function createArticle(title, content) {
  const timestamp = Timestamp.fromDate(new Date());
  const newArticle = {
    title: title,
    content: content,
    createdAt: timestamp,
    updatedAt: timestamp,
    author: currentUser.email,
  };
  try {
    const docRef = await addDoc(collection(db, "articles"), newArticle);
    return docRef.id;
  } catch (error) {
    return error.code;
  }
}

async function updateArticle(id, newTitle, newContent) {
  const newArticle = {
    title: newTitle,
    content: newContent,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  try {
    await updateDoc(doc(db, "articles", id), newArticle);
    return id;
  } catch (error) {
    return error.code;
  }
}

async function deleteArticle(id) {
  try {
    await deleteDoc(doc(db, "articles", id));
  } catch (error) {
    return error.code;
  }
}

export { getArticles, getArticle, createArticle, updateArticle, deleteArticle };
