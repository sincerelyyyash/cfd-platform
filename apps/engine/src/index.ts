import Express from "express";

const PORT = process.env.PORT ?? 3001
const app = Express();

app.use(Express.json());


app.listen(PORT, () => {
  console.log("Server running on port: " + PORT)
})


