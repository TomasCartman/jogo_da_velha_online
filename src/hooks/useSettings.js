import { useCallback, useEffect, useState } from "react"

export default function useSettings() {
    const [id, setId] = useState(-1)
    const [name, setName] = useState('')

    useEffect(() => {
        const localId = getId()
        setId(localId)
        setName(getName())
    }, [])

    const generateId = useCallback(() => {
        const max = 9999999
        const min = 1000000
        return Math.floor(Math.random() * (max - min + 1) + min)
    }, [])

    const getId = useCallback(() => {
        const localId = localStorage.getItem('id') 
        return localId ?  +localId : 0
    }, [])

    const getName = useCallback(() => {
        const localName = localStorage.getItem('name')
        return localName
    }, [])

    const setLocalId = useCallback((localId) => localStorage.setItem('id', localId), [])
    const setLocalName = useCallback((localName) => localStorage.setItem('name', localName), [])
    const clearLocalInfo = useCallback(() => localStorage.clear(), [])

    const createPlayer = useCallback((localName) => {
       const newId = generateId()
       setLocalId(newId.toString())
       setLocalName(localName)
    }, [generateId])

    return {
        id,
        name,
        createPlayer,
        clearLocalInfo
    }
}