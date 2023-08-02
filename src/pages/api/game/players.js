import repository from "@/services/repository"

export default async function handler(req, res) {
    const { addPlayerPlayingNow } = repository()
    
    if (req.method === "POST") {
        const { id } = req.body
        const resp = await addPlayerPlayingNow(id)
        res.status(200).json(resp)
    }
}