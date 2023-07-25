"use client"

import { useState } from "react"

import Square from "@/components/square/Square"

export default function SquareParent() {
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [message, setMessage] = useState('Próximo jogador:')
    const [player, setPlayer] = useState('X')

    function reset() {
        console.log('Resetting in 6s')
        setTimeout(() => {
            setSquares(Array(9).fill(null))
            setMessage('Próximo jogador:')
            setPlayer('X')
        }, 6000)
    }

    function handleClick(pos) {
        const squaresArray = [...squares]
        if (squaresArray[pos] || calculateWinner(squaresArray)) return
        squaresArray[pos] = player
        setSquares(squaresArray)
        if(calculateWinner(squaresArray)) return
        setPlayer(player === 'X' ? 'O' : 'X')
    }

    function calculateWinner(squares) {
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
                reset()
                return squares[a]
            }
        }

        let over = true
        squares.forEach( square => {
            if(square === null) over = false
        })
        if(over) {
            setMessage('Empate')
            setPlayer('')
            reset()
            return true
        }

        return null
    }

    return (
        <div className={`
            flex justify-center items-center flex-col gap-8
            h-screen
        `}>
            <div className="flex text-3xl text-white">
                <span>{message}</span>
                &nbsp;
                <span className={`font-black ${player === 'X' ? 'text-red-500' : 'text-green-400'}`}>{player}</span>
            </div>
            <div className={`
                grid grid-cols-3 grid-rows-3 gap-5

        `}>
                <Square onClick={() => handleClick(0)} value={squares[0]} />
                <Square onClick={() => handleClick(1)} value={squares[1]} />
                <Square onClick={() => handleClick(2)} value={squares[2]} />
                <Square onClick={() => handleClick(3)} value={squares[3]} />
                <Square onClick={() => handleClick(4)} value={squares[4]} />
                <Square onClick={() => handleClick(5)} value={squares[5]} />
                <Square onClick={() => handleClick(6)} value={squares[6]} />
                <Square onClick={() => handleClick(7)} value={squares[7]} />
                <Square onClick={() => handleClick(8)} value={squares[8]} />
            </div>
        </div>
    )
}