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

export const formatNumber = (stringedNumber: string): number => {
  const list = [{ symbol: "B", value: 1e9 }, , { symbol: "M", value: 1e6 }, { symbol: "K", value: 1e3 }];
  const number = Number(stringedNumber.slice(0, -1));
  const symbol = stringedNumber.slice(-1);
  const value = list.find((item) => item?.symbol === symbol)?.value;
  if (value) {
    return number * value;
  }
  return number;
};
