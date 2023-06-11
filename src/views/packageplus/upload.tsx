import React, { ChangeEvent, useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import axios, { AxiosResponse } from 'axios';

type Props = {
  selectedfile: File | null;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function UploadFile({ handleChange, selectedfile }: Props) {
  return (
    <Button
      colorScheme={'green'}
      bg={'green.400'}
      as="label"
      rounded={'full'}
      px={6}
      _hover={{
        bg: 'green.500',
      }}
    >
      <Input
        type="file"
        id="file-upload"
        display="none"
        accept=".json"
        onChange={handleChange}
      />
      {selectedfile ? selectedfile.name : 'Scan a package.json file'}
    </Button>
  );
}

export default UploadFile;
