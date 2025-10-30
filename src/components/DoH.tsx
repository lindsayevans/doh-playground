import React, { FormEvent, useEffect, useState } from 'react';

import {
  Alert,
  Button,
  Container,
  createTheme,
  Flex,
  Loader,
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

import { DnsRecord, DnsRecordTypes } from '../DnsRecord';
import { DataTable } from 'mantine-datatable';
import { useSearchParams } from 'react-router-dom';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';

const RESOLVERS = [
  {
    name: 'Cloudflare',
    url: 'https://cloudflare-dns.com/dns-query',
  },
  {
    name: 'Google',
    url: 'https://dns.google/resolve',
  },
];

const DEFAULT_RESOLVER = RESOLVERS[0].name;
const DEFAULT_DOMAIN = '';
const DEFAULT_TYPES = ['A', 'AAAA', 'CNAME'];

export const DoH: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchDomain = searchParams.get('domain');
  const searchTypes = searchParams.getAll('types');

  const [domain, setDomain] = useState(searchDomain || DEFAULT_DOMAIN);
  const [resolver, setResolver] = useState(
    searchParams.get('resolver') || DEFAULT_RESOLVER
  );
  const [types, setTypes] = useState<string[]>(
    searchTypes && searchTypes.length > 0 ? searchTypes : DEFAULT_TYPES
  );

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DnsRecord[]>([]);
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

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

    if (response.status !== 200) {
      throw new Error(`Error response from resolver: ${response.status}`);
    }

    const data = await response.json();

    return data;
  };

  const getResolverUrl = (name: string) => {
    return RESOLVERS.find((x) => x.name === name)?.url || RESOLVERS[0].url;
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams({
      resolver,
      domain,
      types,
    });

    runAllQueries();
  };

  const runAllQueries = async () => {
    setLoading(true);
    setResults([]);
    setInfo(undefined);
    setError(undefined);

    try {
      const queries = types.flatMap((type) =>
        domain
          .split(',')
          .map((x) => x.trim())
          .map((domain) => buildQuery(domain, type, getResolverUrl(resolver)))
      );
      const queryResults = await Promise.all(queries);

      const results: DnsRecord[] = [];
      queryResults.forEach((result, i) => {
        if (
          result.Status === 0 &&
          result.Answer !== undefined &&
          result.Answer.map
        ) {
          results.push(
            ...result.Answer.map(
              (answer: Record<string, string>, ii: number) => ({
                id: btoa(answer.type + answer.name + answer.data + i + ii),
                type: DnsRecordTypes[answer.type as unknown as number],
                name: answer.name,
                data: answer.data,
                ttl: answer.TTL,
              })
            )
          );
        }
      });

      if (results.length === 0) {
        setInfo('No results returned from resolver');
      }

      setResults(results);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (domain !== '') {
      runAllQueries();
    }
  }, [searchDomain]);

  const onResetClick = () => {
    setResolver(DEFAULT_RESOLVER);
    setDomain(DEFAULT_DOMAIN);
    setTypes(DEFAULT_TYPES);
    setSearchParams();
    setResults([]);
    setInfo(undefined);
    setError(undefined);
  };

  return (
    <Container size="lg">
      <form onSubmit={(e) => onFormSubmit(e)}>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'stretch', sm: 'flex-end' }}
          gap="sm"
          mb="lg"
          mt="lg"
        >
          <NativeSelect
            label="Resolver"
            value={resolver}
            data={RESOLVERS.map((x) => x.name)}
            onChange={(e) => setResolver(e.target.value)}
          />
          <TextInput
            label="Domains"
            placeholder="Comma separated"
            value={domain}
            onChange={(event) => setDomain(event.currentTarget.value)}
            autoFocus
          />
          <MultiSelect
            label="Types"
            data={allTypes}
            value={types}
            onChange={setTypes}
            clearable
            searchable
          />
          <Button type="submit" variant="filled">
            Query
          </Button>
          <Button type="reset" variant="outline" onClick={() => onResetClick()}>
            Reset
          </Button>
        </Flex>
      </form>

      {results && results.length > 0 && (
        <>
          <DataTable
            columns={[
              { accessor: 'type' },
              { accessor: 'name' },
              { accessor: 'data' },
              { accessor: 'ttl', title: 'TTL' },
            ]}
            records={results}
          ></DataTable>
          {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}
        </>
      )}

      {loading && <Loader color="teal" />}

      {info && (
        <Alert variant="light" color="indigo" icon={<IconInfoCircle />}>
          {info}
        </Alert>
      )}

      {error && (
        <Alert
          variant="light"
          color="pink"
          title="Error querying resolver"
          icon={<IconAlertCircle />}
        >
          {error}
        </Alert>
      )}
    </Container>
  );
};
