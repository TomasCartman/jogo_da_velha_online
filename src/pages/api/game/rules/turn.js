import repository from "@/services/repository"

export default async function handler(req, res) {
    const { updateTurn } = repository()

    if(req.method === "POST") {
        const { turnId } = req.body
        const resp = await updateTurn(turnId)
        res.status(200).json(resp)
    }
}