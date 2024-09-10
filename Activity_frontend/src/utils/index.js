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
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalHours = hours + (minutes / 60);
  
  return Number((totalHours*20).toFixed(2));;
}

export function convertToHoursWithoutPoints(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalHours = hours + (minutes / 60);
  
  return Number((totalHours).toFixed(2));;
}