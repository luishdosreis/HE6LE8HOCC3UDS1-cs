export const validateArgs = (args: string): Error | true => {
  // const validArgumentRegex = /^[a-zA-Z0-9_.-\/,]+$/;
  if (typeof args !== "string") {
    throw new Error("arguments are not a string");
  }

  // if (!validArgumentRegex.test(args)) {
  //   throw new Error("arguments failed validation");
  // }

  return true;
};
