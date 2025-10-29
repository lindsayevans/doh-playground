import React, { useState } from 'react';

import {
  Button,
  Container,
  createTheme,
  Flex,
  Loader,
  MantineProvider,
  MultiSelect,
  NativeSelect,
  TextInput,
} from '@mantine/core';

import '@mantine/core/styles.css';
import 'mantine-datatable/styles.css';

const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'cyan',
});

import { DnsRecord, DnsRecordTypes } from './DnsRecord';
import { DataTable } from 'mantine-datatable';

const resolvers = [
  {
    name: 'Cloudflare',
    url: 'https://cloudflare-dns.com/dns-query',
  },
  {
    name: 'Google',
    url: 'https://dns.google/resolve',
  },
];

export const App: React.FC = () => {
  const [value, setValue] = useState('querc.net');
  const [resolver, setResolver] = useState(resolvers[0].name);
  const [types, setTypes] = useState<string[]>(['A', 'AAAA', 'CNAME']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DnsRecord[]>([]);

  const allTypes = Object.values(DnsRecordTypes)
    .filter((x) => isNaN(x as number))
    .map((x) => x.toString());

  const buildQuery = async (
    name: string,
    type: string,
    resolverUrl?: string
  ) => {
    const response = await fetch(`${resolverUrl}?name=${name}&type=${type}`, {
      headers: { accept: 'application/dns-json' },
    });
    const data = await response.json();
    return data;
  };

  const getResolverUrl = (name: string) => {
    return resolvers.find((x) => x.name === name)?.url || resolvers[0].url;
  };

  const runAllQueries = async () => {
    setLoading(true);
    setResults([]);
    const queries = types.map((x) =>
      buildQuery(value, x, getResolverUrl(resolver))
    );
    const queryResults = await Promise.all(queries);

    const results: DnsRecord[] = [];
    queryResults.forEach((result) => {
      if (
        result.Status === 0 &&
        result.Answer !== undefined &&
        result.Answer.map
      ) {
        results.push(
          ...result.Answer.map((answer: Record<string, string>) => ({
            id: btoa(answer.type + answer.name + answer.data),
            type: DnsRecordTypes[answer.type as unknown as number],
            name: answer.name,
            data: answer.data,
            ttl: answer.TTL,
          }))
        );
      }
    });
    setLoading(false);
    setResults(results);
  };

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Container size="lg">
        <Flex align="flex-end" gap="sm" mb="md">
          <NativeSelect
            label="Resolver"
            data={resolvers.map((x) => x.name)}
            onChange={(e) => setResolver(e.target.value)}
          />
          <TextInput
            label="Domain"
            placeholder="e.g. example.com"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
          <MultiSelect
            label="Types"
            data={allTypes}
            value={types}
            onChange={setTypes}
            clearable
            searchable
          />
          <Button variant="filled" onClick={(e) => runAllQueries()}>
            Query
          </Button>
        </Flex>

        {results && results.length > 0 && (
          <DataTable
            withTableBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            records={results}
            columns={[
              { accessor: 'type' },
              { accessor: 'name' },
              { accessor: 'data' },
              { accessor: 'ttl', title: 'TTL' },
            ]}
          ></DataTable>
        )}

        {loading && <Loader color="teal" />}
      </Container>
    </MantineProvider>
  );
};
