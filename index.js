const fs = require('fs');
const crypto = require('crypto');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const path = require('path');


function readJsonFile(filename) {
	const fullPath = path.join(__dirname, 'data', filename);
	const data = fs.readFileSync(fullPath, 'utf-8');
	return JSON.parse(data);
}

function writeJsonFile(filename, data) {
	const fullPath =  path.join(__dirname, 'data', filename);
	const jsonData = JSON.stringify(data, null, 2);
	fs.writeFileSync(fullPath, jsonData, 'utf-8');
}

function createHash(target) {
	const hash = crypto.createHash('sha256').update(target.toString()).digest('hex');
	return hash;
}

async function createCompletion(messages, userId) {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: messages,
		user: userId,
	});
	return completion;
}

async function createConversation(prompt) {
	const timestamp = Date.now();
	const hash = createHash(timestamp);
	const completion = await createCompletion(prompt, hash.toString());
	const messages = [...prompt, completion.data.choices[0].message];
	const newConversation = {
		timestamp: timestamp,
		hash: hash,
		messages: messages,
	};
	return writeJsonFile(`${newConversation.hash}.json`, newConversation);
}

let prompt = [
	{role: "system", content: "Answer the user's joke with a funny, unexpected resposne."},
	{role: "user", content: "Why did the chicken cross the road?"}
];

createConversation(prompt);