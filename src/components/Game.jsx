"use client"

import Square from "@/components/Square"
import useTicTacToe from "@/hooks/useTicTacToe"
import useSettings from "@/hooks/useSettings"
import Messages from "@/components/Messages"
import PlayingNowBox from "@/components/PlayingNowBox"
import Button from "@/components/Button"
import { useEffect, useState } from "react"

export default function Game() {
    const { squares, status, isZeroTurn, players, turn, handleClick, reset } = useTicTacToe()
    const { clearLocalInfo, addPlayerPlayingNow, getId, getName } = useSettings()
    const [name, setName] = useState('')

    useEffect(() => {
        addPlayerPlayingNow(getId())
    }, [])

    useEffect(() => {
        if (players.length > 0) {
            setPlayerToPlayName(turn)
        }
    }, [players])

    function squareClick(index) {
        if (turn === getId()) {
            handleClick(index)
        }
    }

    function setPlayerToPlayName(id) {
        const player = players.find(p => p.id === id)
        if (player !== undefined) setName(player.name)  
    }

    function renderSquares() {
        return squares.map((square, index) => {
            return <Square
                key={`square${index}`}
                onClick={() => squareClick(index)}
                value={square} />
        })
    }

    return (
        <div className={`
            flex justify-center items-center flex-col gap-8
            w-5/5
            lg:w-2/5 h-full 
        `}>
            <div className="grow-2 mt-12">
                <PlayingNowBox players={players} />
            </div>
            <div className="flex text-3xl text-white">
                <Messages playerName={name} status={status} isZeroTurn={isZeroTurn} />
            </div>
            <div className="grow-3">
                <div className={`
                grid grid-cols-3 grid-rows-3 gap-2
                lg:gap-5
                `}>
                    {renderSquares()}
                </div>
            </div>
            <div className="grow-3">
                {(status === 'end' || status === 'draw') && <Button text='Reiniciar' onClick={reset} />}
            </div>
            <button onClick={clearLocalInfo}>Resetar id</button>
        </div>
    )
}