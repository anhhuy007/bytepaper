import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Chuyển đối tượng thành chuỗi JSON
app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
