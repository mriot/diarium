/**
 * Pose animations
 * ***************
**/

// main screen enter and exit animation
export const highlightsAnimation = {
  enter: {
    translateX: 0,

    transition: {
      duration: 500,
      ease: "anticipate"
    }
  },

  exit: {
    translateX: "100%",

    transition: {
      duration: 500
    }
  }
};

export const highlightCardAnimation = {
  show: {
    scaleY: 1,
    opacity: 1,

    applyAtStart: {
      display: "flex",
      scaleY: 0
    },

    applyAtEnd: {
      scaleY: 1,
      opacity: 1
    }
  },

  hide: {
    opacity: 0,

    applyAtEnd: {
      display: "none"
    },

    transition: {
      duration: 200
    }
  }
};
