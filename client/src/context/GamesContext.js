import {useState, useEffect, createContext} from 'react'
import axios from "axios";

const GamesContext = createContext()

export function GamesContextProvider({children}) {
    const [games, setGames] = useState([])
    const url = "http://localhost:8080/games";
    
    useEffect(() => {
        setGames(axios.get(url))
    }, [])

    setGames(axios.get(url));

    return <GamesContext.Provider value={games}>
        {children}
    </GamesContext.Provider>
}
