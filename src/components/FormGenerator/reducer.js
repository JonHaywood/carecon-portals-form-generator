import update from 'immutability-helper';
import { startCase } from 'lodash-es';
import createAction from '../../helpers/createAction';
export { default as createAction } from '../../helpers/createAction';

export const initialState = {
    settings: {
        slice: 'patient',
        prefix: 'patientForm',
        isDialog: true,
        useFormTag: true,
    },
    fieldDefinitions: 'firstName*\nlastName*\nencounterDate\nencounterType\nisArchived',
    fields: [
        { type: 'TextField', label: 'First Name', name: 'firstName', required: true },
        { type: 'TextField', label: 'Last Name', name: 'lastName', required: true },
        { type: 'DateField', label: 'EncounterDate', name: 'encounterDate', required: false },
        { type: 'SelectField', label: 'EncounterType', name: 'encounterType', required: false, isEnum: true },
        { type: 'ToggleField', label: 'isArchived', name: 'isArchived', required: false },
    ]
};

export const actions = {
    UpdateSetting: 'UPDATE_SETTING',
    UpdateFieldDefinitions: 'UPDATE_FIELDDEFINITIONS',
    UpdateFields: 'UPDATE_FIELDS',
};

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.UpdateSetting: {
            const { name, value } = action.payload;   
            return update(state, {
                settings: {
                    [name]: { $set: value }
                }
            });
        }
        case actions.UpdateFieldDefinitions: {
            return update(state, {
                fieldDefinitions: {
                    $set: action.payload
                }
            });
        }
        case actions.UpdateFields: {
            return update(state, {
                fields: {
                    $set: action.payload
                }
            });
        }
        default:
            throw new Error(`invalid action type '${action.type}'`);
    }
};

export const setFieldDefinitions = (fieldDefinitions) => (dispatch, getState) => {
    dispatch(createAction(actions.UpdateFieldDefinitions, fieldDefinitions));
    
    const fields = generateFieldsFromDefinitions(fieldDefinitions);
    dispatch(createAction(actions.UpdateFields, fields));
}

// helpers

function generateFieldsFromDefinitions(fieldDefinitions) {
    const lines = fieldDefinitions.split(/\r?\n/);
    return lines.map(generateFieldsFromDefinition).filter(x => !!x);
}

function generateFieldsFromDefinition(fieldDefinition) {
    fieldDefinition = fieldDefinition.trim(); // trim whitespace
    if (!fieldDefinition) 
        return null;

    const name = fieldDefinition.replace(/\W/g, '');
    const label = startCase(name);

    const field = {
        type: 'TextField',
        name,
        label,
        required: fieldDefinition.endsWith('*')
    };

    // modify type
    if (field.name.startsWith('is')) {
        field.type = 'ToggleField';
        field.label = label.replace('Is ', '') + '?';
    } else if (field.name.toLowerCase().indexOf('date') > -1) {
        field.type = 'DateField';
    } else if (field.name.toLowerCase().endsWith('type')) {
        field.type = 'SelectField';
        field.isEnum = true;
    } else if (field.name.toLowerCase().indexOf('description') > -1) {
        field.type = 'MultilineTextField';
    }

    return field;
}