import CONSTANT from "./constant.js";

// view를 다루면 안될것 같음

const validation = {
  numberValidation: (value) => {
    if (isNaN(value)) return true;

    const isRangeCheck = value >= 1 && value <= 50;
    return !isRangeCheck;
  },
  sameValidation: (value, temp) => {
    const isSameValue = temp.some((tempValue) => tempValue === value);
    return isSameValue;
  },

  validateInput: (input, tempValue) => {
    const regex = new RegExp(`^${tempValue}$`, "i");
    return regex.test(input);
  },

  isSameValue: (value, temp) => {
    return value === temp;
  },

  main: (type, temp, tempValue) => {
    let result = false;
    switch (type) {
      case "number": {
        result =
          validation.numberValidation(temp) ||
          validation.sameValidation(temp, tempValue);

        break;
      }
      case "retry": {
        result = validation.validateInput(temp, CONSTANT.MESSAGE.YES);

        break;
      }
    }

    return result;
  },
};

export default validation;
