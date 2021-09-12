module.exports = function generateIdeaDoc(
  id,
  title,
  description,
  allowComments,
  status,
  tags
) {
  return {
    id,
    title,
    description,
    allowComments,
    status,
    tags,
  };
};
