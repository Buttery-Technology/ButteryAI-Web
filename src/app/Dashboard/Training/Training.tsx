import { useState, useEffect, useCallback } from "react";
import { useTrainingAPI, type TrainingJob } from "@hooks";
import NewJobForm from "./NewJobForm";
import JobDetail from "./JobDetail";
import styles from "./Training.module.scss";

export const Training = () => {
  const { fetchJobs, cancelJob, loading, error } = useTrainingAPI();
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const loadJobs = useCallback(async () => {
    const result = await fetchJobs();
    setJobs(result);
  }, [fetchJobs]);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 10000);
    return () => clearInterval(interval);
  }, [loadJobs]);

  const handleCancel = async (id: string) => {
    const ok = await cancelJob(id);
    if (ok) loadJobs();
  };

  const handleJobCreated = () => {
    setShowNewForm(false);
    loadJobs();
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  const statusColor = (status: string) => {
    switch (status) {
      case "training":
        return "#288ed2";
      case "completed":
        return "#0f9b81";
      case "failed":
      case "cancelled":
        return "#e74c3c";
      case "provisioning":
      case "uploading_data":
        return "#f39c12";
      default:
        return "#637684";
    }
  };

  const formatDuration = (startStr: string | null, endStr: string | null) => {
    if (!startStr) return "--";
    const start = new Date(startStr).getTime();
    const end = endStr ? new Date(endStr).getTime() : Date.now();
    const mins = Math.floor((end - start) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  if (selectedJob) {
    return (
      <JobDetail
        job={selectedJob}
        onBack={() => setSelectedJobId(null)}
        onCancel={handleCancel}
        onRefresh={loadJobs}
      />
    );
  }

  if (showNewForm) {
    return (
      <NewJobForm
        onCancel={() => setShowNewForm(false)}
        onCreated={handleJobCreated}
      />
    );
  }

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Training Jobs</h2>
        <button className={styles.newButton} onClick={() => setShowNewForm(true)}>
          New Training Job
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && jobs.length === 0 ? (
        <p className={styles.empty}>Loading...</p>
      ) : jobs.length === 0 ? (
        <p className={styles.empty}>No training jobs yet. Create one to get started.</p>
      ) : (
        <div className={styles.jobList}>
          {jobs.map((job) => (
            <button
              key={job.id}
              className={styles.jobCard}
              onClick={() => setSelectedJobId(job.id)}
            >
              <div className={styles.jobHeader}>
                <span className={styles.jobModel}>{job.modelName}</span>
                <span
                  className={styles.jobStatus}
                  style={{ color: statusColor(job.status) }}
                >
                  {job.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className={styles.jobMeta}>
                <span>{job.nodeCount} node{job.nodeCount > 1 ? "s" : ""}</span>
                <span>{job.computeBackend.toUpperCase()}</span>
                <span>{formatDuration(job.startedAt, job.completedAt)}</span>
              </div>
              {job.status === "training" && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${job.totalSteps > 0 ? (job.currentStep / job.totalSteps) * 100 : 0}%`,
                    }}
                  />
                </div>
              )}
              {job.currentLoss !== null && (
                <p className={styles.jobLoss}>
                  Step {job.currentStep}/{job.totalSteps} &mdash; Loss: {job.currentLoss.toFixed(4)}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Training;
