import { getFirestore, collection, getDocs, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import app from '@/backend/index'

export default function repository() {
    const firestore = getFirestore(app)
    const gameRef = collection(firestore, 'game')
    const playersRef = collection(firestore, 'players')
    const data = { status: 200 }

    const getPlayers = async () => {
        const playersDoc = doc(playersRef, 'players')
        const snapshot = await getDoc(playersDoc)
        const data = {
            ...snapshot.data()
        }
        return data
    }

    const getPlayerInfo = async id => {
        const player = doc(playersRef, id.toString())
        const playerSnap = await getDoc(player)
        return playerSnap.data()
    }

    const getPlayersPlayingNow = async () => {
        const playingNowDoc = doc(gameRef, 'players')
        const snapshot = await getDoc(playingNowDoc)
        const datas = []
        snapshot.data().playingNow
        if (snapshot.data().playingNow[0]) {
            const player1 = doc(playersRef, snapshot.data().playingNow[0].toString())
            const playerSnap1 = await getDoc(player1)
            datas.push(playerSnap1.data())
        }
        if (snapshot.data().playingNow[1]) {
            const player2 = doc(playersRef, snapshot.data().playingNow[1].toString())
            const playerSnap2 = await getDoc(player2)
            datas.push(playerSnap2.data())
        }

        return datas
    }

    const getPlayingNow = async () => {
        const playingNowDoc = doc(gameRef, 'rules')
        const snapshot = await getDoc(playingNowDoc)
        const data = snapshot.data().playingNow

        return data
    }

    const resetPlayersPlayingNow = async () => {

    }

    const updateBoard = async newBoard => {
        const rulesDoc = doc(gameRef, 'rules')
        setDoc(rulesDoc, {
            'gameSquares': newBoard
        }, { merge: true })
        return data
    }

    const updateIsZeroTurn = async turn => {
        const rulesDoc = doc(gameRef, 'rules')
        setDoc(rulesDoc, {
            'isZeroTurn': turn
        }, { merge: true })
        return data
    }

    const updateMessage = async message => {
        const rulesDoc = doc(gameRef, 'rules')
        setDoc(rulesDoc, {
            'message': message
        }, { merge: true })
        return data
    }

    const updateStatus = async status => {
        const rulesDoc = doc(gameRef, 'rules')
        setDoc(rulesDoc, {
            'status': status
        }, { merge: true })
        return data
    }

    const updateTurn = async turnId => {
        const rulesDoc = doc(gameRef, 'rules')
        setDoc(rulesDoc, {
            'turn': turnId
        }, { merge: true })
        return data
    }

    const addPlayerPlayingNow = async playerId => {
        const playingNow = await getPlayingNow()
        const pnLength = Object.keys(playingNow).length
        const rulesDoc = doc(gameRef, 'rules')
        const data = {}

        if (pnLength === 0) {
            setDoc(rulesDoc, {
                'playingNow': [ playerId ]
            }, { merge: true })
            data.status = 200
            return data
        } else if (pnLength === 1) {
            if (playingNow[0] !== playerId) {
                setDoc(rulesDoc, {
                    'playingNow': [...playingNow, playerId]
                }, { merge: true })
                data.status = 200
                return data
            } else {
                data.status = 400
                return data
            }
        } else {
            data.status = 400
            return data
        }
    }

    const addPlayer = async player => {
        const data = {}
        const playerDoc = doc(playersRef, player.id.toString())
        setDoc(playerDoc, player)
        data.status = 200

        return data
    }

    const onPlayersPlayingSnapshot = onSnapshot(doc(gameRef, 'players'), (doc) => {
        doc.data()
    })

    return {
        getPlayersPlayingNow,
        addPlayerPlayingNow,
        getPlayingNow,
        addPlayer,
        onPlayersPlayingSnapshot,
        getPlayerInfo,
        updateBoard,
        updateIsZeroTurn,
        updateMessage,
        updateStatus,
        updateTurn,
        gameRef,
        playersRef
    }
}