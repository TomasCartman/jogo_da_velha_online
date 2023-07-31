import repository from "@/services/repository"

export default async function handler(req, res) {
    const { updateBoard } = repository()

    if(req.method === "POST") {
        const { newBoard } = req.body
        const resp = await updateBoard(newBoard)
        res.status(200).json(resp)
    }
}