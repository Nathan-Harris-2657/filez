import express from "express";
import { createFile } from "#db/queries/files";
import { getFolderByIdIncludingFiles, getFolders } from "#db/queries/folders";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const folders = await getFolders();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve folders." });
  }
});


router.param("id", async (req, res, next, id) => {
  try {
    const folder = await getFolderByIdIncludingFiles(id);
    if (!folder) return res.status(404).json({ error: "Folder not found." });

    req.folder = folder;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error loading folder." });
  }
});


router.get("/:id", (req, res) => {
  res.json(req.folder);
});


router.post("/:id/files", async (req, res) => {
  const { name, size } = req.body;

  if (!name || !size) {
    return res.status(400).json({
      error: "Missing required fields: name and size",
    });
  }

  try {
    const file = await createFile(name, size, req.folder.id);
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: "Failed to create file." });
  }
});

export default router;