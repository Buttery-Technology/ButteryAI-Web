import { useEffect, useState } from "react";

const ButterAnimation = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= 3) return;
    const timer = setTimeout(() => setCount(count + 1), 500);
    return () => clearTimeout(timer);
  }, [count]);

  return <span>{"🧈".repeat(count)}</span>;
};

export default ButterAnimation;
