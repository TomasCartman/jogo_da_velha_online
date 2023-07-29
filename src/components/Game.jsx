"use client"

import axios from "axios"

import Square from "@/components/Square"
import useTicTacToe from "@/hooks/useTicTacToe"
import useSettings from "@/hooks/useSettings"
import Messages from "@/components/Messages"
import PlayingNowBox from "./PlayingNowBox"
import Button from "./Button"
import { useEffect, useState } from "react"

export default function SquareParent() {
    const { squares, message, player, status, handleClick, reset } = useTicTacToe()
    const { name, clearLocalInfo } = useSettings()
    const [players, setPlayers] = useState([])

    useEffect(() => {
        axios.get('/api/game/players')
            .then(data => data.data)
            .then(data => setPlayers(data))
    }, [])

    function renderSquares() {
        return squares.map((square, index) => {
            return <Square
                key={`square${index}`}
                onClick={() => handleClick(index)}
                value={square} />
        })
    }

    return (
        <div className={`
            flex justify-center items-center flex-col gap-8
            w-2/5 h-full
        `}>
            <div className="grow-2 mt-12">
                <PlayingNowBox players={players} />
            </div>
            <div className="flex text-3xl text-white">
                <Messages message={message} player={player} playerName={name} />
            </div>
            <div className="grow-3">
                <div className={`grid grid-cols-3 grid-rows-3 gap-5`}>
                    {renderSquares()}
                </div>
            </div>
            <div className="grow-3">
                {status === 'end' && <Button text='Reiniciar' onClick={reset} />}
            </div>
            <button onClick={clearLocalInfo}>Resetar id</button>
        </div>
    )
}