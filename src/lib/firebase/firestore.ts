// services/firestore.ts
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc } from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";


const collectionName = "items";


// ------------------- Mahasiswa -------------------

// Create mahasiswa
export const createItem = async (item: any): Promise<string> => {
    // Cek apakah NIM sudah ada di database
    const q = query(collection(db, collectionName), where("nim", "==", item.nim));
    const querySnapshot = await getDocs(q);

    // Jika NIM sudah ada, lempar error
    if (!querySnapshot.empty) {
        console.error("NIM sudah ada, tidak dapat menambahkan data."); // Logging error
        throw new Error("NIM sudah ada, tidak dapat menambahkan data.");
    }

    // Jika NIM belum ada, tambahkan data
    const docRef = await addDoc(collection(db, collectionName), item);
    return docRef.id;
};


// Read mahasiswa
export const getItems = async (): Promise<(any & { id: string })[]> => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: (any & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as any & { id: string });
    });
    return items;
};


// Read Detail mahasiswa (Lihat per item berdasarkan ID)
export const getItemDetail = async (id: string): Promise<any> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Item tidak ditemukan");
    }
};


// Update mahasiswa
export const updateItem = async (id: string, updatedItem: Partial<any>): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, updatedItem);
};


// Delete mahasiswa
export const deleteItem = async (id: string): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};



// ------------------- Article -------------------

//create article    
export const createArticle = async (item: any): Promise<any> => {
    const docRef = await addDoc(collection(db, "articles"), item);
    return docRef.id;
};


// Read articles dengan id dan title
export const getArticles = async (): Promise<(any & { id: string, title: string })[]> => {
    const querySnapshot = await getDocs(collection(db, "articles"));
    const items: (any & { id: string, title: string })[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({ id: doc.id, title: data.title } as any & { id: string, title: string });
    });
    return items;
};


//read articles by id
export const getDetailArticle = async (id: string): Promise<any> => {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Item tidak ditemukan");
    }
};


// edit article
export const updateArticle = async (id: string, updatedItem: Partial<any>): Promise<void> => {
    const docRef = doc(db, "articles", id);
    await updateDoc(docRef, updatedItem);
};

export const deleteArticle = async (id: string): Promise<void> => {
    const docRef = doc(db, "articles", id);
    await deleteDoc(docRef);
};



// ------------------- Image -------------------

//export image ke storage firebase
export const uploadImage = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        // Buat referensi ke lokasi di Firebase Storage
        const storageRef = ref(storage, `images/${file.name}`);

        // Upload file ke Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Monitor status upload
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress upload dapat ditampilkan di sini (optional)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },
            (error) => {
                // Tangani kesalahan upload
                reject(error);
            },
            () => {
                // Dapatkan URL gambar setelah upload selesai
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL); // Kirim URL download gambar
                });
            }
        );
    });
};


// deleteImage
export const deleteImage = async (imagePath: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath); // Buat referensi ke gambar berdasarkan path

    try {
        await deleteObject(imageRef); // Hapus gambar
        console.log("Gambar berhasil dihapus");
    } catch (error) {
        console.error("Error saat menghapus gambar:", error);
    }
};