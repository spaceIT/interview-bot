const questions = require("../../questions.json");

const getRandomQuestion = (topic) => {
  const randomQuestionIndex = Math.floor(
    Math.random() * questions[topic].length
  );
  return questions[topic][randomQuestionIndex];
};

const getCorrectAnswer = (topic, id) => {
  const question = questions[topic].find((question) => question.id === id);

  return question.answer;
};

module.exports = { getRandomQuestion, getCorrectAnswer };
