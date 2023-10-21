require("dotenv").config();
const {
  Bot,
  Keyboard,
  InlineKeyboard,
  GrammyError,
  HttpError,
} = require("grammy");
const {
  getRandomQuestion,
  getCorrectAnswer,
} = require("./shared/helpers/utils");

const questions = require("./questions.json");

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (ctx) => {
  const keyboard = new Keyboard()
    .text("CSS")
    .text("JS")
    .row()
    .text("Typescript")
    .text("React")
    .resized();

  await ctx.reply(
    "Привет! Я Front-end @Interview Bot \nЯ помогу подготовится вам к интервью!"
  );

  await ctx.reply("Выберите тему интервью в меню!", {
    reply_markup: keyboard,
  });
});

bot.hears(["JS", "CSS", "Typescript", "React"], async (ctx) => {
  const topic = ctx.message.text.toLowerCase();
  const question = getRandomQuestion(topic);
  const inlineKeyboard = new InlineKeyboard().text(
    "Узнать ответ",
    JSON.stringify({
      type: topic,
      questionId: question.id,
    })
  );

  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard,
  });
});

bot.on("callback_query:data", async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data);
  const answer = getCorrectAnswer(callbackData.type, callbackData.questionId);

  await ctx.reply(answer, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  await ctx.answerCallbackQuery();

  return;
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
