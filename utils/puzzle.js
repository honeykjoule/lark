const crypto = require('crypto');

module.exports.createHash = function(target) {
	const hash = crypto.createHash('sha256').update(target.toString()).digest('hex');
	return hash;
}

module.exports.solvePuzzle = function(difficulty) {
	const target = Array(difficulty + 1).join('0');
	let nonce = 0;
	let hash;
		do {
			nonce++;
			hash = createHash(nonce);
		} while (hash.substring(0, difficulty) !== target);
		return nonce;
}