import connection from "../connection.js"
// import { posts } from "../data/post.js";
import CustomError from "../class/customError.js";  

// const { post } = require("../routers/posts.js");

function index(req, res) {
  const sql = "SELECT * FROM blog_db.posts"
  connection.query(sql, (err, results) => {
    if(err) return res.status(500).json({ error: "Database query failed" });
    let data = results;
    const response = {
      totalCount: results.length,
      data,
    };
    res.json(response);
  });
}

function show(req, res) {
  const id = parseInt(req.params.id);
  const sql = "SELECT * FROM blog_db.posts WHERE `id` = ?";
  connection.query(sql, [id], (err, results) => {
    if(err) return res.status(500).json({ error: "Database query failed"});
    const item = results[0];
    if(!item) {
      return res.status(404).json({ error: "L'elemento non esiste" });
    }
    res.json({ success: true, item });
  });
}

function store(req, res) {
  // res.send("Creazione nuovo post");
  let newid = 0;
  for(let i = 0; i < posts.length; i++) {
    if(posts[i].id > newid) {
      newid = posts[i].id
    }
  }
  newid += 1;

  const newPost = {
    id: newid,
    ...req.body,
    // titolo: req.body.titolo,
    // contenuto: req.body.contenuto,
    // immagine: req.body.immagine,
    // tags: req.body.tags
  };

  posts.push(newPost);
  res.status(201).json(newPost);
}

function update(req, res) {
  const id = parseInt(req.params.id);
  const item = posts.find((item) => item.id === id);
  if (item) {
    res.send(`Modifica integrale del post ${id}`);
    for(key in item) {
      if(key !== "id") {
        item[key] = req.body[key];
      }
    }
    res.json(item);
  } else {
    res.status(404);
    res.json({
      success: false,
      message: `Il post ${id} non esiste`,
    });
  }
}

function modify(req, res) {
  const id = parseInt(req.params.id);
  const item = posts.find((item) => item.id === id);
  if (item) {
    res.send(`Modifica parziale del post ${id}`);
  } else {
    res.status(404);
    res.json({
      success: false,
      message: `Il post ${id} non esiste`,
    });
  }
}

function destroy(req, res) {
  const id = parseInt(req.params.id);
  const index = posts.findIndex((item) => item.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404);
    res.json({
      error: "404",
      message: "Post non trovato",
    });
  }
}

export { index, show, store, update, modify, destroy };