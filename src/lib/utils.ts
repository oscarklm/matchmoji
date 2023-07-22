export function scrambleArray<T>(array: T[]): T[] {
	const scrambledArray = [...array]; // Create a copy of the original array

	for (let i = scrambledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)); // Generate a random index

		// Swap elements at indices i and j
		[scrambledArray[i], scrambledArray[j]] = [scrambledArray[j], scrambledArray[i]];
	}

	return scrambledArray;
}
