export const mainLayoutContainerAnimation = {
  enter: {
    opacity: 1,
    applyAtEnd: { opacity: 1 },
    transition: {
      duration: 500
    }
  },

  exit: {
    opacity: 0,
    applyAtEnd: { opacity: 0 },
    transition: {
      duration: 500
    }
  }
};

export const loginContainerAnimation = {
  enter: {
    opacity: 1,
    applyAtEnd: { opacity: 1 },
    transition: {
      type: "spring"
    }
  },

  exit: {
    opacity: 0,
    applyAtEnd: { opacity: 0 },
    transition: {
      type: "spring"
    }
  }
};
