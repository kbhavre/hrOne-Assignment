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

  const updateField = (index: number, field: SchemaField) => {
    const updatedFields = [...fields];
    updatedFields[index] = field;
    setValue('schema', updatedFields);
  };

  const deleteField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setValue('schema', updatedFields);
  };

  const addField = () => {
    const newField: SchemaField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false,
    };
    setValue('schema', [...fields, newField]);
  };

  const addChildField = (parentIndex: number) => {
    const updatedFields = [...fields];
    const parent = updatedFields[parentIndex];
    const newChild: SchemaField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false,
    };

    parent.children = [...(parent.children || []), newChild];
    updatedFields[parentIndex] = parent;
    setValue('schema', updatedFields);
  };

  const updateChildField = (parentIndex: number, childIndex: number, child: SchemaField) => {
    const updatedFields = [...fields];
    const parent = updatedFields[parentIndex];
    if (!parent.children) parent.children = [];
    parent.children[childIndex] = child;
    updatedFields[parentIndex] = parent;
    setValue('schema', updatedFields);
  };

  const deleteChildField = (parentIndex: number, childIndex: number) => {
    const updatedFields = [...fields];
    const parent = updatedFields[parentIndex];
    parent.children = (parent.children || []).filter((_, i) => i !== childIndex);
    updatedFields[parentIndex] = parent;
    setValue('schema', updatedFields);
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
            onUpdate={updateField}
            onDelete={deleteField}
            onAddChild={addChildField}
            onUpdateChild={updateChildField}
            onDeleteChild={deleteChildField}
          />
        ))}

        <Button
          type="button"
          onClick={addField}
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