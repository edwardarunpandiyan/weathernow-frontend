// Date Time Utilities

// Get current format time
export const formatNowTime = (locationNow, minute) => {
    if (!locationNow || minute === null) return '';

    // "2026-02-08T16:41:26.110229+05:30"
    const timePart = locationNow.split('T')[1];
    const hour24 = parseInt(timePart.slice(0, 2), 10);

    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

    const minuteLabel = minute.toString().padStart(2, '0');

    return `${hour12}:${minuteLabel} ${period}`;
};
