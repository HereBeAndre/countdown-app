import { formatCountdown } from './countdown.util';
import { INTERVAL } from './constants';

const getTomorrowDate = () =>
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1
  );

const isValidDate = (date: Date | null) =>
  date instanceof Date && !isNaN(date.getTime());

export { INTERVAL, formatCountdown, getTomorrowDate, isValidDate };
