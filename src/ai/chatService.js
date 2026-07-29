import { getGLMConfig } from './glm';
import { SYSTEM_PROMPT } from './systemPrompt';

/**
 * Send a chat message with history to NVIDIA GLM API endpoint.
 * Supports streaming response chunks via fetch + Server-Sent Events.
 * @param {Array<{sender: string, message: string}>} historyMessages - Previous messages in conversation
 * @param {string} prompt - User's current prompt
 * @param {function} onChunk - Optional callback for streaming chunks
 * @returns {Promise<string>} Full response text
 */
export async function sendMessageToGLM(historyMessages, prompt, onChunk) {
    if (!navigator.onLine) {
        throw new Error('OFFLINE');
    }

    const { apiKey, baseUrl, model } = getGLMConfig();

    const messages = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    const maxHistory = 4;
    const recentHistory = historyMessages.filter(m => !m.isError && m.message).slice(-maxHistory);

    for (const msg of recentHistory) {
        const role = msg.sender === 'user' ? 'user' : 'assistant';
        messages.push({
            role,
            content: msg.message
        });
    }

    messages.push({
        role: 'user',
        content: prompt
    });

    let url = '/api/nvidia/chat/completions';
    const requestPayload = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            model,
            messages,
            stream: true,
            temperature: 0.5,
            max_tokens: 512
        })
    };

    try {
        let response;
        try {
            response = await fetch(url, requestPayload);
        } catch (fetchErr) {
            // Fallback to direct endpoint if relative proxy is not accessible
            const directUrl = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
            if (url !== directUrl) {
                url = directUrl;
                response = await fetch(url, requestPayload);
            } else {
                throw fetchErr;
            }
        }

        if (!response.ok) {
            const errText = await response.text();
            let errJson;
            try { errJson = JSON.parse(errText); } catch (_) {}
            
            const status = response.status;
            const errMsg = (errJson?.error?.message || errJson?.message || errText || '').toLowerCase();

            if (status === 401 || status === 403 || errMsg.includes('api key') || errMsg.includes('unauthorized')) {
                throw new Error('INVALID_API_KEY');
            } else if (status === 429 || errMsg.includes('quota') || errMsg.includes('rate')) {
                throw new Error('RATE_LIMIT');
            } else if (status === 504 || errMsg.includes('timeout')) {
                throw new Error('TIMEOUT');
            } else {
                const errObj = new Error('SERVER_ERROR');
                errObj.rawDetails = errJson?.error?.message || errJson?.detail || `HTTP ${status}: ${errText}`;
                throw errObj;
            }
        }

        if (onChunk && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let fullText = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith(':')) continue;

                    if (trimmed === 'data: [DONE]') {
                        continue;
                    }

                    if (trimmed.startsWith('data: ')) {
                        const jsonStr = trimmed.substring(6);
                        try {
                            const parsed = JSON.parse(jsonStr);
                            const delta = parsed.choices?.[0]?.delta;
                            const textPart = delta?.content || delta?.reasoning_content || parsed.choices?.[0]?.text || '';
                            if (textPart) {
                                fullText += textPart;
                                onChunk(fullText);
                            }
                        } catch (e) {
                            // Ignore partial JSON lines
                        }
                    }
                }
            }

            // Flush remaining buffer if present
            if (buffer.trim().startsWith('data: ') && !buffer.includes('[DONE]')) {
                try {
                    const parsed = JSON.parse(buffer.trim().substring(6));
                    const textPart = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.delta?.reasoning_content || '';
                    if (textPart) {
                        fullText += textPart;
                        onChunk(fullText);
                    }
                } catch (e) {}
            }

            return fullText;
        } else {
            const data = await response.json();
            return data.choices?.[0]?.message?.content || '';
        }
    } catch (error) {
        console.error('NVIDIA GLM Service Error:', error);
        
        if (['API_KEY_MISSING', 'INVALID_API_KEY', 'RATE_LIMIT', 'TIMEOUT', 'OFFLINE'].includes(error.message)) {
            throw error;
        }

        const errMsg = (error.message || '').toLowerCase();
        if (errMsg.includes('fetch failed') || errMsg.includes('network') || !navigator.onLine) {
            throw new Error('NETWORK_ERROR');
        }

        const errObj = new Error('SERVER_ERROR');
        errObj.rawDetails = error.rawDetails || error.message || String(error);
        throw errObj;
    }
}
