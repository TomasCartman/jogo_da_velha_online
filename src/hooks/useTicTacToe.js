import { useCallback, useEffect, useState } from "react"
import { doc, onSnapshot } from 'firebase/firestore'
import useServer from "./useServer"
import repository from "@/services/repository"

export default function useTicTacToe() {
    const { gameRef } = repository()
    const { updateBoard, updateIsZeroTurn, getPlayerInfo, updateStatus, updateTurn } = useServer()
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [message, setMessage] = useState('Vez de: ')
    const [players, setPlayers] = useState([])
    const [playingNow, setPlayingNow] = useState({})
    const [status, setStatus] = useState('playing')
    const [isZeroTurn, setIsZeroTurn] = useState(true)
    const [turn, setTurn] = useState(0)

    useEffect(() => {
        getRules()
    }, [])

    const getRules = useCallback(() => {
        onSnapshot(doc(gameRef, 'rules'), (doc) => {
            const resp = doc.data()
            if (resp) {
                console.log(resp)
                if (resp.gameSquares) {
                    if (resp.gameSquares != squares) {
                        setSquares(resp.gameSquares)
                    }
                }
                if (resp.isZeroTurn != null) {
                    if (resp.isZeroTurn != isZeroTurn) {
                        setIsZeroTurn(zt => resp.isZeroTurn)
                    }
                }
                if (resp.playingNow != null) {
                    //setPlayers(p => [])
                    if (resp.playingNow != playingNow) {
                        setPlayingNow(resp.playingNow)
                        resp.playingNow.map(p => {
                            getPlayerInfo(p)
                                .then(res => res.data)
                                .then(res => addNewPlayer(res))
                        })
                    }
                }
                if (resp.turn != 0) {
                    if (resp.turn != turn) {
                        setTurn(t => resp.turn)
                    }
                }
                if (resp.status != null) {
                    if (resp.status != status) {
                        setStatus(s => resp.status)
                        handleMessage(resp.status)
                    }
                }
            }
        })
    }, [])

    function handleMessage(status) {
        if (status === 'playing') {
            setMessage(m => 'Vez de:')
        } else if (status === 'end') {
            setMessage(m => 'Vencedor:')
        } else if (status === 'draw') {
            setMessage(m => 'Empate')
        }
    }

    function addNewPlayer(player) {
        setPlayers(newPlayers => {
            if (newPlayers.length < 2) {
                return [...newPlayers, player]
            }
            return [...newPlayers]
        })
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
        console.log(players)
        console.log(players)
        if (players[1] && players[0]) {
            updateTurn(isZeroTurn ? players[1].id : players[0].id)
        }
        updateIsZeroTurn(isZeroTurn ? false : true)
    }, [squares, isZeroTurn])


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
                //setPlayer(squares[a])
                updateStatus('end')
                return squares[a]
            }
        }

        let over = true
        squares.forEach(square => {
            if (square === '') over = false
        })
        if (over) {
            //setPlayer('')
            updateStatus('draw')
            return true
        }

        return null
    }

    return {
        squares,
        message,
        status,
        isZeroTurn,
        players,
        turn,
        handleClick,
        reset
    }
}