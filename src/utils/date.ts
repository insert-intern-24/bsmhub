export const formatDate = (data: string): string => {
  const date = new Date(data);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  }).format(date);
};