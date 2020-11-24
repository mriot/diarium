export default class AutoSave {
  constructor(editorState, saveCallback) {
    let timer = null;
    let internalTimer = null;

    const save = () => {
      console.log(editorState);
      if (!editorState) { console.error("No editorState provided"); }
      if (!editorState?.isDirty()) { return false; }

      try {
        console.log("Saving...");
        saveCallback(editorState.getContent());
        // todo: check if request was successful first
        editorState.setDirty(false);
      } catch (error) {
        console.error("Error while trying to save content", error);
      }
    };

    const setInternalTimer = () => {
      internalTimer = setTimeout(() => {
        internalTimer = null;
        save();
      }, 6000);
    };

    // replace a previously scheduled save with each invocation
    this.start = function (timeout = 3000) {
      this.clear();

      timer = setTimeout(() => {
        this.clear(true);
        save();
      }, timeout);

      if (!internalTimer) { setInternalTimer(); }
    };

    this.clear = function (all) {
      clearTimeout(timer);
      if (all) {
        clearTimeout(internalTimer);
        internalTimer = null;
      }
    };
  }
}
