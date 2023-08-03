import repository from "@/services/repository"

export default async function handler(req, res) {
    const { resetPlayersPlayingNow } = repository()
    
    if (req.method === "POST") {
        const resp = await resetPlayersPlayingNow()
        res.status(200).json(resp)
    }
}