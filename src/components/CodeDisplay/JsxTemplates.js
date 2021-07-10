export const formTemplate = `import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';<% if (validationFields.length > 0) { %>
    import * as Yup from 'yup';
<% } %>import {
    Suspend, 
    Form, 
    FieldGroup, 
    FieldLabel, 
    FieldInput,
    <% includes.forEach(include => { %><%= include %>,<% }) %>
} from '@cc/common';

// IMPLEMENT THE BELOW REDUX THUNKS
import {
    loadExistingItem,
    saveItem,
} from 'redux/slices/myDialog';

export const MyForm = ({ <% if (settings.isDialog) { %>onAccept, onCancel<% } %> }) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    // THIS CODE BLOCK CAN BE DELETED IF LOADING AN EXISTING ITEM IS NOT APPLICABLE
    useEffect(() => {<% if (settings.isDialog) {%>
        if (!isVisible) return;
        <% } %>
        const init = async () => {
            setIsLoading(true);
            await dispatch(loadExistingItem(existingId));
            setIsLoading(false);
        };

        init();
    }, [existingId]);
    <% if (settings.isDialog) {%>
    if (!isVisible) return null;
    <% } %>
    const handleSubmit = async (actions) => {
        const { wasSuccessful, itemId } = await dispatch(saveItem());
        await actions.completeSubmission();
        if (!wasSuccessful) return;
        <% if (settings.isDialog) {%>onAccept(itemId);<% } %>
        await actions.resetForm();
    };

    return (
        <Form
            slice="<%= settings.slice %>"
            <%_ if (settings.prefix) { %>
            prefix="<%= settings.prefix %>"<% if (validationFields.length > 0) { %>
            <% } _%>
            validation={Yup.object({
            <% validationFields.forEach(validationField => { %>
                <%= validationField.name %>: Yup.string().required('<%= validationField.label %> is required'),<% }) %>
            })}
            <% } %>
            onSubmit={handleSubmit}
            useFormTag={true}
        ><% if (settings.isDialog) { %>
            <FormDialog
                title="My Dialog"
                acceptText="Save"
                acceptButtonType="submit"
                onCancel={(actions) => {
                    actions.resetForm();
                    onCancel();
                }}
                className="my-dialog"
            ><% } %>
                <Suspend isLoading={isLoading}><% if (settings.isDialog) { %>
                    <FormDialogContent><% } %><% fields.forEach(field => { %>
                        <FieldGroup horizontal>
                            <FieldLabel<% if (field.required) { %> required<% } %>><%= field.label %></FieldLabel>
                            <FieldInput stretch>
                                <<%= field.type %> name="<%= field.name %>"<% if(field.isEnum) { %> enumType="<%= field.name.charAt(0).toUpperCase() + field.name.slice(1) %>"<% } %> <% if (field.required) { %> required <% } %>/>
                            </FieldInput>
                        </FieldGroup><% }); %>
                        <% if (settings.isDialog) { %></FormDialogContent><% } %>
                    <% if (!settings.isDialog) { %><SubmitButton /><% } %>
                </Suspend><% if (settings.isDialog) { %>
            </FormDialog><% } %>
        </Form>
    )
};

MyForm.PropTypes = {

};
`;