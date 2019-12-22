/**
 * Pose animations
 * ***************
**/

// main screen enter and exit animation
export const highlightsAnimation = {
	enter: {
		scale: 1,
		rotateX: 0,

		applyAtStart: {position: "absolute"},
		applyAtEnd: {
			position: "relative",
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


	exit: {
		scale: 0.75,
		rotateX: -180,

		applyAtStart: {position: "absolute"},
		applyAtEnd: {position: "relative"},

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


export const highlightCardAnimation = {
	show: {
		scaleY: 1,
		opacity: 1,

		applyAtStart: {
			display: "flex",
			scaleY: 0,
		},
		
		applyAtEnd: {
			scaleY: 1,
			opacity: 1,
		},
	},
	
	hide: {
		opacity: 0,
		
		applyAtEnd: {
			display: "none",
		},

		transition: {
			duration: 200
		}
	},
}
