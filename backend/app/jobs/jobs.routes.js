import express from "express";
import { createJob, getJobs, updateJob } from "./jobs.controller.js";

const router = express.Router();

router.post("/", createJob);
router.get("/", getJobs);
router.put("/:id", updateJob);

export default router;