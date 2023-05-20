const fs = require('fs');
const crypto = require('crypto');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();

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

function solvePuzzle(difficulty) {
	const target = Array(difficulty + 1).join('0');
	let nonce = 0;
	let hash;
		do {
			nonce++;
			hash = createHash(nonce);
		} while (hash.substring(0, difficulty) !== target);
		return nonce;
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
	const hash = createHash(prompt);
	//const completion = await createCompletion(prompt, hash.toString());
	//const messages = [...prompt, completion.data.choices[0].message];
	const messages = prompt
	const newConversation = {
		timestamp: timestamp,
		messages: [{message: prompt, hash: hash}],
	};
	return writeJsonFile(`${newConversation.messages[0].hash}.json`, newConversation);
}

async function promptConversation(filename, userInput) {
	const prompt = {role: "user", content: `${userInput}`};
	const data = await readJsonFile(filename);
	const latestMessage = data.messages[data.messages.length - 1];
	const latestHash = latestMessage.hash;
	const messagesWithoutHashes = data.messages.map(item => item.message)
	const messages = [...messagesWithoutHashes, prompt];
	const flatMessages = [].concat(...messages);
	console.log(messages);
	console.log(flatMessages);
	const completion = await createCompletion(flatMessages, "1234");
	const promptHash = createHash(latestHash + JSON.stringify(prompt));
	data.messages.push({message: prompt, hash: promptHash});
	const newMessage = completion.data.choices[0].message;
	const newHash = createHash(promptHash + JSON.stringify(newMessage));
	data.messages.push({message: newMessage, hash: newHash});
	await writeJsonFile(filename, data);
}

async function submitMessage(message, difficulty) {
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
		console.error('Error': response.status);
	}
}

let filename = "e9ac49b59018eed59259d533df2a14021177340587f3b263ef013edc5803a18f.json"

let prompt = [
	{role: "system", content: "Answer the user's joke with a funny, unexpected resposne."},
	{role: "user", content: "Why did the chicken cross the road?"},
	{role: "assistant", content: "You'll never know"}
];



let userInput = "Knock knock"

promptConversation(filename, userInput);

//createConversation(prompt);