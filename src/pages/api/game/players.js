import repository from "@/services/repository"

export default async function handler(req, res) {
    const { getPlayingNow } = repository()

    if(req.method === "GET") {
        const players = await getPlayingNow()
        res.status(200).json(players)
    }
}