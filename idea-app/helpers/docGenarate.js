const generateIdeaDoc = (
  id,
  title,
  description,
  allowComments,
  status,
  tags,
  user,
  createdAt,
  comments
) => {
  return {
    id,
    title,
    description,
    allowComments,
    status,
    tags,
    user,
    createdAt,
    comments,
  };
};

const generateCommentDoc = (id, title, text, user, createdAt) => {
  return { id, title, text, user, createdAt };
};

module.exports = {
  generateIdeaDoc,
  generateCommentDoc,
};
