export const generateToken = (length: number) => {
  let opt = "";

  for (let i = 0; i < length; i++) {
    opt += Math.floor(Math.random() * 10);
  }

  return opt;
};
