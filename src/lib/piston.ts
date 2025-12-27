import axios from "axios";

const API_URL = "https://emkc.org/api/v2/piston/execute";

export const executeCode = async (language: string, sourceCode: string) => {
    const mapLanguage = (lang: string) => {
        switch (lang) {
            case "javascript": return "javascript";
            case "python": return "python";
            case "java": return "java";
            case "cpp": return "c++";
            default: return lang;
        }
    };

    const mapVersion = (lang: string) => {
        switch (lang) {
            case "javascript": return "18.15.0";
            case "python": return "3.10.0";
            case "java": return "15.0.2";
            case "c++": return "10.2.0";
            default: return "*";
        }
    }

    try {
        const response = await axios.post(API_URL, {
            language: mapLanguage(language),
            version: mapVersion(language),
            files: [
                {
                    content: sourceCode,
                },
            ],
        });
        return response.data;
    } catch (error) {
        console.error("Error executing code:", error);
        throw error;
    }
};
