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
        const wordsCollectionRef = db.collection('wordlists').orderBy("createdAt", "asc");
        const unsubscribe = wordsCollectionRef.onSnapshot(snapshot => {
            const fetchedWords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setWords(fetchedWords.filter(word => word.type === 'word'));
            setAlliterations(fetchedWords.filter(alliteration => alliteration.type === 'alliteration'));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const quillCollectionRef = db.collection('quilllists').orderBy("createdAt", "asc");
        const unsubscribe = quillCollectionRef.onSnapshot(snapshot => {
            const fetchedQuillEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuillEntries(fetchedQuillEntries);
        });
        return () => unsubscribe();
    }, []);

    const addWord = async (newWord, collectionName = 'wordlists') => {
        if (!newWord.type) {
            console.error("Missing type for new word:", newWord);
            return;
        }
        await db.collection(collectionName).add({ ...newWord, createdAt: firestore.FieldValue.serverTimestamp() });
    };

    const editWord = async (id, updatedWord, collectionName = 'wordlists') => {
        const wordDoc = db.collection(collectionName).doc(id);
        await wordDoc.update(updatedWord);
    };

    const deleteWord = async (id) => {
        if (!id) {
            console.error("Attempted to delete a word with an invalid id");
            return;
        }
        await db.collection('wordlists').doc(id).delete().catch(error => console.error("Error deleting word:", error));
    };

    return (
        <FirebaseContext.Provider value={{ 
            words, alliterations, quillEntries, addWord, editWord, deleteWord 
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};
