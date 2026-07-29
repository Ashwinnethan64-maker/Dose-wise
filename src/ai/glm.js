// Configuration module for NVIDIA GLM-5.2 API client

export function getGLMConfig() {
    const apiKey = import.meta.env.VITE_GLM_API_KEY;
    const baseUrl = import.meta.env.VITE_GLM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    const model = import.meta.env.VITE_GLM_MODEL || 'z-ai/glm-5.2';

    if (!apiKey) {
        throw new Error('API_KEY_MISSING');
    }

    return {
        apiKey,
        baseUrl,
        model
    };
}
