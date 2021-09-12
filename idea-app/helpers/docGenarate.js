module.exports = function generateIdeaDoc(
  id,
  title,
  description,
  allowComments,
  status
) {
  return {
    id,
    title,
    description,
    allowComments,
    status,
  };
};
