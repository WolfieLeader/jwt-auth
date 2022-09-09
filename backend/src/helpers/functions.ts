export const convertErrorToString = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    console.log(error);
    return "Something went wrong";
  }
};

export const convertParamsToInt = (params: string): number[] | null => {
  if (params.length === 0) return null;

  if (Number.isInteger(Number(params))) {
    return [Number(params)];
  }
  if (params.includes(",")) {
    const ids = params.split(",");
    const array = ids.filter((id) => Number.isInteger(Number(id)));
    if (array.length === 0 || (array.length === 1 && array[0] === "")) return null;
    const numbers = array.map((id) => Number(id));
    return numbers;
  }
  return null;
};

enum Format {
  B = 1e9,
  M = 1e6,
  K = 1e3,
}

export const formatNumber = (stringedNumber: string): number => {
  if (!Number.isNaN(Number(stringedNumber))) {
    if (stringedNumber.includes(".")) return Number.parseFloat(stringedNumber);
    return Number(stringedNumber);
  }
  const number = Number(stringedNumber.slice(0, -1));
  const symbol = stringedNumber.slice(-1).toUpperCase();
  if (Number.isNaN(number)) return 0;
  if (Object.keys(Format).includes(symbol)) {
    const symbolOf = symbol as string as keyof typeof Format;
    return number * Format[symbolOf];
  }
  return number;
};

export const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const hasLettersDigitsSpacesOnly = (string: string): boolean => {
  const re = /^[a-zA-Z0-9 ]+$/;
  return re.test(string);
};
