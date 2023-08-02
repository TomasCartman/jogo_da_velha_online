import { useCallback, useEffect, useState } from "react"
import { doc, onSnapshot } from 'firebase/firestore'
import useServer from "./useServer"
import repository from "@/services/repository"

export default function useTicTacToe() {
    const { gameRef } = repository()
    const { updateBoard, updateIsZeroTurn, getPlayerInfo, updateStatus, updateTurn } = useServer()
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [players, setPlayers] = useState([])
    const [status, setStatus] = useState('playing')
    const [isZeroTurn, setIsZeroTurn] = useState(true)
    const [turn, setTurn] = useState(0)

    useEffect(() => {
        getServerInfo()
    }, [])

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
            if (resp.playingNow != null) {
                setPlayers(p => [])
                resp.playingNow.map(p => {
                    getPlayerInfo(p)
                        .then(res => res.data)
                        .then(res => addNewPlayer(res))
                })
            }
        })

        onSnapshot(doc(gameRef, 'turn'), (doc) => {
            const resp = doc.data()
            setTurn(resp.turn)
        })

        onSnapshot(doc(gameRef, 'status'), (doc) => {
            const resp = doc.data()
            setStatus(resp.status)
        })

    }, [])

    function addNewPlayer(player) {
        setPlayers(newPlayers => [...newPlayers, player])
    }

    const reset = useCallback(() => {
        updateBoard(Array(9).fill(''))
        updateIsZeroTurn(true)
        updateStatus('playing')
    }, [])

    const handleClick = useCallback((pos) => {
        const squaresArray = [...squares]
        if (squaresArray[pos] || calculateWinner(squaresArray)) return
        squaresArray[pos] = isZeroTurn ? 'X' : 'O'
        updateBoard(squaresArray)
        if (calculateWinner(squaresArray)) return
        if (players[1] && players[0]) {
            updateTurn(isZeroTurn ? players[1].id : players[0].id)
        }
        updateIsZeroTurn(isZeroTurn ? false : true)
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
        handleClick,
        reset
    }
}