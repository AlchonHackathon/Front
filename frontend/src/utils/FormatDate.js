
function formatDate(time){
  if (!time) {
    return '';
  }
  const createdAtDate = new Date(time);
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options)
                          .format(createdAtDate);

  return formattedDate;
};

module.exports = {
  formatDate,
};
