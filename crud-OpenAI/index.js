import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";
import { delete_customer } from './services/delete_customer.js';
import { get_customer } from './services/get_customer.js';
import { save_update_customer } from './services/save_update_customer.js';

// Add the functions to the global object
global.save_update_customer = save_update_customer;
global.get_customer = get_customer;
global.delete_customer = delete_customer;


dotenv.config();



const app = express();
app.use(bodyParser.json());


app.use((req, res, next) => {
    const allowedOrigins = ["http://localhost:4200"];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

const openai = new OpenAI(process.env.OPENAI_API_KEY);
let assistant_id = process.env.OPENAI_ASSISTANT_ID;


let threadId;


const threadResponse = await openai.beta.threads.create(); // Create new thread
console.log('Thread ID', threadResponse.id)
threadId = threadResponse.id;


app.post("/openai/chat", async (req, res) => {
    try {
        if (!req.body.message) {
            return res.status(400).json({ error: "Message field is required" });
        }
        const userMessage = req.body.message;
        // Create a Thread
        const threadResponse = await openai.beta.threads.create();
        const threadId = threadResponse.id;
        // Add a Message to a Thread
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: userMessage,
        });
        // Run the Assistant
        const runResponse = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistant_id,
        });
        // Check the Run status
        let run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
        while (run.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
            if (run.status === "requires_action") {
                const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
                const toolOutputs = [];
               // console.log('\n------\n', toolCalls, '\n------');
                for (const toolCall of toolCalls) {
                    const functionName = toolCall.function.name;
                    console.log(`This question requires us to call a function: ${functionName}`);
                    const args = JSON.parse(toolCall.function.arguments);
                    const output = await global[functionName].apply(null, [args]);
                    toolOutputs.push({ tool_call_id: toolCall.id, output: output, });
                }
                // Submit tool outputs
                await openai.beta.threads.runs.submitToolOutputs(threadId, runResponse.id, { tool_outputs: toolOutputs });
                continue; // Continue polling for the final response
            }
            if (["failed", "cancelled", "expired"].includes(run.status)) {
                console.log(`Run status is '${run.status}'. Unable to complete the request.`);
                break;
            }
        }
        const messages = await openai.beta.threads.messages.list(threadId);
        // Find the last message for the current run
        const lastMessageForRun = messages.data
            .filter(
                (message) =>
                    message.run_id === run.id && message.role === "assistant"
            )
            .pop();
        res.json({ response: lastMessageForRun.content[0].text.value });
    } catch (error) {
        console.error("Error processing chat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

















const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});