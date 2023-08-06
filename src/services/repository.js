import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import app from '@/backend/index'

export default function repository() {
    const firestore = getFirestore(app)
    const gameRef = collection(firestore, 'game')
    const playersRef = collection(firestore, 'players')

    const getPlayerInfo = async id => {
        const player = doc(playersRef, id.toString())
        const playerSnap = await getDoc(player)
        return playerSnap.data()
    }

    const getPlayingNow = async () => {
        const playingNowDoc = doc(gameRef, 'playingNow')
        const snapshot = await getDoc(playingNowDoc)
        const data = snapshot.data().playingNow
        return data
    }

    const resetPlayersPlayingNow = async () => {
        const rulesDoc = doc(gameRef, 'playingNow')
        setDoc(rulesDoc, {
            'playingNow': []
        }, { merge: true })
    }

    const updateBoard = async newBoard => {
        const rulesDoc = doc(gameRef, 'gameSquares')
        setDoc(rulesDoc, {
            'gameSquares': newBoard
        }, { merge: true })
    }

    const updateIsZeroTurn = async isZeroDown => {
        const rulesDoc = doc(gameRef, 'isZeroTurn')
        setDoc(rulesDoc, {
            'isZeroTurn': isZeroDown
        }, { merge: true })
    }

    const updateMessage = async message => {
        const rulesDoc = doc(gameRef, 'message')
        setDoc(rulesDoc, {
            'message': message
        }, { merge: true })
    }

    const updateStatus = async status => {
        const rulesDoc = doc(gameRef, 'status')
        setDoc(rulesDoc, {
            'status': status
        }, { merge: true })
    }

    const updateTurn = async turnId => {
        const rulesDoc = doc(gameRef, 'turn')
        setDoc(rulesDoc, {
            'turn': turnId
        }, { merge: true })
    }

    const updateTimestamp = async time => {
        const rulesDoc = doc(gameRef, 'time')
        setDoc(rulesDoc, {
            'time': time
        }, { merge: true })
    }

    const addPlayerPlayingNow = async playerId => {
        const playingNow = await getPlayingNow()
        const pnLength = Object.keys(playingNow).length

        if (pnLength === 0) {
            return addPlayerIfNoOneIsPlaying(playerId)
        } else if (pnLength === 1 && playingNow[0] !== playerId) {
            return addPlayerIfHasOnePlayerPlaying(playerId, playingNow)
        }
    }

    const addPlayerIfNoOneIsPlaying = playerId => {
        const rulesDoc = doc(gameRef, 'playingNow')
        setDoc(rulesDoc, {
            'playingNow': [playerId]
        }, { merge: true })
    }

    const addPlayerIfHasOnePlayerPlaying = (playerId, playingNow) => {
        const rulesDoc = doc(gameRef, 'playingNow')
        setDoc(rulesDoc, {
            'playingNow': [...playingNow, playerId]
        }, { merge: true })
    }

    const addPlayer = async player => {
        const playerDoc = doc(playersRef, player.id.toString())
        setDoc(playerDoc, player)
    }

    return {
        addPlayerPlayingNow,
        getPlayingNow,
        addPlayer,
        getPlayerInfo,
        updateBoard,
        updateIsZeroTurn,
        updateMessage,
        updateStatus,
        updateTurn,
        resetPlayersPlayingNow,
        updateTimestamp,
        gameRef,
        playersRef
    }
}