"use client"

import axios from "axios"
import { getFirestore, doc, onSnapshot, collection } from 'firebase/firestore'

import Square from "@/components/Square"
import useTicTacToe from "@/hooks/useTicTacToe"
import useSettings from "@/hooks/useSettings"
import Messages from "@/components/Messages"
import app from '@/backend/index'
import PlayingNowBox from "@/components/PlayingNowBox"
import Button from "@/components/Button"
import { useEffect, useState } from "react"


export default function SquareParent() {
    const { squares, message, player, status, handleClick, reset } = useTicTacToe()
    const { name, clearLocalInfo, addPlayerPlayingNow, getId, getPlayerInfo } = useSettings()
    const [players, setPlayers] = useState([])
    const firestore = getFirestore(app)
    const gameRef = collection(firestore, 'game')

    useEffect(() => {
        const id = getId()
        if (id !== 0) {
            addPlayerPlayingNow(getId())
                .then(resp => console.log(resp))
        }
        
        getPlayersPlayingNow()
    }, [])

    function getPlayersPlayingNow() {
        onSnapshot(doc(gameRef, 'players'), (doc) => {
            const resp = doc.data()
            if (resp) {
                console.log(resp.playingNow)
                setPlayers(players => [])
                if (resp.playingNow[0]) {
                    getPlayerInfo(resp.playingNow[0])
                        .then(res => res.data)
                        .then(res => addNewPlayer(res))
                }
                if (resp.playingNow[1]) {
                    getPlayerInfo(resp.playingNow[1])
                        .then(res => res.data)
                        .then(res => addNewPlayer(res))
                }
            }
        })
    }

    function addNewPlayer(player) {
        setPlayers(newPlayers =>  [...newPlayers, player])
    }

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
            w-5/5
            lg:w-2/5 h-full 
            
        `}>
            <div className="grow-2 mt-12">
                <PlayingNowBox players={players} />
            </div>
            <div className="flex text-3xl text-white">
                <Messages message={message} player={player} playerName={name} />
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
                {status === 'end' && <Button text='Reiniciar' onClick={reset} />}
            </div>
            <button onClick={clearLocalInfo}>Resetar id</button>
        </div>
    )
}