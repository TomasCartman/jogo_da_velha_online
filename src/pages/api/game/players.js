import repository from "@/services/repository"

export default async function handler(req, res) {
    const { getPlayersPlayingNow, addPlayerPlayingNow, getPlayingNow, onPlayersPlayingSnapshot, playersPlayingNow } = repository()

    if(req.method === "GET") {
        //const players = await getPlayersPlayingNow()
        //res.status(200).json(players)
        console.log(req.query)
        const callback = req.query.callback
        const players = onPlayersPlayingSnapshot(callback)
        console.log(players)
        res.status(200).json(players)
    }
    else if(req.method === "POST") {
        const { id } = req.body
        const resp = await addPlayerPlayingNow(id)
        res.status(200).json(resp)
    }
}