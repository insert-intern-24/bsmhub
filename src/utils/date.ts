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

// datetime을 넣었을 때 창립년도를 반환하는 함수
export const getFoundedYear = (dateString: string | null): number => {
  if (!dateString) return -1;

  const date = new Date(dateString);
  // 유효하지 않은 날짜인 경우 -1 반환
  if (isNaN(date.getTime())) return -1;

  return date.getFullYear();
}