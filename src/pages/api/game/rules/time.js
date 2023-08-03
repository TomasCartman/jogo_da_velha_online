import repository from "@/services/repository"

export default async function handler(req, res) {
    const { updateTimestamp } = repository()

    if(req.method === "POST") {
        const { time } = req.body
        const resp = await updateTimestamp(time)
        res.status(200).json(resp)
    }
}