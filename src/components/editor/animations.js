/**
 * Pose animations for editor
 * **************************
**/

export const editorAnimation = {
	visible: {
		scale: 1,
		rotateX: 0,

		applyAtStart: {display: "flex"},
		/** 
		 * NOTE: explicitly setting our 'visible' values here using 'applyAtEnd',
		 * because 'pose' does not end the animation with e.g: opacity: 1;
		 * - instead it ends with something like: opacity: 0.987634761; 
		 * and not just here - it does so everywhere...
		 */ 
		applyAtEnd: {
			scale: 1,
			rotateX: 0,
		},

		transition: {
			delay: 1000,
			duration: 1000,
			ease: "anticipate",
	
			rotateX: {
				duration: 400,
				delay: 900,
			}
		},
	},

	hidden: {
		scale: 0.75,
		rotateX: 180,

		applyAtEnd: {display: "none"},
		
		transition: {
			duration: 1000,
			ease: "easeOut",
	
			rotateX: {
				duration: 400,
				delay: 900,
			}
		},
	},
}


export const toolbarItemsAnimation = {
	show: {
		scale: 1,

		applyAtStart: {display: "block"},
	},

	hide: {
		scale: 0,

		applyAtEnd: {display: "none"},
	}
}
