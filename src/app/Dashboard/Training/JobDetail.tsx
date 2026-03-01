import { useCallback } from "react";
import { useTrainingSSE, type TrainingProgressEvent, type TrainingJob } from "@hooks";
import styles from "./JobDetail.module.scss";

interface Props {
  job: TrainingJob;
  onBack: () => void;
  onCancel: (id: string) => void;
  onRefresh: () => void;
}

const isTerminal = (status: string) =>
  ["completed", "failed", "cancelled", "terminated"].includes(status);

export const JobDetail = ({ job, onBack, onCancel, onRefresh }: Props) => {
  const handleEvent = useCallback(
    (_event: TrainingProgressEvent) => {
      onRefresh();
    },
    [onRefresh]
  );

  const handleDone = useCallback(
    (_status: string) => {
      onRefresh();
    },
    [onRefresh]
  );

  const { connected, lossHistory } = useTrainingSSE({
    jobId: isTerminal(job.status) ? null : job.id,
    onEvent: handleEvent,
    onDone: handleDone,
  });

  const progress =
    job.totalSteps > 0 ? ((job.currentStep / job.totalSteps) * 100).toFixed(1) : "0";

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

  // Simple SVG loss chart
  const renderLossChart = () => {
    if (lossHistory.length < 2) return null;

    const width = 600;
    const height = 200;
    const padding = 40;

    const steps = lossHistory.map((p) => p.step);
    const losses = lossHistory.map((p) => p.loss);
    const minStep = Math.min(...steps);
    const maxStep = Math.max(...steps);
    const minLoss = Math.min(...losses);
    const maxLoss = Math.max(...losses);
    const lossRange = maxLoss - minLoss || 1;
    const stepRange = maxStep - minStep || 1;

    const points = lossHistory
      .map((p) => {
        const x = padding + ((p.step - minStep) / stepRange) * (width - 2 * padding);
        const y = padding + (1 - (p.loss - minLoss) / lossRange) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className={styles.chartContainer}>
        <h3>Loss Curve</h3>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.chart}>
          {/* Y-axis labels */}
          <text x={padding - 8} y={padding} fill="#637684" fontSize="10" textAnchor="end">
            {maxLoss.toFixed(2)}
          </text>
          <text
            x={padding - 8}
            y={height - padding}
            fill="#637684"
            fontSize="10"
            textAnchor="end"
          >
            {minLoss.toFixed(2)}
          </text>
          {/* X-axis labels */}
          <text
            x={padding}
            y={height - padding + 16}
            fill="#637684"
            fontSize="10"
            textAnchor="middle"
          >
            {minStep}
          </text>
          <text
            x={width - padding}
            y={height - padding + 16}
            fill="#637684"
            fontSize="10"
            textAnchor="middle"
          >
            {maxStep}
          </text>
          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#ededed"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#ededed"
          />
          {/* Loss line */}
          <polyline points={points} fill="none" stroke="#288ed2" strokeWidth="2" />
        </svg>
      </div>
    );
  };

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          &larr; Back
        </button>
        <h2 className={styles.title}>{job.modelName}</h2>
        <span className={styles.status} style={{ color: statusColor(job.status) }}>
          {connected && <span className={styles.liveDot} />}
          {job.status.replace(/_/g, " ")}
        </span>
      </div>

      {job.statusMessage && <p className={styles.statusMessage}>{job.statusMessage}</p>}

      {/* Progress bar */}
      {job.status === "training" && (
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressLabel}>{progress}%</span>
        </div>
      )}

      {/* Metrics grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Step</span>
          <span className={styles.metricValue}>
            {job.currentStep} / {job.totalSteps}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Loss</span>
          <span className={styles.metricValue}>
            {job.currentLoss !== null ? job.currentLoss.toFixed(4) : "--"}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Grad Norm</span>
          <span className={styles.metricValue}>
            {job.gradientNorm !== null ? job.gradientNorm.toFixed(4) : "--"}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Learning Rate</span>
          <span className={styles.metricValue}>
            {job.currentLR !== null ? job.currentLR.toExponential(2) : "--"}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Nodes</span>
          <span className={styles.metricValue}>{job.nodeCount}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Backend</span>
          <span className={styles.metricValue}>{job.computeBackend.toUpperCase()}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Zone</span>
          <span className={styles.metricValue}>{job.zone}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Cost</span>
          <span className={styles.metricValue}>
            {job.estimatedCost !== null ? `$${job.estimatedCost.toFixed(2)}` : "--"}
          </span>
        </div>
      </div>

      {/* Loss chart */}
      {renderLossChart()}

      {/* Error */}
      {job.errorMessage && <p className={styles.error}>{job.errorMessage}</p>}

      {/* Adapter download */}
      {job.gcsAdapterPath && job.status === "completed" && (
        <div className={styles.adapterSection}>
          <h3>Trained Adapter</h3>
          <code className={styles.adapterPath}>{job.gcsAdapterPath}</code>
        </div>
      )}

      {/* Actions */}
      {!isTerminal(job.status) && (
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={() => onCancel(job.id)}>
            Cancel Job
          </button>
        </div>
      )}
    </section>
  );
};

export default JobDetail;
