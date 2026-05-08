import pool from "../core/db.js";

// Create a new job listing
export const createJob = async (employerId, fields) => {
  const { title, description, location, industry, salary, salary_min, salary_max, job_type, deadline } = fields;
  const result = await pool.query(
    `INSERT INTO jobs (employer_id, title, description, location, industry, salary, salary_min, salary_max, job_type, deadline)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [employerId, title, description, location, industry, salary, salary_min, salary_max, job_type, deadline]
  );
  return result.rows[0];
};

// Get all jobs
export const findAllJobs = async () => {
  const result = await pool.query(
    `SELECT j.*, u.name AS employer_name
     FROM jobs j
     JOIN users u ON j.employer_id = u.id
     ORDER BY j.created_at DESC`
  );
  return result.rows;
};

// Get a single job by id
export const findJobById = async (id) => {
  const result = await pool.query(
    `SELECT j.*, u.name AS employer_name
     FROM jobs j
     JOIN users u ON j.employer_id = u.id
     WHERE j.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update a job listing
export const updateJobById = async (id, fields) => {
  const { title, description, location, industry, salary, salary_min, salary_max, job_type, deadline } = fields;
  const result = await pool.query(
    `UPDATE jobs
     SET title = $1, description = $2, location = $3, industry = $4,
         salary = $5, salary_min = $6, salary_max = $7, job_type = $8,
         deadline = $9, updated_at = CURRENT_TIMESTAMP
     WHERE id = $10
     RETURNING *`,
    [title, description, location, industry, salary, salary_min, salary_max, job_type, deadline, id]
  );
  return result.rows[0];
};

// Delete a job listing
export const deleteJobById = async (id) => {
  await pool.query(`DELETE FROM jobs WHERE id = $1`, [id]);
};

// Search and filter jobs by title, location, salary range, and optional filters
export const searchJobs = async (filters) => {
  const { title, keyword, location, industry, job_type, min_salary, max_salary } = filters;
  const titleFilter = title || keyword;

  let query = `
    SELECT j.*, u.name AS employer_name
    FROM jobs j
    JOIN users u ON j.employer_id = u.id
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  if (titleFilter) {
    query += ` AND j.title ILIKE $${count}`;
    values.push(`%${titleFilter}%`);
    count++;
  }

  if (location) {
    query += ` AND j.location ILIKE $${count}`;
    values.push(`%${location}%`);
    count++;
  }

  if (industry) {
    query += ` AND j.industry ILIKE $${count}`;
    values.push(`%${industry}%`);
    count++;
  }

  if (job_type) {
    query += ` AND j.job_type = $${count}`;
    values.push(job_type);
    count++;
  }

  if (min_salary != null) {
    query += ` AND j.salary_min IS NOT NULL AND COALESCE(j.salary_max, j.salary_min) >= $${count}`;
    values.push(min_salary);
    count++;
  }

  if (max_salary != null) {
    query += ` AND j.salary_min IS NOT NULL AND j.salary_min <= $${count}`;
    values.push(max_salary);
    count++;
  }

  query += ` ORDER BY j.created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};