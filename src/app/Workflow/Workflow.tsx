import { Route, Routes, useParams } from "react-router-dom";
import { useWorkflow } from "../../hooks/useWorkflow";
import { WorkflowMenu } from "./Menu/WorkflowMenu";
import { WorkflowCanvas } from "./Canvas/WorkflowCanvas";
import { WorkflowList } from "./List/WorkflowList";
import { WorkflowSettings } from "./Settings/WorkflowSettings";
import styles from "./Workflow.module.scss";

const Workflow = () => {
  const { workflowID } = useParams<{ workflowID: string }>();
  const wf = useWorkflow(workflowID);

  return (
    <div className={styles.root}>
      <WorkflowMenu workflow={wf.workflow} onUpdateName={async (name) => { await wf.updateWorkflow({ name }); }} />
      <div className={styles.content}>
        <Routes>
          <Route
            path="/"
            element={
              <WorkflowCanvas
                workflowID={workflowID}
                steps={wf.steps}
                addStep={wf.addStep}
                updateStep={wf.updateStep}
                deleteStep={wf.deleteStep}
                isLoading={wf.isLoading}
              />
            }
          />
          <Route
            path="list"
            element={
              <WorkflowList
                steps={wf.steps}
                addStep={wf.addStep}
                updateStep={wf.updateStep}
                deleteStep={wf.deleteStep}
                isLoading={wf.isLoading}
              />
            }
          />
          <Route
            path="settings"
            element={
              <WorkflowSettings
                workflow={wf.workflow}
                updateWorkflow={wf.updateWorkflow}
                isLoading={wf.isLoading}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Workflow;
export { Workflow };
