import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const TOKEN_KEY = "lkjsdbfbskjhskbfjhdfjdfsq332 ";

const app = express();
const port = 3000;

app.use(express.json());

const productsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "User" },
});

const ProductModel = mongoose.model("productssss", productsSchema);

app.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, TOKEN_KEY);
    if (decoded.role === "Admin") {
      const products = await ProductModel.find({});
      return res.send(products);
    }
    res.status(401).send({ message: "You dont have permission" });
  } catch (error) {
    res.status(403).send({ message: "Token is not valid!!!" });
  }
});


app.post("/", async (req, res) => {
  const { email, password } = req.body;
  const product = new ProductModel({ email: email, password: password });
  await product.save();
  res.send(product);
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const products = await ProductModel.findByIdAndUpdate(id, {
    email,
    password,
  });

  res.send(products);
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const products = await ProductModel.findByIdAndDelete(id);
  res.send(products);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const product = new ProductModel({ email, password });
  await product.save();
  res.send(product);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await ProductModel.findOne({ email: email });

  if (!user) {
    return res.status(404).send({ message: "email is not found" });
  }
  if (user.password !== password) {
    return res.status(403).send({ message: "Password is wrong" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    TOKEN_KEY
  );

  res.status(200).json({ accessToken: token });
});
mongoose
  .connect("mongodb+srv://yusif:yusif@yusif.fup3let.mongodb.net/")
  .then(() => console.log("Connected!"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
