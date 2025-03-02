export const formatDate = (data: string): string => {

  const date = new Date(data);
  
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  }).format(date);

  const [year, month, day, weekday] = formattedDate.split('. ');
  return `${year}.${month}.${day} ${weekday}`
};

export const formatEndDate = (data: string | null): string => {
  if(!data) return '';

  data = formatDate(data);
  return data ? ` ~ ${data}`:'';
}