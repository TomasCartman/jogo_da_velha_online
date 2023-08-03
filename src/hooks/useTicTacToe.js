import { useCallback, useEffect, useState } from "react"
import { doc, onSnapshot } from 'firebase/firestore'
import useServer from "./useServer"
import repository from "@/services/repository"
import useSettings from "./useSettings"

export default function useTicTacToe() {
    const { gameRef } = repository()
    const { updateBoard, updateIsZeroTurn, getPlayerInfo, updateStatus, updateTurn,
        resetPlayersPlayingNow, updateTimestamp } = useServer()
    const { getId } = useSettings()
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [players, setPlayers] = useState([])
    const [status, setStatus] = useState('playing')
    const [isZeroTurn, setIsZeroTurn] = useState(true)
    const [turn, setTurn] = useState(0)
    const [time, setTime] = useState(0)
    const [playingNowName, setPlayingNowName] = useState('')

    useEffect(() => {
        getServerInfo()
        updateTimestamp(Date.now())
    }, [])

    useEffect(() => {
        if (status === 'end' || status === 'draw') {
            setTimeout(() => {
                setPlayers(p => [])
                resetPlayersPlayingNow()
                reset()
                updateTimestamp(Date.now())
            }, 4000)
        }
    }, [status])

    useEffect(() => {
        if (players.length === 2 && status === 'waiting') {
            updateStatus('playing')
            updateTurn(players[0].id)
            updateTimestamp(Date.now())
        }
    }, [players, status])

    useEffect(() => {
        if ((time  - 1000 * 60) > Date.now()) {
            setPlayers(p => [])
            resetPlayersPlayingNow()
            reset()
        }
    }, [time])

    const getServerInfo = useCallback(() => {

        onSnapshot(doc(gameRef, 'gameSquares'), (doc) => {
            const resp = doc.data()
            setSquares(resp.gameSquares)
        })

        onSnapshot(doc(gameRef, 'isZeroTurn'), (doc) => {
            const resp = doc.data()
            setIsZeroTurn(resp.isZeroTurn)
        })

        onSnapshot(doc(gameRef, 'playingNow'), (doc) => {
            const resp = doc.data()

            setPlayers(p => [])
            resp.playingNow.map(p => {
                getPlayerInfo(p)
                    .then(res => res.data)
                    .then(res => addNewPlayer(res))
            })

        })

        onSnapshot(doc(gameRef, 'turn'), (doc) => {
            const resp = doc.data()
            setTurn(resp.turn)
        })

        onSnapshot(doc(gameRef, 'status'), (doc) => {
            const resp = doc.data()
            setStatus(resp.status)
        })

        onSnapshot(doc(gameRef, 'time'), (doc) => {
            const resp = doc.data()
            setTime(resp.time)
        })

    }, [])

    function addNewPlayer(player) {
        setPlayers(newPlayers => {
            if(!isPlayerPlaying()) return [...newPlayers, player]
            return [...newPlayers]
        })
    }

    const forceDraw = () => {
        updateStatus('draw')
    }

    const reset = useCallback(() => {
        updateBoard(Array(9).fill(''))
        updateIsZeroTurn(true)
        updateStatus('waiting')
    }, [])

    function setPlayerToPlayName(id) {
        const player = getPlayerById(id)
        if (player !== undefined) setPlayingNowName(player.name)
    }

    function getPlayerById(id) {
        return players.find(p => p.id === id)
    }

    function isPlayerPlaying() {
        return getPlayerById(getId()) !== undefined
    }

    const handleClick = useCallback((pos) => {
        const squaresArray = [...squares]
        if (squaresArray[pos] || calculateWinner(squaresArray)) return
        squaresArray[pos] = isZeroTurn ? 'X' : 'O'
        updateBoard(squaresArray)
        if (calculateWinner(squaresArray)) return
        if (players[1] && players[0]) {
            updateTurn(players[0].id === turn ? players[1].id : players[0].id)
        }
        updateIsZeroTurn(isZeroTurn ? false : true)
        updateTimestamp(Date.now())
    }, [squares, players, isZeroTurn])


    const calculateWinner = squares => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        updateStatus('playing')

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                updateStatus('end')
                return squares[a]
            }
        }

        let over = true
        squares.forEach(square => {
            if (square === '') over = false
        })
        if (over) {
            updateStatus('draw')
            return true
        }

        return null
    }

    return {
        squares,
        status,
        isZeroTurn,
        players,
        turn,
        playingNowName,
        handleClick,
        reset,
        setPlayerToPlayName,
        isPlayerPlaying,
        forceDraw
    }
}