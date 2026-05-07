import {
  findUserById,
  updateUserById,
  deleteUserById,
  getJobseekerProfile,
  updateJobseekerProfile,
  getEmployerProfile,
  updateEmployerProfile,
} from "./users.model.js";

// GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile;

    if (req.user.role === "jobseeker") {
      profile = await getJobseekerProfile(userId);
    } else if (req.user.role === "employer") {
      profile = await getEmployerProfile(userId);
    } else {
      profile = await findUserById(userId);
    }

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: profile });
  } catch (error) {
    console.error("Get me error:", error.message);
    res.status(500).json({ message: "Server error getting profile" });
  }
};

// PUT /api/users/me
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, ...profileFields } = req.body;

    // Update base user info if provided
    if (name || email) {
      await updateUserById(
        userId,
        name || req.user.name,
        email || req.user.email
      );
    }

    // Update profile based on role
    let updatedProfile;
    if (req.user.role === "jobseeker") {
      updatedProfile = await updateJobseekerProfile(userId, profileFields);
    } else if (req.user.role === "employer") {
      updatedProfile = await updateEmployerProfile(userId, profileFields);
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update me error:", error.message);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// DELETE /api/users/me
export const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id;

    await deleteUserById(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete me error:", error.message);
    res.status(500).json({ message: "Server error deleting account" });
  }
};