const getUserIdFromEmail = (email: string) => {
  const [userId] = email.split('@');
  return userId;
};
export { getUserIdFromEmail };
