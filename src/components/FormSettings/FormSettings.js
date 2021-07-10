import './FormSettings.scss';
import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { Form, Input, Switch } from 'antd'; 
import { SettingFilled } from '@ant-design/icons';
import { FormGeneratorContext, createAction, actions } from '../FormGenerator';

export const FormSettings = () => {
    const { state, dispatch } = useContext(FormGeneratorContext);

    const handleValuesChange = (changedValues) => {
        const [name, value] = Object.entries(changedValues).pop();
        dispatch(createAction(actions.UpdateSetting, { name, value }));
    };

    return (
        <Card bg="secondary" text="white" className="form-settings">
            <Card.Body>
                <Card.Subtitle className="mb-2"><SettingFilled /> Form Settings</Card.Subtitle>
                <Form 
                    size="small"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{ ...state.settings }}
                    onValuesChange={handleValuesChange}
                >
                    <Form.Item label="Slice" name="slice">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Prefix" name="prefix">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Dialog?" name="isDialog" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Form Tag?" name="useFormTag" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Card.Body>
        </Card>
    );
};