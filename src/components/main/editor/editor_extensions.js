export const CUSTOM_EMOJIS = () => {
  return {
    shrug: {
      keywords: ["shrug"],
      char: "¯\\_(ツ)_/¯"
    }
  };
};

export const ALIGNMENT_BUTTON = (editor) => {
  return {
    icon: "align-left",
    onAction: () => {
      editor.formatter.apply("alignleft");
    },
    onItemAction: (buttonApi, value) => {
      editor.formatter.apply(value);
    },
    fetch: (callback) => {
      const items = [
        // {
        //   type: "choiceitem",
        //   icon: "align-left",
        //   text: "Left",
        //   value: "alignleft"
        // },
        {
          type: "choiceitem",
          icon: "align-center",
          text: "Center",
          value: "aligncenter"
        },
        {
          type: "choiceitem",
          icon: "align-right",
          text: "Right",
          value: "alignright"
        },
        {
          type: "choiceitem",
          icon: "align-justify",
          text: "Block",
          value: "alignjustify"
        }
      ];
      callback(items);
    }
  };
};

export const LIST_BUTTON = (editor) => {
  return {
    icon: "unordered-list",
    active: false,
    tooltip: "Bullet list",
    onAction: () => editor.execCommand("InsertUnorderedList"),
    onSetup: (buttonApi) => {
      const editorEventCallback = (eventApi) => {
        buttonApi.setActive(eventApi.element.nodeName.toLowerCase() === "li");
      };
      editor.on("NodeChange", editorEventCallback);

      return function (buttonApi) {
        editor.off("NodeChange", editorEventCallback);
      };
    },
    onItemAction: (buttonApi, value) => {
      editor.execCommand(value);
    },
    fetch: (callback) => {
      const items = [
        {
          type: "choiceitem",
          icon: "ordered-list",
          text: "Numbered",
          value: "InsertOrderedList"
        }
      ];
      callback(items);
    }
  };
};

export const INLINECODE_BUTTON = (editor) => {
  return {
    icon: "sourcecode",
    tooltip: "Inline code",
    active: false,
    onAction: function (api) {
      editor.execCommand("mceToggleFormat", false, "code");
    },
    onSetup: (buttonApi) => {
      const editorEventCallback = (eventApi) => {
        buttonApi.setActive(eventApi.element.nodeName.toLowerCase() === "code");
      };
      editor.on("NodeChange", editorEventCallback);

      return function (buttonApi) {
        editor.off("NodeChange", editorEventCallback);
      };
    }
  };
};

export const TIMEDIVIDER_BUTTON = (editor, dayjs) => {
  return {
    icon: "insert-time",
    active: false,
    tooltip: "hr + time",
    onAction: () => {
      editor.insertContent(`
        <div class="mce-time-separator">${dayjs().format("HH:mm")} Uhr</div>
      `);
    }
  };
};

export const EXPORTHTML_BUTTON = (editor, dayRecord) => {
  return {
    icon: "save",
    text: "Save as HTML",
    onAction: function () {
      const data = editor.getContent();
      const blob = new Blob([data], { type: "text/html" });
      const a = window.document.createElement("a");

      a.href = window.URL.createObjectURL(blob);
      a.download = dayRecord.assigned_day + ".html";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
};
