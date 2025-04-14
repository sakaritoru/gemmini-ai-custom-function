export interface CustomFunction {
  name: string;
  description: string;
  parameters: CustomFunctionParameter[];
}

export interface CustomFunctionParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}