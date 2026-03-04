const generateTimes = (startHour: number, endHour: number, stepMinutes = 30) => {
  const times: string[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += stepMinutes) {
      if (hour === endHour && min > 0) break;

      const h = String(hour).padStart(2, "0");
      const m = String(min).padStart(2, "0");

      times.push(`${h}:${m}`);
    }
  }

  return times;
};

export const TimeGroups = [
  {
    label: "Manhã",
    times: generateTimes(5, 12),
  },
  {
    label: "Tarde",
    times: generateTimes(13, 18),
  },
  {
    label: "Noite",
    times: generateTimes(19, 23),
  },
];
