import { useCallback, useEffect, useState } from "react"
import useServer from "./useServer"

export default function useSettings() {
    const [id, setId] = useState(-1)
    const [name, setName] = useState('')
    const { addPlayer, addPlayerPlayingNow, getPlayerInfo } = useServer()

    useEffect(() => {
        const localId = getLocalId()
        setId(localId)
        setName(getName())
    }, [])

    const getLocalId = () => {
        const localId = localStorage.getItem('id')
        return localId ? +localId : 0
    }

    const generateId = () => {
        const max = 9999999
        const min = 1000000
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const getName = () => {
        const localName = localStorage.getItem('name')
        return localName
    }

    const setLocalId = localId => localStorage.setItem('id', localId)
    const setLocalName = localName => localStorage.setItem('name', localName)
    const clearLocalInfo = () => localStorage.clear()

    const createPlayer = localName => {
        const newId = generateId()
        setLocalId(newId.toString())
        setLocalName(localName)
        const player = {
            id: newId,
            name: localName
        }
        addPlayer(player)
    }

    return {
        id,
        name,
        createPlayer,
        clearLocalInfo,
        addPlayerPlayingNow,
        getLocalId,
        getName,
        getPlayerInfo
    }
}