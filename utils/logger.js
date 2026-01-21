export const logEvent = (type, data = {}) => {
  const timestamp = new Date().toISOString();

  console.log(
    JSON.stringify({
      timestamp,
      type,
      ...data,
    })
  );
};
