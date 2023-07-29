import { useCallback, useState } from "react"

export default function useTicTacToe() {
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [message, setMessage] = useState('Vez de: ')
    const [player, setPlayer] = useState('X')
    const [status, setStatus] = useState('playing')

    const reset = useCallback(() => {
        setSquares(Array(9).fill(null))
        setMessage('Vez de:')
        setPlayer('X')
        setStatus('playing')
    }, [])

    const handleClick = useCallback((pos) => {
        const squaresArray = [...squares]
        if (squaresArray[pos] || calculateWinner(squaresArray)) return
        squaresArray[pos] = player
        setSquares(squaresArray)
        if (calculateWinner(squaresArray)) return
        setPlayer(player === 'X' ? 'O' : 'X')
    }, [squares, player])


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

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                setMessage('Vencedor:')
                setPlayer(squares[a])
                setStatus('end')
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
            setStatus('end')
            return true
        }

        return null
    }

    return {
        squares,
        message,
        player,
        status,
        handleClick,
        reset
    }
}