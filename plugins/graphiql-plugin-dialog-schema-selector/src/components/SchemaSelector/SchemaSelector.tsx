import { useEffect, useState } from 'react';

/** hooks */
import { useGraphiQLEditor } from '@graphiql-v2-prototype/graphiql-editor';

/** styles */
import {
  Error,
  Note,
  RadioWrap,
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupRadio,
} from './styles';
import { Form, HandleChange } from '@graphiql-v2-prototype/graphiql-ui-library';

type ApiUrls = Record<string, { aboutUrl: string; apiUrl: string }>;

const apiUrls: ApiUrls = {
  [`Rick and Morty`]: {
    aboutUrl: 'https://rickandmortyapi.com/about',
    apiUrl: 'https://rickandmortyapi.com/graphql',
  },
  [`SpaceX`]: {
    aboutUrl: 'https://spacex.land/',
    apiUrl: 'https://api.spacex.land/graphql',
  },
};

const Radio = ({
  aboutUrl,
  value,
  id,
  copy,
}: {
  aboutUrl?: string;
  value: string;
  id: string;
  copy: string;
}) => (
  <RadioWrap>
    <RadioGroupRadio value={value} id={id}>
      <RadioGroupIndicator />
    </RadioGroupRadio>
    <label htmlFor={id}>
      <span>{copy}</span>
      {aboutUrl && (
        <a href={aboutUrl} target="_blank" rel="noreferrer">
          [more info]
        </a>
      )}
    </label>
  </RadioWrap>
);

const customSchemaUrlInput = 'customSchemaUrlInput';

export const SchemaSelector = () => {
  const { initSchema, schema, schemaUrl } = useGraphiQLEditor();

  const [schemaError, setSchemaError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [customSchemaUrl, setCustomSchemaUrl] = useState<string>('');

  const [radioValue, setRadioValue] = useState<string>('testSchema');

  const [targetSchemaUrl, setTargetSchemaUrl] = useState<string>('');

  useEffect(() => {
    // console.log('schema', { schema });
    if (schema) {
      if ('error' in schema) {
        setLoading(false);
        setSchemaError('Error loading schema. Is the URL formatted correctly?');
      } else {
        setLoading(false);
        setSchemaError(null);
      }
    } else {
      setLoading(true);
    }
  }, [schema]);

  useEffect(() => {
    // console.log('targetSchemaUrl', { targetSchemaUrl, schemaUrl });
    if (targetSchemaUrl === 'testSchema') {
      initSchema({});
    } else if (targetSchemaUrl.length > 0) {
      initSchema({ url: targetSchemaUrl });
    }
    if (!schemaUrl) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSchemaUrl]);

  const handleCustomSchemaUrlChange = ({ value }: HandleChange) => {
    setCustomSchemaUrl(value as string);
  };

  const customSchemaUrlInputSubmitHandler = (
    e: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setTargetSchemaUrl(customSchemaUrl);
  };

  return (
    <RadioGroup
      value={radioValue}
      aria-label="Choose schema"
      onValueChange={(value) => {
        // console.log('value', { value });
        setRadioValue(value);
        if (value === 'testSchema') {
          return setTargetSchemaUrl('testSchema');
        }
        if (
          [
            'https://rickandmortyapi.com/graphql',
            'https://api.spacex.land/graphql',
          ].includes(value)
        ) {
          return setTargetSchemaUrl(value);
        }
        return undefined;
      }}
    >
      <Note>Switching schemas will reset existing tab instances</Note>
      <fieldset disabled={loading}>
        <Radio
          aboutUrl="https://github.com/graphql/graphiql/blob/main/packages/graphiql/test/schema.js"
          value="testSchema"
          id="1"
          copy="Official GraphiQL Test Schema"
        />
        {Object.keys(apiUrls).map((x, i) => {
          const id = (i + 2).toString();
          return (
            <Radio
              key={id}
              aboutUrl={apiUrls[x].aboutUrl}
              value={apiUrls[x].apiUrl}
              id={id}
              copy={x}
            />
          );
        })}
        <div>
          <Radio value={customSchemaUrlInput} id="4" copy="Custom Schema Url" />
          {schemaError && <Error>{schemaError}</Error>}
          {radioValue === customSchemaUrlInput && (
            <Form
              formType={{
                type: 'STATIC',
                submitHandler: customSchemaUrlInputSubmitHandler,
                buttonCopy: 'Use this schema',
              }}
              formControls={[
                {
                  control: {
                    currentValue: customSchemaUrl,
                    handleChange: handleCustomSchemaUrlChange,
                    name: customSchemaUrlInput,
                    placeholder: 'http://api.mydomain.com/graphql',
                  },
                  label: `Your schema URL`,
                },
              ]}
            />
          )}
        </div>
      </fieldset>
    </RadioGroup>
  );
};