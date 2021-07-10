import './FormGenerator.scss';
import React from 'react';
import { Row, Col } from 'antd';
import useReducer from '../../hooks/useReducer';
import { CodeDisplay } from '../CodeDisplay/CodeDisplay';
import { initialState, reducer } from './reducer';
import { FieldDefinitions } from '../FieldDefinitions';
import { FormSettings } from '../FormSettings/FormSettings';
import { ThunderboltOutlined } from '@ant-design/icons';

export const FormGeneratorContext = React.createContext();

export const FormGenerator = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const context = { state, dispatch };

    return (
        <FormGeneratorContext.Provider value={context}>
            <div className="form-generator" >
                <Row>
                    <Col span={8} className="form-generator__sidebar">
                        <h1><ThunderboltOutlined /> Form Generator</h1>
                        <FormSettings />
                        <FieldDefinitions />
                    </Col>
                    <Col span={16} className="form-generator__code">
                        <CodeDisplay />
                    </Col>
                </Row>
            </div>
        </FormGeneratorContext.Provider>
    );
};