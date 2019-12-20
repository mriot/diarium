/**
 * Pose animations
 * ***************
**/

export const favoritesAnimation = {
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


export const accordionAnimation = {
	visible: {
		opacity: 1,
		y: 0,
		delayChildren: 200,
    staggerChildren: 50,
	},

	hidden: {
		opacity: 0,
		delayChildren: 200,
    staggerChildren: 50,

		applyAtEnd: {
			y: -100,
		}
	}
}


export const favoriteCardAnimation = {
	show: {
		scaleY: 1,
		opacity: 1,

		applyAtStart: {
			display: "flex",
		},

		applyAtEnd: {
			scaleY: 1,
			opacity: 1,
		},

		delay: ({index}) => index * 200,
	},

	hide: {
		scaleY: 0,
		opacity: 0,

		applyAtEnd: {
			display: "none",
		},
	},
}
