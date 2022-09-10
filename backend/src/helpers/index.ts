import { connectionSettings, defaultUsers, secretKey } from "./defaultSettings";
import { saltIt, compareSalt, hashIt } from "./encrypt";
import {
  convertErrorToString,
  convertParamsToInt,
  formatNumberToString,
  formatStringToNumber,
  validateEmail,
  hasLettersDigitsSpacesOnly,
} from "./functions";

export {
  connectionSettings,
  defaultUsers,
  secretKey,
  saltIt,
  compareSalt,
  convertErrorToString,
  convertParamsToInt,
  formatNumberToString,
  formatStringToNumber,
  validateEmail,
  hasLettersDigitsSpacesOnly,
  hashIt,
};
