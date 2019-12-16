/**
 * Pose animations
 * ***************
**/

export const favoritesAnimation = {
	enter: {
		opacity: 1,
		scaleX: 1,

		applyAtStart: {position: "absolute"},
		/** 
		 * NOTE: explicitly setting our 'visible' values here using 'applyAtEnd',
		 * because 'pose' does not end the animation with e.g: opacity: 1;
		 * - instead it ends with something like: opacity: 0.987634761; 
		 * and not just here - it does so everywhere...
		 */ 
		applyAtEnd: {
			position: "relative",
			opacity: 1,
			scaleX: 1,
		},

		transition: {
			delay: 700,
			duration: 1000,
			ease: "anticipate",
		},
	},

	exit: {
		opacity: 0,
		scaleX: 0,

		applyAtStart: {position: "absolute"},
		applyAtEnd: {position: "relative"},

		transition: {
			duration: 1000,
			ease: "anticipate",
		},
	},
}
