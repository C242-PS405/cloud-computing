// user-agent.js
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userAgents = JSON.parse(
    await readFile(path.resolve(__dirname, './user-agent-list.json'), 'utf8')
);

class UserAgent {
    constructor() {
        this.userAgents = userAgents.browsers;
    }
    getUserAgent() {
        // Pilih browser secara acak
        const browsers = Object.keys(this.userAgents);
        if (browsers.length === 0) {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        }

        const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
        const userAgentList = this.userAgents[randomBrowser];

        return userAgentList[Math.floor(Math.random() * userAgentList.length)];
    }
}

export default new UserAgent();