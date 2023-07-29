import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore'
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

    const getPlayingNow = async () => {
        const playingNowDoc = doc(gameRef, 'players')
        const snapshot = await getDoc(playingNowDoc)
        const datas = []
        snapshot.data().playingNow
        const player1 = doc(playersRef, snapshot.data().playingNow[0].toString())
        const player2 = doc(playersRef, snapshot.data().playingNow[1].toString())
        const playerSnap1 = await getDoc(player1)
        const playerSnap2 = await getDoc(player2)
        datas.push(playerSnap1.data())
        datas.push(playerSnap2.data())

        return datas
    }

    return {
        getPlayers,
        getPlayingNow
    }
}