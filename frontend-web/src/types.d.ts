declare module '*.css';

declare interface Grade {
    studentResponse: string;
    grades?: {
        [key: string]: {
            score: number;
            reasoning: string;
        };
    };
}
