export const GET_ALIGNMENT_BUTTON_CONFIG = (editor) => {
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
        }
      ];
      callback(items);
    }
  };
};

export const GET_LIST_BUTTON_CONFIG = (editor) => {
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

export const GET_INLINECODE_BUTTON_CONFIG = (editor) => {
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
