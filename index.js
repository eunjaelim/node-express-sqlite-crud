const { Sequelize, DataTypes, Model } = require("sequelize");

var express = require("express");
var app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const Comments = sequelize.define(
  "Comments",
  {
    // Model attributes are defined here
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  }
);

(async () => {
  await Comments.sync();
  console.log("All models were synchronized successfully.");
})();

// set the view engine to ejs
app.set("view engine", "ejs");

// Read
app.get("/", async function (req, res) {
  const comments = await Comments.findAll();
  res.render("index", { comments: comments });
});

app.post("/create", async function (req, res) {
  const { content } = req.body;
  // Create
  await Comments.create({ content: content });

  res.redirect("/");
});

app.post("/update/:id", async function (req, res) {
  const { content } = req.body;
  const { id } = req.params;

  // update
  await Comments.update(
    { content: content },
    {
      where: {
        id: id,
      },
    }
  );

  res.redirect("/");
});

app.post("/delete/:id", async function (req, res) {
  const { id } = req.params;

  // delete
  await Comments.destroy({
    where: {
      id: id,
    },
  });

  res.redirect("/");
});
app.listen(3000);
console.log("Server is listening on port 3000");
