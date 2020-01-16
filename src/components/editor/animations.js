/**
 * Pose animations for editor
 * **************************
**/

export const editorAnimation = {
	visible: {
		opacity: 1,

		applyAtStart: { display: "flex" },

		transition: {
			duration: 500,
			ease: "easeInOut",
		},
	},

	hidden: {
		opacity: 0,

		applyAtEnd: { display: "none" },
		
		transition: {
			duration: 500,
			ease: "easeInOut",
		},
	},
};


export const toolbarItemsAnimation = {
	show: {
		scale: 1,

		applyAtStart: { display: "block" },
	},

	hide: {
		scale: 0,

		applyAtEnd: { display: "none" },
	},
};
