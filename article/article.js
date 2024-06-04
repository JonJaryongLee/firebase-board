import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db, auth } from "../app.js";

let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
  }
});

async function getArticles() {
  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    let articles = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    articles.sort(
      (a, b) =>
        new Date(a.createdAt.seconds * 1000) -
        new Date(b.createdAt.seconds * 1000)
    );
    return articles;
  } catch (error) {
    return error.code;
  }
}

async function getArticle(id) {
  try {
    const docSnapshot = await getDoc(doc(db, "articles", id));
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

async function updateArticle(originArticle, newTitle, newContent) {
  const newArticle = {
    title: newTitle,
    content: newContent,
    createdAt: originArticle.createdAt,
    updatedAt: Timestamp.fromDate(new Date()),
    author: currentUser.email,
  };
  try {
    await updateDoc(doc(db, "articles", originArticle.id), newArticle);
    return originArticle.id;
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
