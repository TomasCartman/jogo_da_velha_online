import repository from "@/services/repository"

export default async function handler(req, res) {
    const { updateMessage } = repository()

    if(req.method === "POST") {
        const { message } = req.body
        const resp = await updateMessage(message)
        res.status(200).json(resp)
    }
}