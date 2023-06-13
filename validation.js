const Joi = require("joi");
let today = new Date();
let month = `${today.getMonth() + 1}`.padStart(2, "0");
let startDay = `${today.getDate()}`.padStart(2, "0");
let dateString = `${today.getFullYear()}-${month}-${startDay}`;
const editValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.empty": "請填入用戶名稱",
      "string.min": "用戶名稱不得小於3個字",
      "string.max": "用戶名稱不得大於50個字",
    }),
  });
  return schema.validate(data);
};
const passwordValidation = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().min(8).max(255).required().messages({
      "string.empty": "請填入舊密碼",
      "string.min": "舊密碼不得小於8個字",
      "string.max": "舊密碼不得大於255個字",
    }),
    newPassword: Joi.string().min(8).max(255).required().messages({
      "string.empty": "請填入新密碼",
      "string.min": "新密碼不得小於8個字",
      "string.max": "新密碼不得大於255個字",
    }),
  });
  return schema.validate(data);
};
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.base": "用戶名稱請填入文字",
      "string.empty": "請填入用戶名稱",
      "string.min": "用戶名稱不得小於3個字",
      "string.max": "用戶名稱不得大於50個字",
    }),
    email: Joi.string().min(6).max(50).email().required().messages({
      "string.empty": "請填入電子信箱",
      "string.email": "請填入有效的電子信箱",
      "string.min": "電子信箱不得小於6個字",
      "string.max": "電子信箱不得大於50個字",
    }),
    password: Joi.string().min(8).max(255).required().messages({
      "string.empty": "請填入密碼",
      "string.min": "密碼不得小於8個字",
      "string.max": "密碼不得大於255個字",
    }),
  });
  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).email().required().messages({
      "string.empty": "請填入電子信箱",
      "string.email": "請填入有效的電子信箱",
      "string.min": "電子信箱不得小於6個字",
      "string.max": "電子信箱不得大於50個字",
    }),
    password: Joi.string().min(8).max(255).required().messages({
      "string.empty": "請填入密碼",
      "string.min": "密碼不得小於8個字",
      "string.max": "密碼不得大於255個字",
    }),
  });
  return schema.validate(data);
};

const courtValidation = (data) => {
  const schema = Joi.object({
    date: Joi.date().greater("now").required().messages({
      "date.greater": "輸入日期須大於今日",
      "any.required": "請填入日期",
      "date.base": "請填入有效的日期格式",
    }),
    startTime: Joi.string()
      .length(5)
      .pattern(/^([0-2]{1}[0-9]{1})\:([0-5]{1}[0-9]{1})$/)
      .required()
      .messages({
        "string.pattern.base": "請填入有效的時間格式",
        "string.empty": "請填入時間",
        "string.length": "請填入有效的時間格式",
      }),
    duration: Joi.number().required().min(1).max(24).messages({
      "number.base": "請填入有效的時長",
      "any.required": "請填入時長",
      "number.min": "時長不得小於1小時",
      "number.max": "時長不得大於24小時",
    }),
    location: Joi.string().required().min(6).max(255).messages({
      "string.base": "地點請填入文字",
      "string.empty": "請填入地點",
      "string.min": "地點不得小於6個字",
      "string.max": "地點不得大於255個字",
    }),
    court: Joi.number().required().min(1).max(9999).integer().messages({
      "number.base": "請填入有效的場地數目",
      "any.required": "請填入場地數目",
      "number.min": "場地數目不得小於1",
      "number.max": "場地數目不得大於9999",
      "number.integer": "場地數目應為整數",
    }),
    amount: Joi.number().required().min(1).max(9999).integer().messages({
      "number.base": "請填入有效的人數",
      "any.required": "請填入人數",
      "number.min": "人數不得小於1",
      "number.max": "人數不得大於9999",
      "number.integer": "人數應為整數",
    }),
    price: Joi.number().required().min(10).max(9999).integer().messages({
      "number.base": "請填入有效的價格",
      "any.required": "請填入價格",
      "number.min": "價格不得小於10",
      "number.max": "價格不得大於9999",
      "number.integer": "價格應為整數",
    }),
    description: Joi.string().min(6).max(255).messages({
      "string.base": "描述請填入文字",
      "string.empty": "請填入描述",
      "string.min": "描述不得小於6個字",
      "string.max": "描述不得大於255個字",
    }),
    group: Joi.string().required().messages({
      "string.empty": "請選擇球隊",
    }),
  });
  return schema.validate(data);
};

const groupValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(50).required().messages({
      "string.base": "球隊名稱請填入文字",
      "string.empty": "請填入球隊名稱",
      "string.min": "球隊名稱不得小於6個字",
      "string.max": "球隊名稱不得大於50個字",
    }),
    description: Joi.string().min(6).max(255).required().messages({
      "string.base": "描述請填入文字",
      "string.empty": "請填入描述",
      "string.min": "描述不得小於6個字",
      "string.max": "描述不得大於255個字",
    }),
    amount: Joi.number().required().min(1).max(9999).integer().messages({
      "number.base": "請填入有效的人數上限",
      "any.required": "請填入人數上限",
      "number.min": "人數上限不得小於1",
      "number.max": "人數上限不得大於9999",
      "number.integer": "人數上限應為整數",
    }),
  });
  return schema.validate(data);
};
const searchValidation = (data) => {
  {
    const schema = Joi.object({
      startDate: Joi.date().min(dateString).required().messages({
        "date.min": "起始日期最小值為今日",
        "any.required": "請填入起始日期",
        "date.base": "起始日期: 請填入有效的日期格式",
      }),
      endDate: Joi.date().greater(Joi.ref("startDate")).messages({
        "date.greater": "結束日期須大於起始日期",
        "any.required": "請填入結束日期",
        "date.base": "結束日期: 請填入有效的日期格式",
      }),
      withoutFull: Joi.boolean().messages({
        "boolean.base": "請選擇是否顯示額滿的場次",
      }),
    });
    return schema.validate(data);
  }
};
const numberValidation = (data) => {
  const schema = Joi.object({
    startDate: Joi.date().min(dateString).required().messages({
      "date.min": "起始日期最小值為今日",
      "any.required": "請填入起始日期",
      "date.base": "起始日期: 請填入有效的日期格式",
    }),
    endDate: Joi.date().greater(Joi.ref("startDate")).messages({
      "date.greater": "結束日期須大於起始日期",
      "any.required": "請填入結束日期",
      "date.base": "結束日期: 請填入有效的日期格式",
    }),
    withoutFull: Joi.boolean().messages({
      "boolean.base": "請選擇是否顯示額滿的場次",
    }),
    type: Joi.string().required().messages({
      "string.empty": "請選擇搜尋的類別",
    }),
    searchInput: Joi.number().required().min(1).max(9999).integer().messages({
      "number.base": "請填入有效的數目",
      "any.required": "請在搜尋欄位填入數目",
      "number.min": "數目不得小於1",
      "number.max": "數目不得大於9999",
      "number.integer": "數字應為整數",
    }),
  });
  return schema.validate(data);
};
const stringValidation = (data) => {
  const schema = Joi.object({
    startDate: Joi.date().min(dateString).required().messages({
      "date.min": "起始日期最小值為今日",
      "any.required": "請填入起始日期",
      "date.base": "起始日期: 請填入有效的日期格式",
    }),
    endDate: Joi.date().greater(Joi.ref("startDate")).messages({
      "date.greater": "結束日期須大於起始日期",
      "any.required": "請填入結束日期",
      "date.base": "結束日期: 請填入有效的日期格式",
    }),
    withoutFull: Joi.boolean().messages({
      "boolean.base": "請選擇是否顯示額滿的場次",
    }),
    type: Joi.string().required().messages({
      "string.empty": "請選擇搜尋的類別",
    }),
    searchInput: Joi.string().required().messages({
      "string.empty": "請在搜尋欄位填入文字",
    }),
  });
  return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courtValidation = courtValidation;
module.exports.groupValidation = groupValidation;
module.exports.editValidation = editValidation;
module.exports.passwordValidation = passwordValidation;
module.exports.searchValidation = searchValidation;
module.exports.numberValidation = numberValidation;
module.exports.stringValidation = stringValidation;
