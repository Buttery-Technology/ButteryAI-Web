export const typewriterEffect = (text: string, callback: (currentText: string) => void, delay = 50) => {
  let i = 0;
  let currentText = "";

  const type = () => {
    if (i < text.length) {
      currentText += text.charAt(i);
      callback(currentText);
      i++;
      setTimeout(type, delay);
    }
  };
  type();
};
