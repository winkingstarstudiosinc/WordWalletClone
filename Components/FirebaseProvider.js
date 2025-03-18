import React, { createContext, useContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [alliterations, setAlliterations] = useState([]);
    const [quillEntries, setQuillEntries] = useState([]);


    useEffect(() => {
        console.log("🔄 Setting up Firestore snapshot listener...");
        
        const wordsCollectionRef = db.collection('wordlists').orderBy("createdAt", "asc");
        const quillCollectionRef = db.collection('quilllists').orderBy("createdAt", "asc");
    
        const unsubscribeWords = wordsCollectionRef.onSnapshot(snapshot => {
            const fetchedWords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("🔥 Real-time Firestore update (wordlists):", fetchedWords);
            setWords(fetchedWords.filter(word => word.type === 'word'));
            setAlliterations(fetchedWords.filter(alliteration => alliteration.type === 'alliteration'));
        });
    
        const unsubscribeQuill = quillCollectionRef.onSnapshot(snapshot => {
            const fetchedQuillEntries = snapshot.docs.map(doc => ({
                id: doc.id,  // ✅ Ensure Firestore ID is included
                ...doc.data(),
            }));
    
            console.log("🔥 Real-time Firestore update (quilllists):", fetchedQuillEntries);
            setQuillEntries(fetchedQuillEntries);
        });
    
        return () => {
            console.log("🛑 Cleaning up Firestore listeners...");
            unsubscribeWords();
            unsubscribeQuill();
        };
    }, []);

    useEffect(() => {
        const fetchInitialWords = async () => {
            try {
                console.log("🌍 Fetching initial words from Firestore...");
                const snapshot = await db.collection('wordlists').orderBy("createdAt", "asc").get();
                const fetchedWords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
                console.log("✅ Initial Firestore words loaded:", fetchedWords);
                setWords(fetchedWords);  // Ensure words are stored in state at startup
    
            } catch (error) {
                console.error("❌ Error fetching initial words:", error);
            }
        };
    
        fetchInitialWords();
    }, []); 

    const addWord = async (newWord, collectionName = 'wordlists') => {
        if (!newWord.type) {
            console.error("❌ ERROR: Missing type for new word:", newWord);
            return;
        }
    
        try {
            const newWordRef = await db.collection(collectionName).add({ 
                ...newWord, 
                createdAt: firestore.FieldValue.serverTimestamp() 
            });
    
            console.log("✅ Successfully added word to Firestore → ID:", newWordRef.id);
    
        } catch (error) {
            console.error("🔥 Error adding word to Firestore:", error);
        }
    };

    const editWord = async (id, updatedWord, collectionName = 'wordlists') => {
        if (!id) {
            console.error("❌ ERROR: editWord was called with an undefined ID.");
            return;
        }
    
        try {
            const wordDoc = db.collection(collectionName).doc(id);
            await wordDoc.update(updatedWord);
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
            await db.collection(collectionName).doc(id).delete();
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
            return; // ✅ If no note exists yet, do nothing.
        }
    
        try {
            if (!updatedNote.content) {
                console.log("⚠️ User cleared note, saving empty string.");
            }
    
            const noteDoc = db.collection(collectionName).doc(id);
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
