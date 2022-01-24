export const toSQLString = (epoch: number): string => {
  const formattedDate = new Date(epoch);
  const year = formattedDate.getFullYear();
  const month = formattedDate.getMonth() + 1;
  const date = formattedDate.getDate();
  const hour = formattedDate.getHours();
  const minutes = formattedDate.getMinutes();
  const seconds = formattedDate.getSeconds();
  return `${year}-${month > 9 ? month : `0${month}`}-${date > 9 ? date : `0${date}`} ${hour > 9 ? hour : `0${hour}`}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
}