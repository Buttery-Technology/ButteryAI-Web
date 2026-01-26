import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import dashboardLogo from "@assets/logos/dashboard-logo.png";
import Close from "@assets/icons/close.svg?react";
import styles from "./New.module.scss";

const New = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [access, setAccess] = useState<"PUBLIC" | "PRIVATE">("PRIVATE");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => navigate("/dashboard/hive");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Node name is required");
      return;
   }

  try {
    const CLUSTER_ID = "123e4567-e89b-12d3-a456-426614174000";

    const response = await fetch(
      `http://127.0.0.1:8000/clusters/${CLUSTER_ID}/nodes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          access,
          archived: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to create node");
    }

    const data = await response.json();
    console.log("Node created:", data);

    const existing = JSON.parse(localStorage.getItem("tempNodes") || "[]");

    localStorage.setItem(
      "tempNodes",
     JSON.stringify([...existing, data.node])
    );

    navigate("/dashboard/hive");
      } catch (err: any) {
      setError(err.message || "Something went wrong while creating the node");
   }
  };

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <div className={styles.logoWrapper}>
          <Link to="/dashboard/hive">
            <img src={dashboardLogo} alt="ButteryAI" />
          </Link>
        </div>

        <header className={styles.header}>
          <button onClick={handleClose} className={styles.closeButton}>
            <Close />
          </button>
          <h1 className={styles.title}>New Node</h1>
        </header>

        <form onSubmit={handleCreate} className={styles.form}>
          <h2 className={styles.categoryTitle}>General</h2>

        <label htmlFor="access">Access Level</label>
        <select
          id="access"
          value={access}
          onChange={(e) => setAccess(e.target.value as "PUBLIC" | "PRIVATE")}
        >
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
      
          <h2 className={styles.categoryTitle}>AI functionality</h2>
          <label htmlFor="main-functionality" className={styles.label}>
            Main Functionality
          </label>
          <input
            type="text"
            id="main-functionality"
            placeholder="“Conversational AI on patient medical charts”"
            className={styles.input}
            onChange={() => {}}
          />
          <h2 className={styles.categoryTitle}>AI functionality</h2>
          <label htmlFor="functionality-keywords" className={styles.label}>
            Functionality Keywords
          </label>
          <input
            type="text"
            id="functionality-keywords"
            placeholder="“medical, patient records, conversation”"
            className={styles.input}
          />

          <label htmlFor = "name" className={styles.label}>Name</label>
          <input
              type = "text"
              id = "name"
              placeholder = "'assistance node...'"
              className = {styles.input}
              value = {name}
              onChange = {(e) => setName(e.target.value)}
              />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <h2 className={styles.categoryTitle}>AI model</h2>
          <p>Remote</p>
          <div className={styles.inputButtonWrapper}>
            <p>Add details</p>
            <button className={styles.inputButton}>Add</button>
          </div>
          <p>Or</p>
          <div className={styles.inputButtonWrapper}>
            <p>Upload model</p>
            <button className={styles.inputButton}>Find</button>
          </div>
          <h2 className={styles.categoryTitle}>Training dataset</h2>
          <p>Remote</p>
          <div className={styles.inputButtonWrapper}>
            <p>Add remote information</p>
            <button className={styles.inputButton}>Add</button>
          </div>
          <p>Or</p>
          <div className={styles.inputButtonWrapper}>
            <p>Upload dataset</p>
            <button className={styles.inputButton}>Find</button>
          </div>
          <h2 className={styles.categoryTitle}>Security</h2>
          <p className={styles.description}>
            ButteryAI comes with built-in security. But, if you would like to increase security, you may use custom
            security certificates. Please keep in mind that the certificates <strong>must</strong> follow our security
            protocol, which you can learn more about <span className={styles.link}>here</span>.
          </p>
          <div className={styles.upgradeBox}>
            <p>Upgrade your plan to customize</p>
            <button className={styles.upgradeButton}>Upgrade</button>
          </div>
          <h2 className={styles.categoryTitle}>Communications</h2>
          <p className={styles.description}>
            ButteryAI communicates through strict communication protocols. However, you may customize some aspects of
            the format, specifically with use with your model. <span className={styles.link}>Learn more</span>.
          </p>
          <div className={styles.upgradeBox}>
            <p>Upgrade your plan to customize</p>
            <button className={styles.upgradeButton}>Upgrade</button>
          </div>
          <div className={styles.createWrapper}>
            <p>
              Creating the node may take a few minutes. However, you can continue on with your work and we’ll notify you
              when it’s complete.
            </p>

            <button type = "submit" className={styles.createButton}>
              Create
            </button>

          </div>
        </form>
      </div>
    </section>
  );
};

export default New;
