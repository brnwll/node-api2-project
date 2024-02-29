// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch(() => {
      const message = "The posts information could not be retrieved";
      res.status(500).json({ message });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        const message = "The post with the specified ID does not exist";
        res.status(404).json({ message });
      }
    })
    .catch(() => {
      const message = "The post information could not be retrieved";
      res.status(500).json({ message });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    const message = "Please provide title and contents for the post";
    res.status(400).json({ message });
  } else {
    Posts.insert({ title, contents })
      .then(async (post) => {
        const updatedPost = await Posts.findById(post.id);
        res.status(201).json(updatedPost);
      })
      .catch(() => {
        const message =
          "There was an error while saving the post to the database";
        res.status(500).json({ message });
      });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents) {
    const message = "Please provide title and contents for the post";
    res.status(400).json({ message });
  } else {
    Posts.update(id, { title, contents }).then(async (post) => {
      if (post) {
        const updatedPost = await Posts.findById(id);
        res.status(200).json(updatedPost);
      } else {
        const message = "The post with the specified ID does not exist";
        res.status(404).json({ message });
      }
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const postToRemove = await Posts.findById(id);
  Posts.remove(id)
    .then((post) => {
      if (post) {
        res.status(200).json(postToRemove);
      } else {
        const message = "The post with the specified ID does not exist";
        res.status(404).json({ message });
      }
    })
    .catch(() => {
      const message = "The post could not be removed";
      res.status(500).json({ message });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findPostComments(id)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200).json(comments);
      } else {
        const message = "The post with the specified ID does not exist";
        res.status(404).json({ message });
      }
    })
    .catch(() => {
      const message = "The comments information could not be retrieved";
      res.status(500).json({ message });
    });
});

module.exports = router;
