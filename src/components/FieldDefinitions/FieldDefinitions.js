import './FieldDefinitions.scss';
import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Form, Input } from 'antd'; 
import { QuestionCircleFilled, SettingFilled } from '@ant-design/icons';
import useDebounce from '../../hooks/useDebounce';
import { FormGeneratorContext, setFieldDefinitions } from '../FormGenerator';

const { TextArea } = Input;

const DEBOUNCE_TIME = 300;

export const FieldDefinitions = () => {
    const { state, dispatch } = useContext(FormGeneratorContext);
    const { fieldDefinitions } = state;

    const [localFieldDefinitions, setLocalFieldDefinitions] = useState(fieldDefinitions);
    const debouncedLocalFieldDefinitions = useDebounce(localFieldDefinitions, DEBOUNCE_TIME);

    useEffect(() => {
        if (debouncedLocalFieldDefinitions === undefined)
            return;
        dispatch(setFieldDefinitions(debouncedLocalFieldDefinitions));
    }, [debouncedLocalFieldDefinitions]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleValuesChange = (changedValues) => {
        setLocalFieldDefinitions(changedValues.fieldDefinitions);
    };

    return (
        <Card bg="dark" text="white" className="field-definitions">
            <Card.Body>
                <Card.Subtitle className="mb-2"><SettingFilled /> Field Definitions</Card.Subtitle>
                <Card.Text className="field-definitions__description">
                    Enter a field name on each line. <em>Note: add a <span className="text-white">*</span> after 
                    the name to mark the field as required.</em>
                </Card.Text>
                <Form 
                    size="small"
                    initialValues={{ fieldDefinitions: localFieldDefinitions }}
                    onValuesChange={handleValuesChange}
                    className="mb-2"
                >
                    <Form.Item name="fieldDefinitions">
                        <TextArea 
                            rows={6} 
                            autoComplete="off" 
                            autoCorrect="off" 
                            autoCapitalize="off" 
                            spellCheck="false" 
                        />
                    </Form.Item>
                </Form>
                <Card.Text className="field-definitions__description">
                    <QuestionCircleFilled /> Some field types are auto-detected based on the field name.
                </Card.Text>
            </Card.Body>
        </Card>
    );
};