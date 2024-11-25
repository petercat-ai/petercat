export function isUrl(url?: string): boolean {
    if (!url) {
        return false;
    }
    const regex = /^https:\/\/[^\s/$.?#].[^\s]*$/;
    return regex.test(url);
}