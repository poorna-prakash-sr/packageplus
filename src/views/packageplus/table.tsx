import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  responseData: any;
  fileData: any;
};

const AnalysisTable = ({ responseData, fileData }: Props) => {
  const filedependenciesArray: any = Object.entries(fileData).map(
    ([key, value]) => {
      return { name: key, version: value };
    }
  );

  const fixcolortoTable = (score: number): string => {
    if (score > 90) {
      return 'green.300';
    } else if (score > 80) {
      return 'green.200';
    }
    return 'grey.100';
  };

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Package Name</Th>
            <Th>Your Version</Th>
            <Th>Current Version</Th>
            <Th>License</Th>
            <Th>Dependencies Count</Th>
            <Th>Score</Th>
            <Th>Links</Th>
          </Tr>
        </Thead>
        <Tbody>
          {responseData.map((data: any, index: number) => {
            return (
              <Tr bg={fixcolortoTable(data.score.toFixed(0))}>
                <Td>{data.name}</Td>
                <Td>{filedependenciesArray[index].version}</Td>
                <Td>{data.version}</Td>
                <Td>{data.license}</Td>
                <Td>{data.dependenciesCount}</Td>
                <Td>{data.score.toFixed(0)}</Td>
                <Td>
                  <Text>
                    <a href={data.npm} target="_blank">
                      npm
                    </a>
                    <a href={data.npm} target="_blank">
                      github
                    </a>
                  </Text>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default AnalysisTable;
