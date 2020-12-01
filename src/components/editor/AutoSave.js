export default class AutoSave {
  constructor(editorState, saveCallback) {
    let timer = null;
    let internalTimer = null;
    let prevContentLength = false;

    function save() {
      if (!editorState) {
        console.error("AutoSave: No editorState provided");
        return false;
      }

      try {
        const content = editorState.getContent();
        saveCallback(content);
        prevContentLength = content.length;
      } catch (error) {
        console.error("Error while trying to save content", error);
      }
    }

    function clearAllTimers() {
      clearTimeout(timer);
      clearTimeout(internalTimer);
      internalTimer = null;
    };

    function setInternalTimer() {
      internalTimer = setTimeout(() => {
        clearAllTimers();
        save();
      }, 10000);
    };

    /**
     * Returns whether the editor is dirty.
     * It should cover all cases: https://github.com/tinymce/tinymce/issues/6285
     */
    this.isEditorDirty = function () {
      if (!editorState) {
        console.error("AutoSave: No editorState provided");
        return null;
      }

      return (
        editorState.isDirty() ||
        (prevContentLength && editorState.getContent().length !== prevContentLength)
      );
    };

    /**
     * Schedule a new autosave after timeout.
     * Note: If the editor is *not* dirty when calling this method, no save is scheduled.
     * @param {Number} timeout
     */
    this.scheduleSave = function (timeout = 2000) {
      if (!this.isEditorDirty()) return;

      // only reset last scheduled save timer and not internal timer
      clearTimeout(timer);

      timer = setTimeout(() => {
        clearAllTimers();
        save();
      }, timeout);

      if (!internalTimer) { setInternalTimer(); }
    };

    /**
     * Clear all autosave timers and save if dirty
     */
    this.saveNow = function () {
      if (!this.isEditorDirty()) return;

      clearAllTimers();
      save();
    };

    /**
     * Clear all autosave timers and force a save. Ignores dirty.
     */
    this.forceSave = function () {
      clearAllTimers();
      save();
    };
  }
}
