require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

modules.exports.createCompletion = async function(messages) {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: messages,
	});
	return completion;
}