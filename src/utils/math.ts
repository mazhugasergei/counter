export const getGaussianOffset = (selectedIndex: number, index: number) => {
	const maxOffset = 23
	const sigma = 5
	const x = Math.abs(selectedIndex - index)
	const y = Math.exp(-(x ** 2 / (2 * sigma ** 2)))
	return y * maxOffset
}
