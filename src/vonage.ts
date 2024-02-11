import axios, { AxiosResponse } from 'axios';

export async function sendVerificationRequest(apiKey: string, apiSecret: string, number: string, brand: string): Promise<any> {
    const url = "https://api.nexmo.com/verify/json";
    const params = {
        api_key: apiKey,
        api_secret: apiSecret,
        number: number,
        brand: brand
    };

    try {
        const response: AxiosResponse<any> = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to send verification request: ${error}`);
    }
}

export async function verifyCode(apiKey: string, apiSecret: string, requestId: string, code: string): Promise<any> {
    const url = "https://api.nexmo.com/verify/check/json";
    const params = {
        api_key: apiKey,
        api_secret: apiSecret,
        request_id: requestId,
        code: code
    };

    try {
        const response: AxiosResponse<any> = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to verify code: ${error}`);
    }
}