import { useCallback, useEffect, useState } from "react"
import { doc, onSnapshot } from 'firebase/firestore'
import useServer from "@/hooks/useServer"
import repository from "@/services/repository"
import useSettings from "@/hooks/useSettings"

export default function useTicTacToe() {
    const { gameRef } = repository()
    const { updateBoard, updateIsZeroTurn, getPlayerInfo, updateStatus, updateTurn,
        resetPlayersPlayingNow } = useServer()
    const { getLocalId, addPlayerPlayingNow } = useSettings()
    const [serverSquares, setServerSquares] = useState(Array(9).fill(null))
    const [players, setPlayers] = useState([])
    const [status, setStatus] = useState('waiting')
    const [isZeroTurn, setIsZeroTurn] = useState(true)
    const [turnId, setTurnId] = useState(0)
    const [playingNowName, setPlayingNowName] = useState('')
    const [showButtonPlayAgain, setShowButtonPlayAgain] = useState(true)

    useEffect(() => {
        getServerInfo()
    }, [])

    useEffect(() => {
        if (status === 'end' || status === 'draw') {
            setTimeout(() => {
                resetPlayersPlayingNow()
                resetBoardAndStatusAndIsZeroTurn()
            }, 3000)
        }
    }, [status])

    useEffect(() => {
        if (players.length === 2 && status === 'waiting' && getPlayerZeroId() === getLocalId()) {
            updateStatus('playing')
            updateTurn(getPlayerZeroId())
        } else if (players.length < 2) {
            updateStatus('waiting')
        }
        if ((status === 'end' || status === 'draw' || status === 'waiting') && !isPlayerPlaying()) {
            setShowButtonPlayAgain(sbpa => true)
        } else {
            setShowButtonPlayAgain(sbpa => false)
        }
    }, [players, status])

    useEffect(() => {
        setPlayerNameToPlay()
    }, [players, turnId])

    const getServerInfo = () => {
        onSnapshot(doc(gameRef, 'gameSquares'), (doc) => {
            const data = doc.data()
            setServerSquares(data.gameSquares)
        })

        onSnapshot(doc(gameRef, 'isZeroTurn'), (doc) => {
            const data = doc.data()
            setIsZeroTurn(data.isZeroTurn)
        })

        onSnapshot(doc(gameRef, 'playingNow'), (doc) => {
            const data = doc.data()

            setPlayers(p => [])
            data.playingNow.map(p => {
                getPlayerInfo(p)
                    .then(res => res.data)
                    .then(res => addNewPlayer(res))
            })
        })

        onSnapshot(doc(gameRef, 'turn'), (doc) => {
            const data = doc.data()
            setTurnId(data.turn)
        })

        onSnapshot(doc(gameRef, 'status'), (doc) => {
            const data = doc.data()
            setStatus(data.status)
        })
    }

    function addPlayerIfValidLocalId() {
        if (!isPlayerPlaying()) {
            const id = getLocalId()
            if (id) {
                addPlayerPlayingNow(id)
            }
        }
    }

    function isPlayerPlaying() {
        return getPlayerByIdInPlayersPlayingNow(getLocalId()) !== undefined
    }

    const resetBoardAndStatusAndIsZeroTurn = () => {
        updateBoard(Array(9).fill(''))
        updateIsZeroTurn(true)
        updateStatus('waiting')
        updateTurn(0)
    }

    function setPlayerNameToPlay() {
        if (players.length > 0) {
            setPlayerToPlayNowById(turnId)
        }
    }

    function addNewPlayer(player) {
        setPlayers(newPlayers => {
            if (!isPlayerPlaying()) return [...newPlayers, player]
            return [...newPlayers]
        })
    }

    const forceDraw = () => {
        updateStatus('draw')
    }

    function setPlayerToPlayNowById(id) {
        const player = getPlayerByIdInPlayersPlayingNow(id)
        if (player !== undefined) setPlayingNowName(player.name)
    }

    function getPlayerByIdInPlayersPlayingNow(id) {
        return players.find(p => p.id === id)
    }

    const handleClick = useCallback((pos) => {
        const squaresArray = [...serverSquares]
        if (squaresArray[pos] || calculateWinner(squaresArray)) return
        squaresArray[pos] = isZeroTurn ? 'X' : 'O'
        updateBoard(squaresArray)
        if (calculateWinner(squaresArray)) return
        changeTurn()
        updateIsZeroTurn(isZeroTurn ? false : true)
    }, [serverSquares, players, isZeroTurn, turnId])

    const calculateWinner = squares => {
        const winner = getWinner(squares)
        if (winner) return winner

        const isDraw = isGameDraw(squares)
        if (isDraw) return isDraw

        return null
    }

    const getWinner = squares => {
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

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                updateStatus('end')
                return squares[a]
            }
        }
    }

    const isGameDraw = squares => {
        let theGameIsDraw = true
        squares.forEach(square => {
            if (square === '') theGameIsDraw = false
        })
        if (theGameIsDraw) {
            updateStatus('draw')
        }
        return theGameIsDraw
    }

    function changeTurn() {
        updateTurn(getPlayerZeroId() === turnId ? getPlayerOneId() : getPlayerZeroId())
    }

    const getPlayerZeroId = () => players[0].id
    const getPlayerOneId = () => players[1].id

    return {
        serverSquares,
        status,
        isZeroTurn,
        players,
        turnId,
        playingNowName,
        showButtonPlayAgain,
        handleClick,
        resetBoardAndStatusAndIsZeroTurn,
        setPlayerToPlayNowById,
        isPlayerPlaying,
        forceDraw,
        addPlayerIfValidLocalId
    }
}