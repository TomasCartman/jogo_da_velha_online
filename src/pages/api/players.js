import repository from "@/services/repository"

export default async function handler(req, res) {
    const { addPlayer, getPlayerInfo } = repository()

    if(req.method === "GET") {
        console.log(req.param)
        const id  = req.query.id
        const player = await getPlayerInfo(id)
        res.status(200).json(player)
    } 
    else if(req.method === "POST") {
        const player = req.body
        const playerResponse = await addPlayer(player)
        res.status(200).json(playerResponse)
    }
}