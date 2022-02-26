import tools from './tools'

const luminance = (color) => {
	const [r, g, b] = color
	return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
}

const bwContrast = (color) => {
	return luminance(color) > 127.5 ? 'black' : 'white'
}

const contrastColor = (color, f = undefined) => {
	if (color[0] == 255 && color[1] == 255 && color[2] == 255) return [0, 0, 0]
	return transformColor(color, f ? f : (c) => c)
}

const transformColor = (color, f) => {
	return [tools.boxValue(f(color[0], 0), 0, 255), tools.boxValue(f(color[1], 1), 0, 255), tools.boxValue(f(color[2], 2), 0, 255)]
}

const saturateColor = (color, s) => {
	if (color[0] == color[1] && color[1] == color[2]) return color
	let min = color.indexOf(Math.min.apply(null, color))
	const max = color.indexOf(Math.max.apply(null, color))
	const mid = [0, 1, 2].filter((i) => i !== min && i !== max)[0]
	let a = color[max] - color[min]
	const b = color[mid] - color[min]
	const x = color[max]
	const arr = [x, x, x]
	if (min === max) {
		min = 2
		a = 1
	}
	arr[max] = x
	arr[min] = Math.round(x * (1 - s))
	arr[mid] = Math.round(x * (1 - s + (s * b) / a))
	return arr
}

const rgb = (color) => {
	return `rgb(${color[0]},${color[1]},${color[2]})`
}

const RGBToHex = (color) => {
	let r = color[0].toString(16);
	let g = color[1].toString(16);
	let b = color[2].toString(16);

	if (r.length == 1)
		r = "0" + r
	if (g.length == 1)
		g = "0" + g
	if (b.length == 1)
		b = "0" + b

	return "#" + r + g + b
}

const hexToRGB = (color) => {
	let r = 0, g = 0, b = 0

	if (color.length == 4) {	// 3 digits
		r = "0x" + color[1] + color[1]
		g = "0x" + color[2] + color[2]
		b = "0x" + color[3] + color[3]
	} else if (color.length == 7) { // 6 digits
		r = "0x" + color[1] + color[2]
		g = "0x" + color[3] + color[4]
		b = "0x" + color[5] + color[6]
	}

	return [+r, +g, +b]
}

const hexColorToElems = (string) => {
/*	Take an input string, and replace <color> tags with appropriate HTML tags
	and also suggest an appropriate background color
	
	Regex match returns elements:
		0: full match
		1: outer prefix
		2: color wrapped elemend
		3: color
		4: inner text
		5: outer postfix
*/
	const colorRE = /(.*)(<color=(#[0-9a-f]{6})>(.*)<\/color>)(.*)/i
	const elems = string.match(colorRE)
	if (!elems || !elems[3]) // No <color> tag found, return original string with black color
		return {
			prefix: '',
			color: '#000000',
			text: string,
			postfix: '',
		}

	// Clamp green, it can be too bright. Other colors don't need clamping.
	const colorRGB = hexToRGB(elems[3])
	const clampedColor = RGBToHex([colorRGB[0], Math.min(colorRGB[1], 170), colorRGB[2]])

	return {
		prefix: elems[1],
		color: clampedColor,
		text: elems[4],
		postfix: elems[5],
	}
}

const colorSpan = (t) => {
	// Return a fully formatted span element instead of the elements
	const data = hexColorToElems(t)
	return `${data.prefix}<span style="color:${data.color};">${data.text}</span>${data.postfix}`
}

export default {
	luminance,
	bwContrast,
	contrastColor,
	transformColor,
	saturateColor,
	rgb,
	hexToRGB,
	RGBToHex,
	hexColorToElems,
	colorSpan,
}
