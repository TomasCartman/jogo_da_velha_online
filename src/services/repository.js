import { getFirestore, collection, getDocs, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import app from '@/backend/index'

export default function repository() {
    const firestore = getFirestore(app)
    const gameRef = collection(firestore, 'game')
    const playersRef = collection(firestore, 'players')

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
        const playingNowDoc = doc(gameRef, 'players')
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
        })
    }

    const addPlayerPlayingNow = async playerId => {
        const playingNow = await getPlayingNow()
        const pnLength = Object.keys(playingNow).length
        const playerDoc = doc(gameRef, 'players')
        const data = {}

        if (pnLength === 0) {
            setDoc(playerDoc, {
                'playingNow': { 0: playerId }
            })
            data.status = 200
            return data
        } else if (pnLength === 1) {
            if (playingNow[0] !== playerId) {
                setDoc(playerDoc, {
                    'playingNow': { 1: playerId }
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
        updateBoard
    }
}