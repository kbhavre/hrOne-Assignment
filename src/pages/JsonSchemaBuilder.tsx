import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SchemaFieldComponent, { type SchemaField } from '../components/SchemaFieldComponent';
import JsonPreview from '../components/JsonPreview';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

type FormValues = {
  schema: SchemaField[];
};

const JsonSchemaBuilder: React.FC = () => {
  const { handleSubmit, control, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      schema: [],
    },
  });

  const fields = watch('schema') || [];
  const [jsonPreview, setJsonPreview] = useState('{}');

  const setByPath = (path: number[], updatedField: SchemaField) => {
    const clone = JSON.parse(JSON.stringify(fields));
    let curr = clone;
    for (let i = 0; i < path.length - 1; i++) {
      curr = curr[path[i]].children!;
    }
    curr[path[path.length - 1]] = updatedField;
    setValue('schema', clone);
  };

  const deleteByPath = (path: number[]) => {
    const clone = JSON.parse(JSON.stringify(fields));
    let curr = clone;
    for (let i = 0; i < path.length - 1; i++) {
      curr = curr[path[i]].children!;
    }
    curr.splice(path[path.length - 1], 1);
    setValue('schema', clone);
  };

  const addChildByPath = (path: number[]) => {
    const clone = JSON.parse(JSON.stringify(fields));
    const newField: SchemaField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false,
    };
    let curr = clone;
    for (let i = 0; i < path.length; i++) {
      curr = curr[path[i]].children!;
    }
    curr.push(newField);
    setValue('schema', clone);
  };

  const generateJsonSchema = (fields: SchemaField[]): any => {
    const result: any = {};
    fields.forEach(field => {
      if (field.name) {
        if (field.type === 'nested' && field.children) {
          result[field.name] = generateJsonSchema(field.children);
        } else {
          result[field.name] = field.type.toUpperCase();
        }
      }
    });
    return result;
  };

  useEffect(() => {
    const json = generateJsonSchema(fields);
    setJsonPreview(JSON.stringify(json, null, 2));
  }, [fields]);

  const onSubmit = (data: FormValues) => {
    console.log('Submitted Schema:', data.schema);
    console.log('Generated JSON:', generateJsonSchema(data.schema));
    alert('Schema submitted!');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-auto space-y-4">
        {fields.map((field, index) => (
          <SchemaFieldComponent
            key={field.id}
            field={field}
            index={index}
            nestingLevel={0}
            levelPath={[index]}
            onUpdate={setByPath}
            onDelete={deleteByPath}
            onAddChild={addChildByPath}
          />
        ))}

        <Button
          type="button"
          onClick={() =>
            setValue('schema', [
              ...fields,
              {
                id: Date.now().toString(),
                name: '',
                type: 'string',
                required: false,
              },
            ])
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>

        <Button
          type="submit"
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3"
        >
          Submit Schema
        </Button>
      </div>

      <JsonPreview json={jsonPreview} />
    </form>
  );
};

export default JsonSchemaBuilder;