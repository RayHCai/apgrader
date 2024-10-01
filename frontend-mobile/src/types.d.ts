// Styles should be imported as modules
declare module '*.css';

declare interface Grade {
    [key: string]: {
        score: number;
        reasoning: string;
    };
}
