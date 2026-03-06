import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CREATE_NODE, GET_CLUSTER } from "../../../api";
import butteryaiLogo from "@assets/logos/ButteryAI-Logo.svg";
import Close from "@assets/icons/close.svg?react";
import styles from "./New.module.scss";

const New = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => navigate("/dashboard");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = (formData.get("name") as string)?.trim() || undefined;

      // Fetch the user's cluster to get the clusterID
      const clusterReq = GET_CLUSTER();
      const clusterRes = await fetch(clusterReq.url, clusterReq.options);
      if (!clusterRes.ok) throw new Error("Could not load cluster. Please try again.");

      const cluster = await clusterRes.json();
      const clusterID = cluster.clusterID;
      if (!clusterID) throw new Error("No cluster found. Create a cluster first.");

      // Create the node
      const nodeReq = CREATE_NODE(name ?? "Unnamed Node", clusterID);
      const nodeRes = await fetch(nodeReq.url, nodeReq.options);
      if (!nodeRes.ok) {
        const body = await nodeRes.json().catch(() => null);
        throw new Error(body?.reason || "Failed to create node.");
      }

      const newNode = await nodeRes.json();
      navigate(`/node/${encodeURIComponent(newNode.name)}/overview`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Link to="/dashboard">
            <img src={butteryaiLogo} alt="ButteryAI" />
          </Link>
        </div>
        <header className={styles.header}>
          <button onClick={handleClose} className={styles.closeButton}>
            <Close />
          </button>
          <h1 className={styles.title}>New Node</h1>
        </header>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.categoryTitle}>General</h2>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input type="text" id="name" name="name" placeholder={"\u201CchatGPT 4.o mini\u201D..."} className={styles.input} />
          <h2 className={styles.categoryTitle}>AI functionality</h2>
          <label htmlFor="main-functionality" className={styles.label}>
            Main Functionality
          </label>
          <input
            type="text"
            id="main-functionality"
            placeholder={"\u201CConversational AI on patient medical charts\u201D"}
            className={styles.input}
          />
          <label htmlFor="functionality-keywords" className={styles.label}>
            Functionality Keywords
          </label>
          <input
            type="text"
            id="functionality-keywords"
            placeholder={"\u201Cmedical, patient records, conversation, \u201D"}
            className={styles.input}
          />
          <h2 className={styles.categoryTitle}>AI model</h2>
          <p>Remote</p>
          <div className={styles.inputButtonWrapper}>
            <p>Add details</p>
            <button type="button" className={styles.inputButton}>Add</button>
          </div>
          <p>Or</p>
          <div className={styles.inputButtonWrapper}>
            <p>Upload model</p>
            <button type="button" className={styles.inputButton}>Find</button>
          </div>
          <h2 className={styles.categoryTitle}>Training dataset</h2>
          <p>Remote</p>
          <div className={styles.inputButtonWrapper}>
            <p>Add remote information</p>
            <button type="button" className={styles.inputButton}>Add</button>
          </div>
          <p>Or</p>
          <div className={styles.inputButtonWrapper}>
            <p>Upload dataset</p>
            <button type="button" className={styles.inputButton}>Find</button>
          </div>
          <h2 className={styles.categoryTitle}>Security</h2>
          <p className={styles.description}>
            ButteryAI comes with built-in security. But, if you would like to increase security, you may use custom
            security certificates. Please keep in mind that the certificates <strong>must</strong> follow our security
            protocol, which you can learn more about <span className={styles.link}>here</span>.
          </p>
          <div className={styles.upgradeBox}>
            <p>Upgrade your plan to customize</p>
            <button type="button" className={styles.upgradeButton}>Upgrade</button>
          </div>
          <h2 className={styles.categoryTitle}>Communications</h2>
          <p className={styles.description}>
            ButteryAI communicates through strict communication protocols. However, you may customize some aspects of
            the format, specifically with use with your model. <span className={styles.link}>Learn more</span>.
          </p>
          <div className={styles.upgradeBox}>
            <p>Upgrade your plan to customize</p>
            <button type="button" className={styles.upgradeButton}>Upgrade</button>
          </div>
          <div className={styles.createWrapper}>
            {error && <p style={{ color: "#d12a89" }}>{error}</p>}
            <p>
              Creating the node may take a few minutes. However, you can continue on with your work and we'll notify you
              when it's complete.
            </p>
            <button type="submit" className={styles.createButton} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default New;
