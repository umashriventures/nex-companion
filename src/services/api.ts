import axios from 'axios';
import { auth } from '@/lib/firebase';

const API_BASE_URL = 'https://api.nex.umashriventures.co';

const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiInstance.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export interface InteractResponse {
    reply: string;
    messages_remaining_today: number;
    tier: string;
}

export const api = {
    bootstrap: async () => {
        // Bootstrap needs to be called after login to ensure user record exists/is synced
        // The token is handled by the interceptor
        const response = await apiInstance.post('/auth/bootstrap');
        return response.data;
    },

    interact: async (input: string): Promise<InteractResponse> => {
        const response = await apiInstance.post('/nex/interact', { input });
        return response.data;
    },

    getMemories: async () => {
        const response = await apiInstance.get('/memory');
        return response.data;
    },

    createMemory: async (content: string) => {
        const response = await apiInstance.post('/memory', { content });
        return response.data;
    },

    getSubscriptionStatus: async () => {
        const response = await apiInstance.get('/subscription/status');
        return response.data;
    },

    upgradeSubscription: async (tier: string) => {
        // API docs say "new_tier" and "subscription_expiry" (string) in body.
        // Assuming expiry is calculated on backend or we mock it for now? 
        // The request body example shows:
        // { "new_tier": "TIER_1", "subscription_expiry": "string" }
        // I will pass these as arguments.
        const response = await apiInstance.post('/subscription/upgrade', {
            new_tier: tier,
            // For now sending empty string or ISO string? The docs say "string".
            // Often subscription upgrades are immediate. I'll pass a far future date or similar if required by backend,
            // but typically backend handles this. I'll just send the tier for now and see if it fails.
            // Actually, let's provide a dummy expiry if it's required.
            subscription_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        return response.data;
    }
};
