import React, { useState, useEffect } from 'react';
import SchemaFieldComponent, { type SchemaField } from '../components/SchemaFieldComponent'
import JsonPreview from '../components/JsonPreview'
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';const JsonSchemaBuilder: React.FC = () => {
  // ✅ Start with empty fields
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [jsonPreview, setJsonPreview] = useState('{}');

  const updateField = (index: number, field: SchemaField) => {
    setFields(prev => {
      const updated = [...prev];
      updated[index] = field;
      return updated;
    });
  };

  const deleteField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const addField = () => {
    const newField: SchemaField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false
    };
    setFields(prev => [...prev, newField]);
  };

  const addChildField = (parentIndex: number) => {
    const newChild: SchemaField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false
    };
    setFields(prev => {
      const updated = [...prev];
      const children = [...(updated[parentIndex].children || []), newChild];
      updated[parentIndex] = { ...updated[parentIndex], children };
      return updated;
    });
  };

  const updateChildField = (parentIndex: number, childIndex: number, child: SchemaField) => {
    setFields(prev => {
      const updated = [...prev];
      const children = [...(updated[parentIndex].children || [])];
      children[childIndex] = child;
      updated[parentIndex] = { ...updated[parentIndex], children };
      return updated;
    });
  };

  const deleteChildField = (parentIndex: number, childIndex: number) => {
    setFields(prev => {
      const updated = [...prev];
      const children = (updated[parentIndex].children || []).filter((_, i) => i !== childIndex);
      updated[parentIndex] = { ...updated[parentIndex], children };
      return updated;
    });
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
    setJsonPreview(JSON.stringify(generateJsonSchema(fields), null, 2));
  }, [fields]);

  return (
    <div className="flex h-screen bg-gray-50">
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
          onClick={addField}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          + Add Item
        </Button>
      </div>
      <JsonPreview json={jsonPreview} />
    </div>
  );
};

export default JsonSchemaBuilder;