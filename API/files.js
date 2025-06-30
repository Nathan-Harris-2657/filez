import express from "express";
import { getFilesIncludingFolderName } from "#db/queries/files";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const files = await getFilesIncludingFolderName();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve files." });
  }
});

export default router;
