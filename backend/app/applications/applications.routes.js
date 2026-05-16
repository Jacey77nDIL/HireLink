import express from "express";
import {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplications,
  updateStatus,
} from "./applications.controller.js";
import { protect, restrictTo } from "../core/middleware.js";
import {
  applyForJobValidator,
  patchStatusValidator,
} from "../core/validators.js";

const router = express.Router();

// ─── Jobseeker Only Routes ────────────────────────────────────
router.get("/", protect, restrictTo("jobseeker"), getMyApplications);
router.get("/me", protect, restrictTo("jobseeker"), getMyApplications);
router.post("/:jobId", protect, restrictTo("jobseeker"), applyForJobValidator, applyForJob);
router.delete("/:id", protect, restrictTo("jobseeker"), withdrawApplication);

// ─── Employer Only Routes ─────────────────────────────────────
router.get("/job/:job_id", protect, restrictTo("employer"), getJobApplications);
router.patch("/:id/status", protect, restrictTo("employer"), patchStatusValidator, updateStatus);

export default router;