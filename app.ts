import express from "express";
import db from "./db";
import authRouter from "./routes/auth";
const app = express();
const port = parseInt(`${process.env.PORT}`);

app.use(express.json());
app.use(authRouter);

db.sync()
  .then(() => {
    console.log(`Concectado com o banco ${process.env.DB_NAME}`);
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}!`);
    });
  });
