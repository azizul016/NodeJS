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
  };
};

const generateCommentDoc = ({ _id, title, text, user, createdAt }) => {
  return { _id, title, text, user, createdAt };
};

module.exports = {
  generateIdeaDoc,
  generateCommentDoc,
};
