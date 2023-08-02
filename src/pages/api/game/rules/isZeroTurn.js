import repository from "@/services/repository"

export default async function handler(req, res) {
    const { updateIsZeroTurn } = repository()

    if(req.method === "POST") {
        const { turn } = req.body
        const resp = await updateIsZeroTurn(turn)
        res.status(200).json(resp)
    }
}