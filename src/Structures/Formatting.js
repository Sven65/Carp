/**
 * @module Formatting
 */

/**
 * @typedef Formats
 * @type {object}
 * @property {string} BOLD
 * @property {string} ITALIC
 * @property {string} UNDERLINE
 * @property {string} REVERSE
 * @property {string} PLAIN
 * @property {string} COLOR_CODE
 * @property {object} COLORS
 * @property {string} COLORS.WHITE
 * @property {string} COLORS.BLACK
 * @property {string} COLORS.´NAVY
 * @property {string} COLORS.GREEN
 * @property {string} COLORS.RED
 * @property {string} COLORS.MAROON
 * @property {string} COLORS.PURPLE
 * @property {string} COLORS.OLIVE
 * @property {string} COLORS.YELLOW
 * @property {string} COLORS.LIGHT_GREEN
 * @property {string} COLORS.TEAL
 * @property {string} COLORS.CYAN
 * @property {string} COLORS.ROYAL_BLUE
 * @property {string} COLORS.MAGENTA
 * @property {string} COLORS.GRAY
 * @property {string} COLORS.LIGHT_GRAY
 */

 /**
  * @type {Formats}
  */
module.exports = {
	BOLD: "\u0002",
	ITALIC: "\u001D",
	UNDERLINE: "\u001F",
	REVERSE: "\u0016",
	PLAIN: "\u000F",

	COLOR_CODE: "\u0003",

	COLORS: {

		WHITE: "0",
		BLACK: "1",
		NAVY: "2",
		GREEN: "3",
		RED: "4",
		MAROON: "5",
		PURPLE: "6",
		OLIVE: "7",
		YELLOW: "8",
		LIGHT_GREEN: "9",
		TEAL: "10",
		CYAN: "11",
		ROYAL_BLUE: "12",
		MAGENTA: "13",
		GRAY: "14",
		LIGHT_GRAY: "15"
	}
}