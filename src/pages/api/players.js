import repository from "@/services/repository"

export default async function handler(req, res) {
    const { getPlayers } = repository()

    if(req.method === "GET") {
        const players = await getPlayers()
        res.status(200).json(players)
    }
}