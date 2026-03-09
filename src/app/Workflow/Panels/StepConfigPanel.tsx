import { useRef, useState, useLayoutEffect, useCallback } from "react";
import type { WorkflowStepResponse, UpdateStepRequest } from "../../../types/workflow";
import { PromptExecutionConfig } from "./configs/PromptExecutionConfig";
import { ConditionalConfig } from "./configs/ConditionalConfig";
import { ApiCallConfig } from "./configs/ApiCallConfig";
import { DelayConfig } from "./configs/DelayConfig";
import { NodeSelectionConfig } from "./configs/NodeSelectionConfig";
import { GenericConfig } from "./configs/GenericConfig";
import Xmark from "@assets/icons/xmark.svg?react";
import styles from "./StepConfigPanel.module.scss";

interface Props {
  step: WorkflowStepResponse;
  position: { x: number; y: number };
  onUpdate: (data: UpdateStepRequest) => Promise<void>;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export const StepConfigPanel = ({ step, position, onUpdate, onClose, onDelete }: Props) => {
  const [name, setName] = useState(step.name);
  const [description, setDescription] = useState(step.description ?? "");
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(position);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const parent = el.offsetParent as HTMLElement | null;
    if (!parent) return;
    const pw = parent.clientWidth;
    const ph = parent.clientHeight;
    const ew = el.offsetWidth;
    const eh = el.offsetHeight;
    const pad = 12;
    const x = Math.min(Math.max(pad, position.x - ew / 2), pw - ew - pad);
    const y = Math.min(Math.max(pad, position.y + 20), ph - eh - pad);
    setPos({ x, y });
  }, [position]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      setPos({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy });
    };

    const onMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [pos]);

  const handleNameBlur = async () => {
    if (name !== step.name) {
      await onUpdate({ name });
    }
  };

  const handleDescriptionBlur = async () => {
    if (description !== step.description) {
      await onUpdate({ description });
    }
  };

  const renderConfig = () => {
    switch (step.stepType) {
      case "promptExecution":
        return <PromptExecutionConfig step={step} onUpdate={onUpdate} />;
      case "conditional":
        return <ConditionalConfig step={step} onUpdate={onUpdate} />;
      case "apiCall":
        return <ApiCallConfig step={step} onUpdate={onUpdate} />;
      case "delay":
        return <DelayConfig step={step} onUpdate={onUpdate} />;
      case "nodeSelection":
        return <NodeSelectionConfig step={step} onUpdate={onUpdate} />;
      default:
        return <GenericConfig step={step} onUpdate={onUpdate} />;
    }
  };

  return (
    <div className={styles.root} ref={panelRef} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.header} onMouseDown={onMouseDown}>
        <button className={styles.sheetClose} onClick={onClose} type="button" aria-label="Close" onMouseDown={(e) => e.stopPropagation()}>
          <Xmark />
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            rows={2}
          />
        </div>
        <div className={styles.divider} />
        {renderConfig()}
      </div>
      <div className={styles.footer}>
        <button className={styles.deleteBtn} onClick={onDelete}>
          Delete Step
        </button>
      </div>
    </div>
  );
};
