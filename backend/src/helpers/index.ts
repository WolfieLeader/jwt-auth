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
