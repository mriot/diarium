import { useEffect } from "react";

export default function useOutsideClick(containerRef, callback) {
  useEffect(() => {
    if (!containerRef) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        callback(event);
      }
    };

    const handleClickIntoIframe = (event) => {
      // window blur event does not deliver the required node target to check bounds
      if (containerRef.current && document.activeElement.tagName === "IFRAME") {
        callback(event);
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("blur", handleClickIntoIframe);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("blur", handleClickIntoIframe);
    };
  }, [containerRef, callback]);
}
