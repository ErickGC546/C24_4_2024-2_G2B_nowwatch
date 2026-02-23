import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const itemsCollection = (uid) => collection(db, 'favorites', uid, 'items');

export const fetchFavorites = async (uid) => {
  const snapshot = await getDocs(itemsCollection(uid));
  return snapshot.docs.map((favorite) => ({ id: favorite.id, ...favorite.data() }));
};

export const addFavorite = async (uid, url) => {
  const duplicateQuery = query(itemsCollection(uid), where('url', '==', url));
  const existing = await getDocs(duplicateQuery);
  if (!existing.empty) {
    return { alreadyExists: true, id: existing.docs[0].id };
  }

  const docRef = await addDoc(itemsCollection(uid), {
    url,
    createdAt: Date.now(),
  });

  return { id: docRef.id };
};

export const removeFavorite = async (uid, favoriteId) => {
  const favoriteRef = doc(db, 'favorites', uid, 'items', favoriteId);
  await deleteDoc(favoriteRef);
};
