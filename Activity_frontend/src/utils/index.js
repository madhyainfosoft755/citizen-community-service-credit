export const handleSectionNavigation = (id) => {
  const element = document.getElementById(id);
  const offset = 45;
  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element?.getBoundingClientRect().top ?? 0;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export function convertToHours(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalHours = hours + minutes / 60;

  return Number((totalHours * 10).toFixed(2));
}

export function convertToHoursWithoutPoints(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalHours = hours + minutes / 60;

  return Number(totalHours.toFixed(2));
}

export function formatDate(timestamp) {
  if (!timestamp) {
    return null;
  }
  const date = new Date(timestamp);

  const year = date.getFullYear().toString().slice(); // Get last two digits of the year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
