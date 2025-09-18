import dayjs from 'dayjs';

const weekNames = ['일', '월', '화', '수', '목', '금', '토'];

export const formatDate = (data: string): string => {
  const date = new Date(data);

  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).format(date);

  const [year, month, day, weekday] = formattedDate.split('. ');
  return `${year}.${month}.${day} ${weekday}`;
};

export const formatDateWithDayjs = (dateString: string): string => {
  const d = dayjs(dateString);
  return `${d.format('YYYY.MM.DD')}(${weekNames[d.day()]})`;
};

export const formatPeriod = (start: string, end: string): string => {
  return `${formatDateWithDayjs(start)} ~ ${formatDateWithDayjs(end)}`;
};

export const formatEndDate = (data: string | null): string => {
  if (!data) return '';

  data = formatDate(data);
  return data ? ` ~ ${data}` : '';
};
