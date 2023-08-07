"use client"

import Square from "@/components/Square"
import useTicTacToe from "@/hooks/useTicTacToe"
import useSettings from "@/hooks/useSettings"
import Messages from "@/components/Messages"
import PlayingNowBox from "@/components/PlayingNowBox"
import Button from "@/components/Button"

export default function Game() {
    const { serverSquares, status, isZeroTurn, players, turnId, playingNowName, showButtonPlayAgain,
        handleClick, forceDraw, addPlayerIfValidLocalId } = useTicTacToe()
    const { clearLocalInfo, getLocalId } = useSettings()

    function squareClick(index) {
        if (turnId === getLocalId()) {
            handleClick(index)
        }
    }

    function playAgain() {
        addPlayerIfValidLocalId()
    }

    function renderSquares() {
        return serverSquares.map((square, index) => {
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