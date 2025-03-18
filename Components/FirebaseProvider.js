    import React, { createContext, useContext, useState, useEffect } from 'react';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import firestore from '@react-native-firebase/firestore';


    export const db = firestore(); // ✅ Ensure Firestore is exported

    const FirebaseContext = createContext();
    export const useFirebase = () => useContext(FirebaseContext);

    export const FirebaseProvider = ({ children }) => {
        const [words, setWords] = useState([]); // ✅ Keep WalletFlap separate
        const [quillEntries, setQuillEntries] = useState([]); // ✅ Ensures it's always an array
        const [fusions, setFusions] = useState([]);
        const [alliterations, setAlliterations] = useState([]);
        const [allegories, setAllegories] = useState([]);
        const [allusions, setAllusions] = useState([]);
        const [hyperboles, setHyperboles] = useState([]);
        const [imageries, setImageries] = useState([]);
        const [ironies, setIronies] = useState([]);
        const [juxtapositions, setJuxtapositions] = useState([]);
        const [metaphors, setMetaphors] = useState([]);
        const [onomatopoeias, setOnomatopoeias] = useState([]);
        const [oxymorons, setOxymorons] = useState([]);
        const [euphemisms, setEuphemisms] = useState([]);
        const [similes, setSimiles] = useState([]);
        const [personifications, setPersonifications] = useState([]);
        const [idioms, setIdioms] = useState([]);


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
        
        // ✅ 2️⃣ Initial Fetch for Notes
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
        
        // ✅ 3️⃣ Load Words from Firestore & AsyncStorage
        useEffect(() => {
            const loadWords = async () => {
                console.log("🔄 Loading words from AsyncStorage...");
                const storedWords = await AsyncStorage.getItem("wordlists");
        
                if (storedWords) {
                    setWords(JSON.parse(storedWords));
                }
        
                console.log("🌍 Fetching words from Firestore...");
                const snapshot = await db.collection("wordlists").orderBy("createdAt", "asc").get();
                const fetchedWords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
                setWords(fetchedWords);
                await AsyncStorage.setItem("wordlists", JSON.stringify(fetchedWords));
            };
        
            loadWords(); // ✅ Load words separately
        }, []);
        
        // ✅ 4️⃣ Load Literary Devices from Firestore & AsyncStorage (INDIVIDUAL STATES)
        useEffect(() => {
            const literaryDevices = {
                fusions: setFusions,
                alliterations: setAlliterations,
                allegories: setAllegories,
                allusions: setAllusions,
                hyperboles: setHyperboles,
                imageries: setImageries,
                ironies: setIronies,
                juxtapositions: setJuxtapositions,
                metaphors: setMetaphors,
                onomatopoeias: setOnomatopoeias,
                oxymorons: setOxymorons,
                euphemisms: setEuphemisms,
                similes: setSimiles,
                personifications: setPersonifications,
                idioms: setIdioms,
            };
        
            const loadData = async (device, setState) => {
                try {
                    console.log(`🔄 Loading ${device} from AsyncStorage...`);
                    const storedData = await AsyncStorage.getItem(device);
                    if (storedData) {
                        setState(JSON.parse(storedData));
                    }
        
                    console.log(`🌍 Fetching ${device} from Firestore...`);
                    const snapshot = await db.collection(device).orderBy("createdAt", "asc").get();
                    const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];
        
                    setState(fetchedData);
                    await AsyncStorage.setItem(device, JSON.stringify(fetchedData));
                } catch (error) {
                    console.error(`❌ Error loading ${device}:`, error);
                }
            };
        
            for (const [device, setState] of Object.entries(literaryDevices)) {
                loadData(device, setState);
            }
        }, []);


        const addWord = async (newWord, collectionName) => {
            if (!newWord.type) {
                console.error("❌ ERROR: Missing type for new word:", newWord);
                return null;
            }
        
            if (!collectionName || typeof collectionName !== "string") {
                console.error("🔥 ERROR: Invalid collection name:", collectionName);
                return null; // ✅ Prevent undefined collection errors
            }
        
            try {
                const newWordRef = await db.collection(collectionName).add({
                    ...newWord,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
        
                console.log(`✅ Successfully added to '${collectionName}' → ID:`, newWordRef.id);
        
                switch (collectionName) {
                    case 'fusions': setFusions(prev => [...prev, { ...newWord, id: newWordRef.id }]); break;
                    case 'alliterations': setAlliterations(prev => [...prev, { ...newWord, id: newWordRef.id }]); break;
                    case 'allegories': setAllegories(prev => [...prev, { ...newWord, id: newWordRef.id }]); break;
                    default:
                        console.warn(`⚠️ Unrecognized collection name: ${collectionName}`);
                }
        
                return { ...newWord, id: newWordRef.id };
            } catch (error) {
                console.error(`🔥 Error adding to '${collectionName}':`, error);
                return null;
            }
        };

        const editWord = async (id, updatedWord, collectionName = "wordlists") => {
            if (!id) {
                console.error("❌ ERROR: editWord was called with an undefined ID.");
                return;
            }
        
            if (!collectionName || typeof collectionName !== "string") {
                console.error("🔥 ERROR: Invalid collection name:", collectionName);
                return; // ✅ Prevent undefined collection errors
            }
        
            try {
                const wordDocRef = db.collection(collectionName).doc(id);
                const docSnapshot = await wordDocRef.get();
        
                if (!docSnapshot.exists) {
                    console.error(`❌ ERROR: Document with ID ${id} not found in Firestore.`);
                    return;
                }
        
                await wordDocRef.update(updatedWord);
                console.log(`✅ '${collectionName}' entry updated successfully:`, updatedWord);
        
                // ✅ Update correct state dynamically
                const updateState = (setState) =>
                    setState(prev => prev.map(word => word.id === id ? { ...word, ...updatedWord } : word));
        
                switch (collectionName) {
                    case 'wordlists': updateState(setWords); break;
                    case 'fusions': updateState(setFusions); break;
                    case 'alliterations': updateState(setAlliterations); break;
                    case 'allegories': updateState(setAllegories); break;
                    default:
                        console.warn(`⚠️ Unrecognized collection name: ${collectionName}`);
                }
        
            } catch (error) {
                console.error(`🔥 Error updating '${collectionName}':`, error);
            }
        };

        const deleteWord = async (id, collectionName = 'wordlists') => {
            if (!id) {
                console.error("❌ ERROR: Attempted to delete an undefined ID.");
                return;
            }
        
            if (!collectionName || typeof collectionName !== "string") {
                console.error("🔥 ERROR: Invalid collection name:", collectionName);
                return; // ✅ Prevent undefined collection errors
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
        
                // ✅ Update correct state dynamically
                const updateState = (setState) => setState(prev => prev.filter(word => word.id !== id));
        
                switch (collectionName) {
                    case 'wordlists': updateState(setWords); break;
                    case 'fusions': updateState(setFusions); break;
                    case 'alliterations': updateState(setAlliterations); break;
                    case 'allegories': updateState(setAllegories); break;
                    default:
                        console.warn(`⚠️ Unrecognized collection name: ${collectionName}`);
                }
        
                // ✅ Update AsyncStorage after deletion
                const storedData = await AsyncStorage.getItem(collectionName);
                if (storedData) {
                    const updatedData = JSON.parse(storedData).filter(word => word.id !== id);
                    await AsyncStorage.setItem(collectionName, JSON.stringify(updatedData));
                    console.log(`💾 Updated AsyncStorage after deleting from '${collectionName}'`);
                }
        
            } catch (error) {
                console.error(`🔥 Error deleting from '${collectionName}':`, error);
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
                quillEntries, setQuillEntries,
                words, setWords,
                fusions, setFusions,
                alliterations, setAlliterations,
                allegories, setAllegories,
                allusions, setAllusions,
                hyperboles, setHyperboles,
                imageries, setImageries,
                ironies, setIronies,
                juxtapositions, setJuxtapositions,
                metaphors, setMetaphors,
                onomatopoeias, setOnomatopoeias,
                oxymorons, setOxymorons,
                euphemisms, setEuphemisms,
                similes, setSimiles,
                personifications, setPersonifications,
                idioms, setIdioms,
                addWord, editWord, deleteWord
            }}>
                {children}
            </FirebaseContext.Provider>
        );
    };
