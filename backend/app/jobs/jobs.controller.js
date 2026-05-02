export const createJob = (req, res) => {
  const { title, company, description } = req.body;

  res.status(201).json({
    message: "Job created",
    job: { title, company, description }
  });
};

export const updateJob = (req, res) => {
  const { id } = req.params;
  const { title, company, description } = req.body;

  res.json({
    message: "Job updated",
    job: { id, title, company, description }
  });
};

export const getJobs = (req, res) => {
  res.json({
    message: "All jobs",
    jobs: []
  });
};