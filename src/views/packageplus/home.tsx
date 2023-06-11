import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import UploadFile from './upload';
import AnalysisTable from './table';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { Button, Center, Skeleton } from '@chakra-ui/react';

type Props = {};

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [clearAll, setClearAll] = useState<boolean>(false);
  const [getDatafromthefile, setDatafromthefile] = useState<any>(null);
  const [getDatafromtheResponse, setDatafromtheResponse] = useState<any>(null);

  const controller = new AbortController();
  const signal = controller.signal;

  const readJsonFile = (file: Blob) =>
    new Promise((resolve, reject) => {
      setLoading(true);
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        if (event.target) {
          resolve(JSON.parse(event.target.result as string));
        }
      };

      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const file = event.target.files?.[0];

    if (file && file.type === 'application/json' && event.target.files) {
      setSelectedFile(file);
      try {
        const parsedData: any = await readJsonFile(event.target.files[0]);

        const response: AxiosResponse = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + '/analysis',
          {
            dependencies: JSON.stringify(parsedData.dependencies),
          },
          { signal }
        );

        setDatafromtheResponse(response.data.data);

        setDatafromthefile(parsedData.dependencies);
      } catch (error) {
        console.log('Error reading file:', error);
      }
    } else {
      // Display an error message or handle invalid file type
      console.log('Invalid file format. Please select a JSON file.');
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(controller);
    if (clearAll) {
      return () => {
        controller.abort();
      };
    }
  }, [clearAll]);

  const onClearAll = () => {
    setClearAll(true);
    setDatafromthefile(null);
    setDatafromtheResponse(null);
    setSelectedFile(null);
  };

  return (
    <>
      <Navbar />
      {getDatafromtheResponse === null ? (
        <Hero>
          <UploadFile
            selectedfile={selectedFile}
            handleChange={handleFileChange}
          />
        </Hero>
      ) : (
        <>
          <AnalysisTable
            responseData={getDatafromtheResponse}
            fileData={getDatafromthefile}
          />
          {
            <Center m={3}>
              <Button
                alignItems={'center'}
                type="button"
                size="sm"
                onClick={onClearAll}
                hidden={selectedFile !== null ? false : true}
              >
                Clear All
              </Button>
            </Center>
          }
        </>
      )}
      <Footer />
    </>
  );
};

export default HomePage;
