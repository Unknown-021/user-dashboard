import { memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import type { UseFormReturn } from 'react-hook-form';

import InputField from '../../../../../../components/ui/input-field';
import { requiredRuleValidation } from '../../../../../../constants/validation';
import { numberMask } from '../../../../../../constants/masks';
import type { EditUserFormValues } from './model';

interface CreateUserFormProps {
  methods: UseFormReturn<EditUserFormValues>;
}

const CreateUserForm = ({ methods }: CreateUserFormProps) => {
  return (
    <Flex flexDirection='column' maxW='xl' height='100%'>
      <Box mt='6' flex='1'>
        <Flex gap='4' flexDirection='column' maxW='xl'>
          <InputField
            name='firstName'
            label='First name'
            placeholder='Enter First name'
            register={methods.register}
            rules={requiredRuleValidation}
            error={methods.formState.errors.firstName?.message}
            required
          />

          <InputField
            name='lastName'
            label='Last name'
            placeholder='Enter Last name'
            register={methods.register}
            rules={requiredRuleValidation}
            error={methods.formState.errors.lastName?.message}
            required
          />

          <InputField
            name='phone'
            label='Phone'
            placeholder='Enter Phone'
            register={methods.register}
            rules={requiredRuleValidation}
            error={methods.formState.errors.phone?.message}
            mask={numberMask}
            required
          />

          <InputField
            name='email'
            label='Email'
            type='email'
            placeholder='Enter Email'
            register={methods.register}
            rules={requiredRuleValidation}
            error={methods.formState.errors.email?.message}
            required
          />

          <InputField
            name='ein'
            label='Ein'
            placeholder='Enter Ein'
            register={methods.register}
            rules={requiredRuleValidation}
            error={methods.formState.errors.ein?.message}
            mask={numberMask}
            required
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export default memo(CreateUserForm);
