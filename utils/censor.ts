
export const censorText = (text: string, profanityList: string[]): string => {
    if (profanityList.length === 0) {
        return text;
    }

    const regex = new RegExp(`\\b(${profanityList.join('|')})\\b`, 'gi');
    
    return text.replace(regex, (match) => '*'.repeat(match.length));
};
