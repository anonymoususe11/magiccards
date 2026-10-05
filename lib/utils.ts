export function formatBirthdayDate(
  dateString?: string | null
): string | null {
  if (!dateString) return null;

  const parts = dateString.split("-");

  if (parts.length === 3) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      Number.isInteger(day)
    ) {
      const date = new Date(year, month - 1, day);

      return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    }
  }

  return dateString;
}
