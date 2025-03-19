import React, {createContext, useState, useContext} from 'react';

// Create the context
const NotesContext = createContext();

// Create the provider
export const NotesProvider = ({children}) => {
  const [miscellaneousNote, setMiscellaneousNote] = useState('');

  return (
    <NotesContext.Provider value={{miscellaneousNote, setMiscellaneousNote}}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook for convenience
export const useNotes = () => useContext(NotesContext);
