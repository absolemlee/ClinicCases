'use client';

interface CaseColumn {
  id: number;
  dbName: string;
  displayName: string;
  inputType: string;
  selectOptions: string | null;
  required: number;
  displayOrder: number;
}

interface DynamicFieldProps {
  column: CaseColumn;
  value: any;
  onChange: (fieldName: string, value: any) => void;
}

export function DynamicFormField({ column, value, onChange }: DynamicFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(column.dbName, e.target.value);
  };

  const renderField = () => {
    const baseProps = {
      id: column.dbName,
      name: column.dbName,
      value: value || '',
      onChange: handleChange,
      required: column.required === 1,
      className: 'w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500',
    };

    switch (column.inputType) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return <input type={column.inputType} {...baseProps} />;

      case 'date':
        return <input type="date" {...baseProps} />;

      case 'textarea':
        return (
          <textarea
            {...baseProps}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'select':
        const options = column.selectOptions
          ? column.selectOptions.split(',').map(opt => opt.trim())
          : [];
        return (
          <select {...baseProps}>
            <option value="">Select {column.displayName}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={column.dbName}
            name={column.dbName}
            checked={value === 1 || value === '1' || value === true}
            onChange={(e) => onChange(column.dbName, e.target.checked ? 1 : 0)}
            className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        );

      case 'number':
        return <input type="number" {...baseProps} />;

      default:
        return <input type="text" {...baseProps} />;
    }
  };

  return (
    <div>
      <label htmlFor={column.dbName} className="block text-sm font-medium text-gray-300 mb-2">
        {column.displayName}
        {column.required === 1 && <span className="text-red-400 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
}
