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
      var items = [
        {
          type: "choiceitem",
          icon: "align-left",
          text: "Left",
          value: "alignleft"
        },
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
          type: "separator"
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
