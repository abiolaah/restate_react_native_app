export const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    // Use UTC methods to avoid timezone issues
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // Months are 0-indexed
    const day = date.getUTCDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

export const formatLocalDate = (dateString: string) => {
    // Parse the date string as UTC and return in YYYY-MM-DD format
    return new Date(dateString).toISOString().split('T')[0];
};

export const formatDateForListDisplay = (dateString: string) => {
    const date = new Date(dateString);
    // Use UTC methods to avoid timezone issues
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth(); // Months are 0-indexed
    const day = date.getUTCDate();

    const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
        "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    const monthName = monthNames[month];

    return `${monthName} ${day}, ${year}`;
};