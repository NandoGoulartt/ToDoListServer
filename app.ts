import express from "express";
import db from "./db";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import taskRouter from "./routes/tasks";
const cors = require('cors');

const app = express();
const port = parseInt(`${process.env.PORT}`);
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(usersRouter);
app.use(taskRouter);

db.sync()
  .then(() => {
    console.log(`Concectado com o banco ${process.env.DB_NAME}`);
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}!`);
    });
  });
