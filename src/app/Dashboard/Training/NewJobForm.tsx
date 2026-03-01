import { useState } from "react";
import {
  useTrainingAPI,
  defaultConfig,
  type ComputeBackend,
  type LoRATrainingConfig,
} from "@hooks";
import styles from "./NewJobForm.module.scss";

interface Props {
  onCancel: () => void;
  onCreated: () => void;
}

const costPerHour: Record<string, number> = {
  cpu: 0.34 + 0.07, // c2d-standard-8 + coordinator
  gpu: 0.70 + 0.07, // g2-standard-8 (spot) + coordinator
};

export const NewJobForm = ({ onCancel, onCreated }: Props) => {
  const { createJob, loading, error } = useTrainingAPI();

  const [modelName, setModelName] = useState("qwen2.5-coder-7b-q4");
  const [backend, setBackend] = useState<ComputeBackend>("cpu");
  const [nodeCount, setNodeCount] = useState(1);
  const [config, setConfig] = useState<LoRATrainingConfig>({ ...defaultConfig });
  const [dataPath, setDataPath] = useState("");

  const updateConfig = (key: keyof LoRATrainingConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const estimatedHourlyCost = (costPerHour[backend] ?? 0.41) * nodeCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createJob({
      modelName,
      config,
      computeBackend: backend,
      nodeCount,
      trainingDataPath: dataPath || undefined,
    });
    if (result) onCreated();
  };

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onCancel}>
          &larr; Back
        </button>
        <h2 className={styles.title}>New Training Job</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Model</h3>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className={styles.select}
          >
            <option value="qwen2.5-coder-7b-q4">Qwen 2.5 Coder 7B (Q4)</option>
            <option value="qwen3-30b-a3b-q4">Qwen 3 30B-A3B (Q4)</option>
          </select>
        </div>

        <div className={styles.section}>
          <h3>Compute</h3>
          <div className={styles.row}>
            <label>
              Backend
              <select
                value={backend}
                onChange={(e) => setBackend(e.target.value as ComputeBackend)}
                className={styles.select}
              >
                <option value="cpu">CPU (c2d-standard-8)</option>
                <option value="gpu">GPU (g2-standard-8 + L4)</option>
                <option value="auto">Auto</option>
              </select>
            </label>
            <label>
              Nodes
              <input
                type="number"
                min={1}
                max={8}
                value={nodeCount}
                onChange={(e) => setNodeCount(parseInt(e.target.value) || 1)}
                className={styles.input}
              />
            </label>
          </div>
          <p className={styles.costEstimate}>
            ~${estimatedHourlyCost.toFixed(2)}/hr
          </p>
        </div>

        <div className={styles.section}>
          <h3>LoRA Config</h3>
          <div className={styles.grid}>
            <label>
              Rank
              <input
                type="number"
                value={config.rank}
                onChange={(e) => updateConfig("rank", parseInt(e.target.value) || 32)}
                className={styles.input}
              />
            </label>
            <label>
              Alpha
              <input
                type="number"
                value={config.alpha}
                onChange={(e) => updateConfig("alpha", parseFloat(e.target.value) || 32)}
                className={styles.input}
              />
            </label>
            <label>
              Learning Rate
              <input
                type="number"
                step="0.000001"
                value={config.learningRate}
                onChange={(e) => updateConfig("learningRate", parseFloat(e.target.value) || 2e-6)}
                className={styles.input}
              />
            </label>
            <label>
              Max Steps
              <input
                type="number"
                value={config.maxSteps}
                onChange={(e) => updateConfig("maxSteps", parseInt(e.target.value) || 4000)}
                className={styles.input}
              />
            </label>
            <label>
              Batch Size
              <input
                type="number"
                value={config.batchSize}
                onChange={(e) => updateConfig("batchSize", parseInt(e.target.value) || 2)}
                className={styles.input}
              />
            </label>
            <label>
              Grad Accumulation
              <input
                type="number"
                value={config.gradientAccumulation}
                onChange={(e) => updateConfig("gradientAccumulation", parseInt(e.target.value) || 4)}
                className={styles.input}
              />
            </label>
            <label>
              Seq Length
              <input
                type="number"
                value={config.sequenceLength}
                onChange={(e) => updateConfig("sequenceLength", parseInt(e.target.value) || 512)}
                className={styles.input}
              />
            </label>
            <label>
              Warmup Steps
              <input
                type="number"
                value={config.warmupSteps}
                onChange={(e) => updateConfig("warmupSteps", parseInt(e.target.value) || 100)}
                className={styles.input}
              />
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Training Data</h3>
          <label>
            GCS Path (optional)
            <input
              type="text"
              placeholder="gs://butteryai-training/my-data.jsonl"
              value={dataPath}
              onChange={(e) => setDataPath(e.target.value)}
              className={styles.input}
            />
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Creating..." : "Start Training"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewJobForm;
