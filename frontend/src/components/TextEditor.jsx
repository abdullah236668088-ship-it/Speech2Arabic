import React, { useState } from 'react';

const TextEditor = ({ text, onChange }) => {
    const [value, setValue] = useState(text || '');

    const handleChange = (e) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-6">
            <textarea
                className="textarea-field h-48"
                value={value}
                onChange={handleChange}
                placeholder="يمكنك تعديل النص هنا..."
            />
        </div>
    );
};

export default TextEditor;
