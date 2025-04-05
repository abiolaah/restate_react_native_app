export const formatLocalDate = (dateString: string) => {
    const date = new Date(dateString);
    // Convert to local timezone and format
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC' // Add this to use UTC timezone
    });
};