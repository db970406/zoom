import "dotenv/config"
import express from "express"

const app = express()

console.log("hello")

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`))