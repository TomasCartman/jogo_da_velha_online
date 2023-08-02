import repository from "@/services/repository"

export default async function handler(req, res) {
    const { updateStatus } = repository()

    if(req.method === "POST") {
        const { status } = req.body
        const resp = await updateStatus(status)
        res.status(200).json(resp)
    }
}