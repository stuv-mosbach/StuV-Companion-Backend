const T_INDEX = 10;
const Z_INDEX = 19;

exports.iCalDateParser = (date) => {
  const year = date.substr(0, 4);
  const month = parseInt(date.substr(5, 2), 10) - 1;
  const day = date.substr(8, 2);
  const hour = date.substr(11, 2);
  const minute = date.substr(14, 2);
  const second = date.substr(17, 2);

  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

// 2018-04-19T18:00:00Z
