/**
 * Pose animations
 * ***************
**/

export const favoritesAnimation = {
	enter: {
		scale: 1,
		rotateX: 0,

		applyAtStart: {
			display: "flex",
			position: "absolute"
		},
		applyAtEnd: {
			position: "relative",
			scale: 1,
			rotateX: 0,
			zIndex: 1,
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
		applyAtEnd: {
			position: "relative",
			display: "none",
		},

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

