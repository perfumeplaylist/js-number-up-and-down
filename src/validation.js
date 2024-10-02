const validation = {
  numberValidation: (value, min, max) => {
    if (isNaN(value)) return true;

    const isRangeCheck = value >= min && value <= max;
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
};

export default validation;
