import { useEffect } from "react";

/**
 * Sets `document.title` while the component is mounted and restores the
 * previous title on unmount. Used to give marketing pages Linear-style
 * tab titles (e.g. "About – ButteryAI").
 */
export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
};

export default useDocumentTitle;
