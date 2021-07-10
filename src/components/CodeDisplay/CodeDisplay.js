import './CodeDisplay.scss';
import React, { useContext, useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ejs from 'ejs';
import prettier from 'prettier/standalone';
import babelParser from 'prettier/parser-babel';
import copy from 'copy-to-clipboard';
import { FormGeneratorContext } from '../FormGenerator';
import { formTemplate } from './JsxTemplates';

export const CodeDisplay = () => {
    const { state } = useContext(FormGeneratorContext);
    const [codeString, setCodeString] = useState('Generating...');
    const [wasCopied, setWasCopied] = useState(false);

    useEffect(() => {
        let newCodeString = generateFormJsx(state);
        // needed because of conditional wrapping components
        newCodeString = prettier.format(newCodeString, { 
            parser: 'babel', 
            plugins: [babelParser],
            tabWidth: 4,
        });
        setCodeString(newCodeString);
    }, [state]);

    const handleCopyToClipboardClick = () => {
        copy(codeString);
        setWasCopied(true);
        setTimeout(() => setWasCopied(false), 2000);
    };

    return (
        <div className="code-display">
            <div className="code-display__copy" onClick={handleCopyToClipboardClick}>
                {wasCopied ? '---- copied! ----' : 'copy to clipboard'}
            </div>
            <SyntaxHighlighter 
                language="javascript"
                style={a11yDark} 
                customStyle={{ height: '100%', margin: '0' }}
            >
                {codeString}
            </SyntaxHighlighter>
        </div>
    );
};

// helpers

function generateFormJsx(config) {
    config = augmentConfig(config);
    const codeString = ejs.render(formTemplate, config);
    return  codeString;
}

function augmentConfig(config) {
    config = { ...config };

    // add includes
    config.includes = [
        ...new Set(config.fields.map(x => x.type)), // Set makes it a unique array 
        ...(config.settings.isDialog ? ['FormDialog', 'FormDialogContent'] : ['SubmitButton']),
    ];
    // add validation
    config.validationFields = config.fields.filter(x => x.required)

    return config;
}