import axios from "axios"

export default function useServer() {
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

    const updateIsZeroTurn = async turn => {
        return await axios.post('/api/game/rules/isZeroTurn', { turn })
    }

    const updateTurn = async turnId => {
        return await axios.post('/api/game/rules/turn', { turnId })
    }

    const updateMessage = async message => {
        return await axios.post('/api/game/rules/message', { message })
    }

    const updateStatus = async status => {
        return await axios.post('/api/game/rules/status', { status })
    }

    const resetPlayersPlayingNow = async () => {
        return await axios.post('/api/game/reset')
    }

    const updateTimestamp = async time => {
        return await axios.post('/api/game/rules/time', { time })
    }

    return {
        addPlayer,
        addPlayerPlayingNow,
        playersPlayingNowSnapshot,
        getPlayerInfo,
        updateBoard,
        updateIsZeroTurn,
        updateTurn,
        updateMessage,
        updateStatus,
        resetPlayersPlayingNow,
        updateTimestamp
    }
}