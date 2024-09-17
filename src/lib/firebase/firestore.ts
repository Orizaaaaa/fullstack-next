// services/firestore.ts
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";


const collectionName = "items";

// Create
export const createItem = async (item: any): Promise<string> => {
    const docRef = await addDoc(collection(db, collectionName), item);
    return docRef.id;
};

// Read
export const getItems = async (): Promise<(any & { id: string })[]> => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: (any & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as any & { id: string });
    });
    return items;
};

// Update
export const updateItem = async (id: string, updatedItem: Partial<any>): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updatedItem);
};

// Delete
export const deleteItem = async (id: string): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};
