export const GET_ALIGNMENT_BUTTON_CONFIG = (editor) => {
  return {
    icon: "align-left",
    onAction: () => {
      editor.formatter.apply("alignleft");
    },
    onItemAction: (buttonApi, value) => {
      editor.formatter.apply(value);
    },
    fetch: function (callback) {
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
