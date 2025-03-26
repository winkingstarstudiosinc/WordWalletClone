import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';


export const db = firestore(); // ✅ Ensure Firestore is exported

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [alliterations, setAlliterations] = useState([]);
    const [quillEntries, setQuillEntries] = useState([]);
    const [fusions, setFusions] = useState([]);
    const [witwisdoms, setWitWisdoms] = useState([{
        firstPart: { text: '', style: {} },
        secondPart: { text: '', style: {} },
        textType: 'Common',
        category: '',
      }]);


    useEffect(() => {
        console.log("🔄 Setting up Firestore snapshot listeners...");
      
        const wordsCollectionRef = db.collection('wordlists').orderBy("createdAt", "asc");
        const quillCollectionRef = db.collection('quilllists').orderBy("createdAt", "asc");
      
        const unsubscribeWords = wordsCollectionRef.onSnapshot(snapshot => {
          const fetchedWords = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
      
          console.log("🔥 Firestore update detected (wordlists):", fetchedWords);
          const lexiconWords = fetchedWords.filter(word => word.type === 'Lexicon');
          console.log("📘 Filtered Lexicon words (snapshot):", lexiconWords);
      
          setWords(lexiconWords);
        });
      
        const unsubscribeQuill = quillCollectionRef.onSnapshot(snapshot => {
          const fetchedQuillEntries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
      
          console.log("🔥 Firestore update detected (quilllists):", fetchedQuillEntries);
          setQuillEntries(fetchedQuillEntries);
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
            async (snapshot) => {
                if (!snapshot || snapshot.empty) {
                    console.warn("⚠️ Firestore snapshot is empty. No Fusion Forms found.");
                    setFusions([]); // Reset list if empty
                    return;
                }
    
                const fetchedFusions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
    
                console.log("🔥 Firestore updated (Fusion Forms):", fetchedFusions);
    
                // ✅ Ensure persistence by saving the latest fusions to AsyncStorage
                await AsyncStorage.setItem('fusionFormsData', JSON.stringify(fetchedFusions));
    
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




    useEffect(() => {
        const alliterationCollectionRef = db.collection('wordlists')
          .where("type", "==", "alliterations")
          .orderBy("createdAt", "asc");
      
        const unsubscribeAlliterations = alliterationCollectionRef.onSnapshot(
          async (snapshot) => {
            if (!snapshot || snapshot.empty) {
              setAlliterations([]); // Reset if no results
              return;
            }
      
            const fetchedAlliterations = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
      
            await AsyncStorage.setItem('alliterationFormsData', JSON.stringify(fetchedAlliterations));
            setAlliterations(fetchedAlliterations); // ✅ Alliteration state update
          },
          (error) => {
            console.error("❌ Firestore error (alliterations):", error);
          }
        );
      
        return () => unsubscribeAlliterations(); // Clean up
      }, []);




      useEffect(() => {
        const witWisdomCollectionRef = db.collection('wordlists')
          .where("type", "==", "witwisdom")
          .orderBy("createdAt", "asc");
      
        const unsubscribeWitWisdoms = witWisdomCollectionRef.onSnapshot(
          async (snapshot) => {
            if (!snapshot || snapshot.empty) {
              setWitWisdoms([]); // Reset if no results
              return;
            }
      
            const fetchedWitWisdoms = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
      
            await AsyncStorage.setItem('witWisdomData', JSON.stringify(fetchedWitWisdoms));
            setWitWisdoms(fetchedWitWisdoms); // ✅ WitWisdom state update
          },
          (error) => {
            console.error("❌ Firestore error while fetching witwisdoms:", error);
          }
        );
      
        return () => unsubscribeWitWisdoms(); // Clean up on unmount
      }, []);



    const addWord = async (newWord) => {
        if (!newWord.term || !newWord.definition || !newWord.type) {
          console.error("❌ ERROR: Missing term, definition, or type:", newWord);
          return null;
        }
      
        try {
          const cleanedWord = {
            term: newWord.term.trim(),
            definition: newWord.definition.trim(),
            type: newWord.type,
            termStyle: newWord.termStyle || {},
            definitionStyle: newWord.definitionStyle || {},
            createdAt: firestore.FieldValue.serverTimestamp(),
          };
      
          const newWordRef = await db.collection('wordlists').add(cleanedWord);
          console.log("✅ Word added to Firestore → ID:", newWordRef.id);
      
          // ✅ Fetch the fully saved document so we get the resolved `createdAt`
          const savedDoc = await newWordRef.get();
          const savedData = savedDoc.data();
      
          return { ...savedData, id: newWordRef.id };
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


    const addAlliteration = async (newAlliteration) => {
        if (!newAlliteration.term || typeof newAlliteration.term !== "string") {
          console.error("❌ ERROR: Alliteration term is missing or invalid:", newAlliteration);
          return null;
        }
      
        try {
          const alliterationWithType = {
            ...newAlliteration,
            type: "alliterations",
            term: newAlliteration.term.trim(), // Ensure clean term
            createdAt: newAlliteration.createdAt || firestore.FieldValue.serverTimestamp(),
          };
      
          const newAlliterationRef = await db.collection('wordlists').add(alliterationWithType);
          console.log(`✅ Added Alliteration to Firestore → ID:`, newAlliterationRef.id);
      
          return { ...alliterationWithType, id: newAlliterationRef.id };
        } catch (error) {
          console.error("🔥 Error adding Alliteration to Firestore:", error);
          return null;
        }
      };


      const addWitWisdom = async (newEntry) => {
        if (
          !newEntry.firstPart?.text ||
          !newEntry.secondPart?.text ||
          typeof newEntry.firstPart.text !== "string" ||
          typeof newEntry.secondPart.text !== "string"
        ) {
          console.error("❌ ERROR: WitWisdom entry is missing or invalid:", newEntry);
          return null;
        }
      
        try {
          const witWisdomWithType = {
            ...newEntry,
            type: "witwisdom",
            createdAt: newEntry.createdAt || firestore.FieldValue.serverTimestamp(),
          };
      
          const newDocRef = await db.collection('wordlists').add(witWisdomWithType);
          console.log("✅ Added Wit & Wisdom entry to Firestore → ID:", newDocRef.id);
      
          return { ...witWisdomWithType, id: newDocRef.id };
        } catch (error) {
          console.error("🔥 Error adding Wit & Wisdom entry to Firestore:", error);
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
    
            const existingData = docSnapshot.data();
    
            // 🔥 Ensure the update merges with existing data
            const fusionUpdate = {
                ...existingData,  // ✅ Merge with existing data
                ...updatedFusion, // ✅ Apply the update
                updatedAt: firestore.FieldValue.serverTimestamp() // ✅ Track changes
            };
    
            await fusionDocRef.set(fusionUpdate, { merge: true }); // ✅ Ensure merging
            console.log("✅ Fusion Form textType permanently updated in Firestore:", fusionUpdate.textType);
    
        } catch (error) {
            console.error("🔥 Error updating Fusion Form textType in Firestore:", error);
        }
    };

    const editAlliteration = async (id, updatedAlliteration) => {
        if (!id) {
          console.error("❌ ERROR: editAlliteration was called with an undefined ID.");
          return;
        }
      
        try {
          const alliterationDocRef = db.collection('wordlists').doc(id);
          const docSnapshot = await alliterationDocRef.get();
      
          if (!docSnapshot.exists) {
            console.error(`❌ ERROR: Alliteration with ID ${id} not found in Firestore.`);
            return;
          }
      
          const existingData = docSnapshot.data();
      
          const alliterationUpdate = {
            ...existingData,
            ...updatedAlliteration,
            updatedAt: firestore.FieldValue.serverTimestamp()
          };
      
          await alliterationDocRef.set(alliterationUpdate, { merge: true });
          console.log("✅ Alliteration textType permanently updated in Firestore:", alliterationUpdate.textType);
        } catch (error) {
          console.error("🔥 Error updating Alliteration in Firestore:", error);
        }
      };



      const editWitWisdom = async (id, updatedWitWisdom) => {
        if (!id) {
          console.error("❌ ERROR: editWitWisdom was called with an undefined ID.");
          return;
        }
      
        try {
          const witWisdomDocRef = db.collection('wordlists').doc(id);
          const docSnapshot = await witWisdomDocRef.get();
      
          if (!docSnapshot.exists) {
            console.error(`❌ ERROR: Wit & Wisdom entry with ID ${id} not found in Firestore.`);
            return;
          }
      
          const existingData = docSnapshot.data();
      
          const witWisdomUpdate = {
            ...existingData,
            ...updatedWitWisdom,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          };
      
          await witWisdomDocRef.set(witWisdomUpdate, { merge: true });
          console.log("✅ Wit & Wisdom entry successfully updated in Firestore:", witWisdomUpdate);
        } catch (error) {
          console.error("🔥 Error updating Wit & Wisdom entry in Firestore:", error);
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


    const deleteAlliteration = async (id) => {
        if (!id) {
          console.error("❌ ERROR: Attempted to delete an undefined Alliteration ID.");
          return;
        }
      
        try {
          const alliterationDocRef = db.collection('wordlists').doc(id);
          const docSnapshot = await alliterationDocRef.get();
      
          if (!docSnapshot.exists) {
            console.warn(`⚠️ WARNING: Alliteration with ID ${id} not found in Firestore.`);
            return;
          }
      
          await alliterationDocRef.delete();
          console.log(`🗑️ Successfully deleted Alliteration with ID: ${id}`);
        } catch (error) {
          console.error("🔥 Error deleting Alliteration from Firestore:", error);
        }
      };


      const deleteWitWisdom = async (id) => {
        if (!id) {
          console.error("❌ ERROR: Attempted to delete an undefined Wit & Wisdom entry ID.");
          return;
        }
      
        try {
          const witWisdomDocRef = db.collection('wordlists').doc(id);
          const docSnapshot = await witWisdomDocRef.get();
      
          if (!docSnapshot.exists) {
            console.warn(`⚠️ WARNING: Wit & Wisdom entry with ID ${id} not found in Firestore.`);
            return;
          }
      
          await witWisdomDocRef.delete();
          console.log(`🗑️ Successfully deleted Wit & Wisdom entry with ID: ${id}`);
        } catch (error) {
          console.error("🔥 Error deleting Wit & Wisdom entry from Firestore:", error);
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
            words, alliterations, quillEntries, fusions, alliterations, witwisdoms, setWitWisdoms, addWitWisdom, editWitWisdom, deleteWitWisdom, setAlliterations, addAlliteration, editAlliteration, deleteAlliteration, setFusions, addFusion, editFusion, deleteFusion, editNote, addWord, editWord, deleteWord, setWords, setQuillEntries, addNote  
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};