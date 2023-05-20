const createHash = require('../utils/puzzle.js');
const sovlePuzzle = require('../utils/puzzle.js');
const { readJsonFile, writeJsonFile } = require('../utils/json.js');
const createCompletion = require('../controllers/openaiControllers.js');

module.exports = {
    createConversation: async function(prompt, difficulty) {
        const nonce = sovlePuzzle(difficulty);
        const timestamp = Date.now();
        const hash = createHash(prompt + nonce);
        const messages = prompt
        const newConversation = {
            timestamp: timestamp,
            messages: [{message: prompt, hash: hash, nonce: nonce}],
        };
        return writeJsonFile(`${newConversation.messages[0].hash}.json`, newConversation);
    },
    promptConversation: async function(filename, userInput, difficulty) {
        const nonce = sovlePuzzle(difficulty);
        const prompt = {role: "user", content: `${userInput}`};
        const data = await readJsonFile(filename);
    
        const latestMessage = data.messages[data.messages.length - 1];
        const latestHash = latestMessage.hash;
        
        const messagesOnly = data.messages.map(item => item.message)
        const messages = [...messagesOnly, prompt];
        
        const flatMessages = [].concat(...messages);
        
        const completion = await createCompletion(flatMessages);
        const newMessage = completion.data.choices[0].message;
    
        const promptHash = createHash(latestHash + JSON.stringify(prompt));
        const newHash = createHash(promptHash + JSON.stringify(newMessage));

        data.messages.push({message: prompt, hash: promptHash, nonce: nonce});	
        data.messages.push({message: newMessage, hash: newHash, nonce: nonce});
        
        await writeJsonFile(filename, data);
    },
}