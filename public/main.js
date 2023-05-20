const solvePuzzle = require('../utils/puzzle.js')

module.exports.submitMessage = async function(message, difficulty) {
	const nonce = solvePuzzle(difficulty);
	const response = await fetch('/submit', {
		method: post,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			message: message,
			difficulty: difficulty,
			nonce: nonce,
		}),
	});
	if (response.ok) {
		const data = await response.json();
		console.log(data);
	} else {
		console.error('Error:', response.status);
	}
}