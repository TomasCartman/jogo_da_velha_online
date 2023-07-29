import { useCallback, useEffect, useState } from "react"
import useSettings from "./useSettings"

export default function useTicTacToe() {
    const { name } = useSettings()
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [message, setMessage] = useState('Vez de: ')
    const [player, setPlayer] = useState('X')
    const [resetting, setResetting] = useState(false)

    const reset = useCallback(() => {
        setResetting(true)
        setTimeout(() => {
            setSquares(Array(9).fill(null))
            setMessage('Vez de:')
            setPlayer('X')
            setResetting(false)
        }, 6000)
    }, [])

    const handleClick = useCallback((pos) => {
        //console.log(getId())
        const squaresArray = [...squares]
        if (squaresArray[pos] || calculateWinner(squaresArray)) return
        squaresArray[pos] = player
        setSquares(squaresArray)
        if (calculateWinner(squaresArray)) return
        setPlayer(player === 'X' ? 'O' : 'X')
    }, [squares, player])


    const calculateWinner = useCallback((squares) => {
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
                setMessage('Vencedor:')
                setPlayer(squares[a])
                //reset()
                return squares[a]
            }
        }

        let over = true
        squares.forEach(square => {
            if (square === null) over = false
        })
        if (over) {
            setMessage('Empate')
            setPlayer('')
            //reset()
            return true
        }

        return null
    }, [])

    return {
        squares,
        message,
        player,
        resetting,
        handleClick,
        reset
    }
}