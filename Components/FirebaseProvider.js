import React, { createContext, useContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';


export const db = firestore(); // ✅ Ensure Firestore is exported

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [alliterations, setAlliterations] = useState([]);
    const [quillEntries, setQuillEntries] = useState([]);
    const [fusions, setFusions] = useState([]);


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


    useEffect(() => {
        console.log("🔄 Setting up Firestore snapshot listener for Fusion Forms...");
    
        const fusionCollectionRef = db.collection('wordlists')
            .where("type", "==", "fusion")
            .orderBy("createdAt", "asc");
    
            const unsubscribeFusions = fusionCollectionRef.onSnapshot(
                (snapshot) => {
                    if (!snapshot || snapshot.empty) {
                        console.warn("⚠️ Firestore snapshot is empty or null. No Fusion Forms found.");
                        setFusions([]); // Set an empty array instead of crashing
                        return;
                    }
            
                    const fetchedFusions = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
            
                    console.log("🔥 Firestore update detected (Fusion Forms):", fetchedFusions);
                    setFusions(fetchedFusions);
                },
                (error) => {
                    console.error("❌ Firestore error:", error);
                }
            );
    
        return () => {
            console.log("🛑 Cleaning up Firestore listener for Fusion Forms...");
            unsubscribeFusions();
        };
    }, []);


    const addWord = async (newWord, collectionName = 'wordlists') => {
        if (!newWord.type) {
            console.error("❌ ERROR: Missing type for new word:", newWord);
            return null;
        }
    
        try {
            const newWordWithTimestamp = {
                ...newWord,
                createdAt: newWord.createdAt || firestore.FieldValue.serverTimestamp(), // ✅ Ensure timestamp is present
            };
    
            const newWordRef = await db.collection(collectionName).add(newWordWithTimestamp);
            console.log("✅ Successfully added word to Firestore → ID:", newWordRef.id);
    
            return { ...newWordWithTimestamp, id: newWordRef.id };
        } catch (error) {
            console.error("🔥 Error adding word to Firestore:", error);
            return null;
        }
    };

    const addFusion = async (newFusion) => {
        if (!newFusion.text || typeof newFusion.text !== "string") {
            console.error("❌ ERROR: Fusion text is missing or invalid:", newFusion);
            return null;
        }
    
        try {
            const fusionWithType = {
                ...newFusion,
                type: "fusion",
                text: newFusion.text.trim(), // ✅ Ensure text is valid
                createdAt: newFusion.createdAt || firestore.FieldValue.serverTimestamp(),
            };
    
            const newFusionRef = await db.collection('wordlists').add(fusionWithType);
            console.log(`✅ Added Fusion Form to Firestore → ID:`, newFusionRef.id);
    
            return { ...fusionWithType, id: newFusionRef.id };
        } catch (error) {
            console.error("🔥 Error adding Fusion Form to Firestore:", error);
            return null;
        }
    };

    const editWord = async (id, updatedWord, collectionName = 'wordlists') => {
        if (!id) {
            return { success: false, message: "❌ ERROR: editWord was called with an undefined ID." };
        }
    
        try {
            const wordDocRef = db.collection(collectionName).doc(id);
            const docSnapshot = await wordDocRef.get();
    
            if (!docSnapshot.exists) {
                return { success: false, message: `❌ ERROR: Document with ID ${id} not found in Firestore.` };
            }
    
            await wordDocRef.update(updatedWord);
            console.log("✅ Word updated successfully in Firestore:", updatedWord);
    
            return { success: true };
        } catch (error) {
            console.error("🔥 Error updating word in Firestore:", error);
            return { success: false, message: "🔥 Error updating word in Firestore." };
        }
    };

    const editFusion = async (id, updatedFusion) => {
        if (!id) {
            console.error("❌ ERROR: editFusion was called with an undefined ID.");
            return;
        }
    
        try {
            const fusionDocRef = db.collection('wordlists').doc(id);
            const docSnapshot = await fusionDocRef.get();
    
            if (!docSnapshot.exists) {
                console.error(`❌ ERROR: Fusion Form with ID ${id} not found in Firestore.`);
                return;
            }
    
            await fusionDocRef.update(updatedFusion);
            console.log("✅ Fusion Form updated successfully in Firestore:", updatedFusion);
        } catch (error) {
            console.error("🔥 Error updating Fusion Form in Firestore:", error);
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
    
            // ✅ Double-check if it's a Fusion Form before deleting
            const wordData = docSnapshot.data();
            if (wordData.type === 'fusion') {
                console.log(`🗑️ Removing Fusion Form from Firestore → ID: ${id}`);
            }
    
            await wordDocRef.delete();
            console.log(`✅ Successfully deleted from Firestore → ID: ${id}`);
        } catch (error) {
            console.error("🔥 Error deleting word from Firestore:", error);
        }
    };

    const deleteFusion = async (id) => {
        if (!id) {
            console.error("❌ ERROR: Attempted to delete an undefined Fusion Form ID.");
            return;
        }
    
        try {
            const fusionDocRef = db.collection('wordlists').doc(id);
            const docSnapshot = await fusionDocRef.get();
    
            if (!docSnapshot.exists) {
                console.warn(`⚠️ WARNING: Fusion Form with ID ${id} not found in Firestore.`);
                return;
            }
    
            await fusionDocRef.delete();
            console.log(`🗑️ Successfully deleted Fusion Form with ID: ${id}`);
        } catch (error) {
            console.error("🔥 Error deleting Fusion Form from Firestore:", error);
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
            words, alliterations, quillEntries, fusions, addFusion, editFusion, deleteFusion, editNote, addWord, editWord, deleteWord, setWords, setQuillEntries, addNote  
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};