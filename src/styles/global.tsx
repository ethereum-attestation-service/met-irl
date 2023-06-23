import { theme } from "../utils/theme";

export const globalInputStyle = `
  border: 1px solid ${theme.neutrals["cool-grey-200"]};
  color: ${theme.neutrals["cool-grey-500"]};
  padding: 16px 18px;
  box-sizing: border-box;
  border-radius: 4px;
  width: 100%;
  outline: 0;
  margin-top: 4px;
  
  ::placeholder { 
    color: ${theme.neutrals["cool-grey-300"]};
  }
`;
