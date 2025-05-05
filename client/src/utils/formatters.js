// Format date as "May 5, 2025"
export function formatDate(dateInput) {
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  
  // Format date with time as "May 5, 2025, 3:45 PM"
  export function formatDateWithTime(dateInput) {
    const date = new Date(dateInput);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  