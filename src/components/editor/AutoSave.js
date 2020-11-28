export default class AutoSave {
  constructor(editorState, saveCallback) {
    let timer = null;
    let internalTimer = null;

    const save = () => {
      if (!editorState) {
        console.error("AutoSave: No editorState provided");
        return false;
      }

      try {
        saveCallback(editorState.getContent());
      } catch (error) {
        console.error("Error while trying to save content", error);
      }
    };

    const clearAllTimers = () => {
      clearTimeout(timer);
      clearTimeout(internalTimer);
      internalTimer = null;
    };

    const setInternalTimer = () => {
      internalTimer = setTimeout(() => {
        clearAllTimers();
        save();
      }, 10000);
    };

    // replace a previously scheduled save with each invocation
    this.start = (timeout = 2000) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        clearAllTimers();
        save();
      }, timeout);

      if (!internalTimer) { setInternalTimer(); }
    };

    this.saveNow = () => {
      clearAllTimers();
      save();
    };
  }
}
