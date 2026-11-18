import { useEffect } from "react";

const DEFAULT_TITLE = "ButteryAI — Build your own AI tech stack with AI specialists";

/**
 * Sets `document.title` while the component is mounted and restores the
 * site's default title on unmount. Used to give marketing pages Linear-style
 * tab titles (e.g. "About – ButteryAI").
 */
export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
};

export default useDocumentTitle;
