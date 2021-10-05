const generateIdeaDoc = ({
  _id,
  title,
  description,
  allowComments,
  status,
  tags,
  user,
  createdAt,
  comments,
  categories,
}) => {
  return {
    _id,
    title,
    description,
    allowComments,
    status,
    tags,
    user,
    createdAt,
    comments,
    categories,
  };
};

const generateCommentDoc = ({ _id, title, text, user, createdAt }) => {
  return { _id, title, text, user, createdAt };
};

module.exports = {
  generateIdeaDoc,
  generateCommentDoc,
};
