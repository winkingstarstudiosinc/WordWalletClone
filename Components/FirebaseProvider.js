import React, { createContext, useContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';


export const db = firestore(); // ✅ Ensure Firestore is exported

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [alliterations, setAlliterations] = useState([]);
    const [quillEntries, setQuillEntries] = useState([]);

    useEffect(() => {
        console.log("🔄 Setting up Firestore snapshot listeners...");
    
        const wordsCollectionRef = db.collection('wordlists').orderBy("createdAt", "asc");
        const quillCollectionRef = db.collection('quilllists').orderBy("createdAt", "asc"); // ✅ Restore quilllists listener
    
        const unsubscribeWords = wordsCollectionRef.onSnapshot(snapshot => {
            const fetchedWords = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            console.log("🔥 Firestore update detected (wordlists):", fetchedWords);
            setWords(fetchedWords);
        });
    
        const unsubscribeQuill = quillCollectionRef.onSnapshot(snapshot => {
            const fetchedQuillEntries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            console.log("🔥 Firestore update detected (quilllists):", fetchedQuillEntries);
            setQuillEntries(fetchedQuillEntries); // ✅ Sync notes with Firestore
        });
    
        return () => {
            console.log("🛑 Cleaning up Firestore listeners...");
            unsubscribeWords();
            unsubscribeQuill();
        };
    }, []);

    useEffect(() => {
        const fetchInitialNotes = async () => {
            try {
                console.log("🌍 Fetching initial notes from Firestore...");
                const snapshot = await db.collection('quilllists').orderBy("createdAt", "asc").get();
                const fetchedQuillEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
                console.log("✅ Initial Firestore notes loaded:", fetchedQuillEntries);
                setQuillEntries(fetchedQuillEntries); // ✅ Ensure notes are stored in state at startup
    
            } catch (error) {
                console.error("❌ Error fetching initial notes:", error);
            }
        };
    
        fetchInitialNotes();
    }, []);


    const addWord = async (newWord, collectionName = 'wordlists') => {
        if (!newWord.type) {
            console.error("❌ ERROR: Missing type for new word:", newWord);
            return null;
        }
    
        try {
            const newWordRef = await db.collection(collectionName).add({ 
                ...newWord, 
                createdAt: firestore.FieldValue.serverTimestamp() 
            });
    
            console.log("✅ Successfully added word to Firestore → ID:", newWordRef.id);
    
            // ✅ Return Firestore’s correct ID
            return { ...newWord, id: newWordRef.id };
        } catch (error) {
            console.error("🔥 Error adding word to Firestore:", error);
            return null;
        }
    };

    const editWord = async (id, updatedWord, collectionName = 'wordlists') => {
        if (!id) {
            console.error("❌ ERROR: editWord was called with an undefined ID.");
            return;
        }
    
        try {
            const wordDocRef = db.collection(collectionName).doc(id);
    
            // 🔥 Check if the document exists before updating
            const docSnapshot = await wordDocRef.get();
            if (!docSnapshot.exists) {
                console.error(`❌ ERROR: Document with ID ${id} not found in Firestore.`);
                return;
            }
    
            await wordDocRef.update(updatedWord);
            console.log("✅ Word updated successfully in Firestore:", updatedWord);
        } catch (error) {
            console.error("🔥 Error updating word in Firestore:", error);
        }
    };

    const deleteWord = async (id, collectionName = 'wordlists') => {
        if (!id) {
            console.error("❌ ERROR: Attempted to delete an undefined ID.");
            return;
        }
    
        try {
            const wordDocRef = db.collection(collectionName).doc(id);
            const docSnapshot = await wordDocRef.get();
    
            if (!docSnapshot.exists) {
                console.warn(`⚠️ WARNING: Word with ID ${id} not found in Firestore.`);
                return;
            }
    
            await wordDocRef.delete();
            console.log(`🗑️ Successfully deleted word with ID: ${id}`);
        } catch (error) {
            console.error("🔥 Error deleting word from Firestore:", error);
        }
    };

    const addNote = async (newNote) => {
        try {
            const newNoteRef = await db.collection('quilllists').add({ 
                ...newNote, 
                createdAt: firestore.FieldValue.serverTimestamp() 
            });
    
            console.log("✅ Successfully added note to Firestore → ID:", newNoteRef.id);
            return newNoteRef.id; // ✅ Return the document ID so it can be stored
        } catch (error) {
            console.error("🔥 Error adding note to Firestore:", error);
            return null;
        }
    };

    const editNote = async (id, updatedNote, collectionName = 'quilllists') => {
        if (!id) {
            console.warn("⚠️ No existing note found, nothing to update.");
            return;
        }
    
        try {
            if (!updatedNote.content) {
                console.log("⚠️ User cleared note, saving empty string.");
            }
    
            const noteDoc = db.collection(collectionName).doc(id);
            const docSnapshot = await noteDoc.get();
    
            if (!docSnapshot.exists) {
                console.error(`❌ ERROR: Note with ID ${id} not found in Firestore.`);
                return;
            }
    
            await noteDoc.update(updatedNote);
            console.log("✅ Note updated successfully in Firestore:", updatedNote);
        } catch (error) {
            console.error("🔥 Error updating note in Firestore:", error);
        }
    };

    return (
        <FirebaseContext.Provider value={{ 
            words, alliterations, quillEntries, editNote, addWord, editWord, deleteWord, setWords, 
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};
