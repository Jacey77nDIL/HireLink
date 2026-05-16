import {
  createApplication,
  findApplication,
  findApplicationById,
  findApplicationsByJobseeker,
  findApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
} from "./applications.model.js";
import { findJobById } from "../jobs/jobs.model.js";
import { formatApplication, formatApplications } from "./applications.utils.js";

const getJobId = (req) => req.params.job_id || req.params.jobId;

// POST /api/apply/:job_id  |  POST /api/applications/:jobId
export const applyForJob = async (req, res) => {
  try {
    const jobId = getJobId(req);
    const userId = req.user.id;
    const { cover_letter } = req.body;

    const job = await findJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    const existingApplication = await findApplication(jobId, userId);
    if (existingApplication) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }

    const application = await createApplication(jobId, userId, cover_letter);

    res.status(201).json({
      message: "Application submitted successfully",
      application: formatApplication(application),
    });
  } catch (error) {
    console.error("Apply for job error:", error.message);
    res.status(500).json({ message: "Server error submitting application" });
  }
};

// GET /api/applications  |  GET /api/applications/me
export const getMyApplications = async (req, res) => {
  try {
    const applications = await findApplicationsByJobseeker(req.user.id);

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "You have not applied for any jobs yet" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      count: applications.length,
      applications: formatApplications(applications),
    });
  } catch (error) {
    console.error("Get my applications error:", error.message);
    res.status(500).json({ message: "Server error getting applications" });
  }
};

// DELETE /api/applications/:id
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.jobseeker_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to withdraw this application" });
    }

    if (application.status !== "applied") {
      return res.status(400).json({ message: "You can only withdraw an applied application" });
    }

    await deleteApplication(id);

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Withdraw application error:", error.message);
    res.status(500).json({ message: "Server error withdrawing application" });
  }
};

// GET /api/applications/job/:jobId
export const getJobApplications = async (req, res) => {
  try {
    const jobId = getJobId(req);
    const employerId = req.user.id;

    const job = await findJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    if (job.employer_id !== employerId) {
      return res.status(403).json({ message: "You are not authorized to view these applications" });
    }

    const applications = await findApplicationsByJob(jobId);

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      count: applications.length,
      applications: formatApplications(applications),
    });
  } catch (error) {
    console.error("Get job applications error:", error.message);
    res.status(500).json({ message: "Server error getting applications" });
  }
};

// PUT /api/applications/:id/status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = req.user.id;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["applied", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be applied, accepted or rejected" });
    }

    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await findJobById(application.job_id);
    if (job.employer_id !== employerId) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    const updatedApplication = await updateApplicationStatus(id, status);

    res.status(200).json({
      message: "Application status updated successfully",
      application: formatApplication(updatedApplication),
    });
  } catch (error) {
    console.error("Update application status error:", error.message);
    res.status(500).json({ message: "Server error updating application status" });
  }
};
