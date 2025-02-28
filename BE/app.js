const express = require("express");
const app = express();
const cors = require("cors");

const mainRoutes = require("./src/routes/routes");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    service: "Backend Project Starter Kit",
  });
});

app.use("/api/", mainRoutes);

app.get("*", (req, res) => {
  res.redirect("/api/error");
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(
    `Backend is Running on PORT: ${PORT}. ${
      process.env.DEV == "TRUE" ? "<Development Mode>" : ""
    }`
  );
});
