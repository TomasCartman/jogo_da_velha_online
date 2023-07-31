import axios from "axios"

export default function useServer() {

    const getPlayersPlayingNow = async () => {
        return await axios.get('/api/game/players')
    }

    const addPlayer = async player => {
        return await axios.post('/api/players', player)
            .then(data => data.data)
    }

    const addPlayerPlayingNow = async id => {
        return await axios.post('/api/game/players', { id })
            .then(data => data.data)
    }

    const playersPlayingNowSnapshot = async () => {
        return await axios.get('/api/game/players')
    }

    const getPlayerInfo = async id => {
        return await axios.get('/api/players', { params: { id } })
    }

    const updateBoard = async newBoard => {
        return await axios.post('/api/game/rules/gameSquares', { newBoard })
    }

    return {
        getPlayersPlayingNow,
        addPlayer,
        addPlayerPlayingNow,
        playersPlayingNowSnapshot,
        getPlayerInfo,
        updateBoard
    }
}