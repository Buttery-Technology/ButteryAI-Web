import { useNavigate } from "react-router-dom";
import { useWorkflows } from "../../../hooks/useWorkflows";
import type { WorkflowResponse } from "../../../types/workflow";
import styles from "./Workflows.module.scss";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const h = hours % 12 || 12;
  return `${month}/${day}/${year} at ${h}:${minutes}${ampm}`;
}

function WorkflowRow({ wf, index, onOpen, onDelete, onDuplicate }: {
  wf: WorkflowResponse;
  index: number;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <button className={styles.row} onClick={onOpen}>
      <span className={styles.rowIndex}>{index + 1}</span>

      <div className={styles.rowSection}>
        <span className={styles.sectionLabel}>Steps</span>
        <span className={styles.sectionValue}>{wf.stepCount}</span>
      </div>

      <div className={styles.rowSection}>
        <span className={styles.sectionLabel}>Activity</span>
        <span className={styles.sectionValue}>{wf.status === "active" ? "Active" : wf.status}</span>
      </div>

      <div className={styles.rowSection}>
        <span className={styles.sectionLabel}>Last updated</span>
        <span className={styles.sectionValue}>{formatDate(wf.updatedAt)}</span>
      </div>

      <div className={styles.rowActions}>
        <button
          className={styles.actionBtn}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Delete workflow"
        >
          <svg width="22" height="25" viewBox="0 0 27 31" fill="none">
            <path d="M9.1875 26.0449C8.93229 26.0449 8.72721 25.972 8.57227 25.8262C8.41732 25.6803 8.33529 25.4844 8.32617 25.2383L7.91602 10.623C7.9069 10.3861 7.97982 10.1947 8.13477 10.0488C8.29883 9.89388 8.50846 9.81641 8.76367 9.81641C9.00977 9.81641 9.21029 9.88932 9.36523 10.0352C9.5293 10.181 9.61133 10.3724 9.61133 10.6094L10.0352 25.2383C10.0352 25.4753 9.95768 25.6712 9.80273 25.8262C9.64779 25.972 9.44271 26.0449 9.1875 26.0449ZM13.2344 26.0449C12.9792 26.0449 12.7695 25.972 12.6055 25.8262C12.4414 25.6712 12.3594 25.4753 12.3594 25.2383V10.623C12.3594 10.3861 12.4414 10.1947 12.6055 10.0488C12.7695 9.89388 12.9792 9.81641 13.2344 9.81641C13.4987 9.81641 13.7129 9.89388 13.877 10.0488C14.041 10.1947 14.123 10.3861 14.123 10.623V25.2383C14.123 25.4753 14.041 25.6712 13.877 25.8262C13.7129 25.972 13.4987 26.0449 13.2344 26.0449ZM17.2949 26.0449C17.0306 26.0449 16.821 25.972 16.666 25.8262C16.5111 25.6712 16.4382 25.4753 16.4473 25.2383L16.8574 10.623C16.8665 10.377 16.9486 10.181 17.1035 10.0352C17.2585 9.88932 17.459 9.81641 17.7051 9.81641C17.9694 9.81641 18.179 9.89388 18.334 10.0488C18.4889 10.1947 18.5618 10.3861 18.5527 10.623L18.1426 25.2383C18.1335 25.4844 18.0514 25.6803 17.8965 25.8262C17.7415 25.972 17.541 26.0449 17.2949 26.0449ZM7.23242 6.24805V3.18555C7.23242 2.20117 7.5332 1.42643 8.13477 0.861328C8.74544 0.287109 9.57487 0 10.623 0H15.8184C16.8665 0 17.6914 0.287109 18.293 0.861328C18.9036 1.42643 19.209 2.20117 19.209 3.18555V6.24805H17.0352V3.32227C17.0352 2.93945 16.9076 2.62956 16.6523 2.39258C16.4062 2.1556 16.0781 2.03711 15.668 2.03711H10.7734C10.3633 2.03711 10.0306 2.1556 9.77539 2.39258C9.5293 2.62956 9.40625 2.93945 9.40625 3.32227V6.24805H7.23242ZM1.02539 7.3418C0.751953 7.3418 0.510417 7.24154 0.300781 7.04102C0.10026 6.83138 0 6.58529 0 6.30273C0 6.0293 0.10026 5.79232 0.300781 5.5918C0.510417 5.38216 0.751953 5.27734 1.02539 5.27734H25.457C25.7305 5.27734 25.9674 5.3776 26.168 5.57812C26.3685 5.77865 26.4688 6.02018 26.4688 6.30273C26.4688 6.58529 26.3685 6.83138 26.168 7.04102C25.9766 7.24154 25.7396 7.3418 25.457 7.3418H1.02539ZM6.97266 30.4473C5.98828 30.4473 5.19076 30.1556 4.58008 29.5723C3.97852 28.998 3.65495 28.2188 3.60938 27.2344L2.63867 7.08203H4.78516L5.75586 26.9883C5.77409 27.3893 5.91536 27.722 6.17969 27.9863C6.44401 28.2507 6.77214 28.3828 7.16406 28.3828H19.291C19.6921 28.3828 20.0247 28.2507 20.2891 27.9863C20.5534 27.7311 20.6947 27.3984 20.7129 26.9883L21.6289 7.08203H23.8301L22.873 27.2207C22.8275 28.2051 22.4993 28.9889 21.8887 29.5723C21.278 30.1556 20.485 30.4473 19.5098 30.4473H6.97266Z" fill="#D12A89" />
          </svg>
        </button>
        <button
          className={styles.actionBtn}
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          aria-label="Duplicate workflow"
        >
          <svg width="20" height="25" viewBox="0 0 28 35" fill="none">
            <path d="M6.63086 7.57422V4.29297C6.63086 2.87109 6.98177 1.80013 7.68359 1.08008C8.39453 0.360026 9.45638 0 10.8691 0H16.1055C16.8438 0 17.5046 0.104818 18.0879 0.314453C18.6712 0.514974 19.2044 0.865885 19.6875 1.36719L26.5918 8.38086C27.1022 8.90951 27.4577 9.46549 27.6582 10.0488C27.8587 10.6322 27.959 11.3431 27.959 12.1816V23.2832C27.959 24.7051 27.6035 25.776 26.8926 26.4961C26.1908 27.2161 25.1335 27.5762 23.7207 27.5762H20.9043V25.375H23.5977C24.3086 25.375 24.8464 25.1927 25.2109 24.8281C25.5755 24.4544 25.7578 23.9258 25.7578 23.2422V11.5527H19.3594C18.5755 11.5527 17.9876 11.3613 17.5957 10.9785C17.2129 10.5957 17.0215 10.0078 17.0215 9.21484V2.20117H10.9785C10.2676 2.20117 9.72982 2.38802 9.36523 2.76172C9.00977 3.1263 8.83203 3.65039 8.83203 4.33398V7.57422H6.63086ZM19.0039 8.88672C19.0039 9.13281 19.054 9.31055 19.1543 9.41992C19.2637 9.52018 19.4368 9.57031 19.6738 9.57031H25.1836L19.0039 3.28125V8.88672ZM0 30.1055V11.1152C0 9.69336 0.350911 8.6224 1.05273 7.90234C1.76367 7.18229 2.82552 6.82227 4.23828 6.82227H9.06445C9.83008 6.82227 10.4635 6.9043 10.9648 7.06836C11.4661 7.23242 11.9766 7.58333 12.4961 8.12109L20.0293 15.791C20.3939 16.1647 20.6673 16.5202 20.8496 16.8574C21.041 17.1855 21.1686 17.5501 21.2324 17.9512C21.2962 18.3522 21.3281 18.8444 21.3281 19.4277V30.1055C21.3281 31.5273 20.9727 32.5983 20.2617 33.3184C19.5599 34.0384 18.5026 34.3984 17.0898 34.3984H4.23828C2.82552 34.3984 1.76367 34.0384 1.05273 33.3184C0.350911 32.6074 0 31.5365 0 30.1055ZM2.20117 30.0645C2.20117 30.748 2.37891 31.2721 2.73438 31.6367C3.09896 32.0104 3.63216 32.1973 4.33398 32.1973H16.9805C17.6823 32.1973 18.2155 32.0104 18.5801 31.6367C18.9447 31.2721 19.127 30.748 19.127 30.0645V19.5371H11.4023C10.5547 19.5371 9.91211 19.3229 9.47461 18.8945C9.04622 18.4661 8.83203 17.819 8.83203 16.9531V9.02344H4.34766C3.63672 9.02344 3.09896 9.21029 2.73438 9.58398C2.37891 9.94857 2.20117 10.4681 2.20117 11.1426V30.0645ZM11.6621 17.4727H18.7031L10.8965 9.5293V16.707C10.8965 16.9805 10.9557 17.1764 11.0742 17.2949C11.1927 17.4134 11.3887 17.4727 11.6621 17.4727Z" fill="#288ED2" />
          </svg>
        </button>
        <button
          className={styles.actionBtn}
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          aria-label="Edit workflow"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3.80078 20.4395L0.642578 21.6562C0.478516 21.7201 0.328125 21.679 0.191406 21.5332C0.0638021 21.3965 0.031901 21.2461 0.0957031 21.082L1.39453 18.0332L16.3242 3.13086L18.7168 5.53711L3.80078 20.4395ZM19.9199 4.36133L17.5 1.95508L18.8809 0.587891C19.2272 0.250651 19.5781 0.0683594 19.9336 0.0410156C20.2982 0.0136719 20.6354 0.154948 20.9453 0.464844L21.4102 0.929688C21.7292 1.2487 21.8796 1.58594 21.8613 1.94141C21.8431 2.29688 21.6562 2.65234 21.3008 3.00781L19.9199 4.36133Z" fill="#288ED2" />
          </svg>
        </button>
      </div>
    </button>
  );
}

export const Workflows = () => {
  const { workflows, isLoading, createWorkflow, deleteWorkflow, duplicateWorkflow } = useWorkflows();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const id = await createWorkflow("Untitled Workflow");
    if (id) navigate(`/workflow/${id}`);
  };

  const handleDuplicate = async (wf: WorkflowResponse) => {
    const id = await duplicateWorkflow(wf.id);
    if (id) navigate(`/workflow/${id}`);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading workflows...</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Workflows</h2>
        <button className={styles.addButton} onClick={handleCreate} type="button" aria-label="New workflow" />
      </div>

      {workflows.length === 0 ? (
        <p className={styles.empty}>No workflows yet. Create one to get started.</p>
      ) : (
        <div className={styles.list}>
          {workflows.map((wf, i) => (
            <WorkflowRow
              key={wf.id}
              wf={wf}
              index={i}
              onOpen={() => navigate(`/workflow/${wf.id}`)}
              onDelete={() => deleteWorkflow(wf.id)}
              onDuplicate={() => handleDuplicate(wf)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Workflows;
