"use client"

import Square from "@/components/Square"
import useTicTacToe from "@/hooks/useTicTacToe"
import useSettings from "@/hooks/useSettings"
import Messages from "@/components/Messages"
import PlayingNowBox from "@/components/PlayingNowBox"
import Button from "@/components/Button"
import { useEffect, useState } from "react"

export default function Game() {
    const { squares, status, isZeroTurn, players, turn, playingNowName, handleClick,
        setPlayerToPlayName, isPlayerPlaying, forceDraw } = useTicTacToe()
    const { clearLocalInfo, addPlayerPlayingNow, getId } = useSettings()
    const [showButtonPlayAgain, setShowButtonPlayAgain] = useState(false)

    useEffect(() => {
        addPlayerPlayingNow(getId())
    }, [])

    useEffect(() => {
        if (players.length > 0) {
            setPlayerToPlayName(turn)
        }
    }, [players])

    useEffect(() => {
        if (players.length > 0) {
            setPlayerToPlayName(turn)
        }
    }, [turn])

    useEffect(() => {
        if (status === 'end' || status === 'draw' || (status === 'waiting' && !isPlayerPlaying())) {
            setTimeout(() => {
                setShowButtonPlayAgain(true)
            }, 4000)
        }
    }, [status])

    function squareClick(index) {
        if (turn === getId()) {
            handleClick(index)
        }
    }

    function playAgain() {
        addPlayerPlayingNow(getId())
        setShowButtonPlayAgain(false)
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
            lg:w-3/5 h-full 
        `}>
            <div className="grow-1 mt-2 lg:grow-2 lg:mt-12">
                <PlayingNowBox players={players} />
            </div>
            <div className="flex text-3xl text-white">
                <Messages playerName={playingNowName} status={status} isZeroTurn={isZeroTurn} />
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
                {showButtonPlayAgain && <Button text='Jogar Novamente' onClick={playAgain} />}
            </div>
            <div className="flex gap-2">
                <button onClick={clearLocalInfo}>Resetar id</button>
                <button onClick={forceDraw}>Forçar empate</button>
            </div>
        </div>
    )
}