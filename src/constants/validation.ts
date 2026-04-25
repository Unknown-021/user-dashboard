import type { Definitions } from 'imask';
import type { RegisterOptions } from 'react-hook-form';

export const requiredRuleTitle = 'This field is required';
export const requiredRuleValidation: Pick<RegisterOptions, 'required'> = {
  required: { value: true, message: 'This field is required' },
};

const codeMaskDefinitions: Definitions = {
  '#': /[A-Z0-9\-_ ]/,
};

export const codePropsValidation = {
  maskProps: {
    mask: '#'.repeat(64),
    definitions: codeMaskDefinitions,
  },
  registerValidationProps: {
    maxLength: 64,
    pattern: /^(?!\s)(?!.*\s$)/,
    required: requiredRuleValidation.required,
  },
};

export default { requiredRuleTitle, requiredRuleValidation, codePropsValidation };
