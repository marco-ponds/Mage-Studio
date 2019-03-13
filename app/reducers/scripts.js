import {
    SCRIPTS_FETCH_FAILED,
    SCRIPTS_FETCH_STARTED,
    SCRIPTS_FETCH_COMPLETED,
    SCRIPTS_SINGLE_FETCH_COMPLETED
} from '../actions/types';

const DEFAULT = {
    loading: false,
    error: false,
    completed: false,
    data: null,
    list: []
};

export default function reducer(state = DEFAULT, action = {}) {
    switch(action.type) {
        case SCRIPTS_FETCH_STARTED:
            return {
                ...DEFAULT,
                ...state,
                loading: true
            };
            break;
        case SCRIPTS_FETCH_FAILED:
            return {
                ...state,
                ...DEFAULT,
                error: true
            };
            break;
        case SCRIPTS_FETCH_COMPLETED:
            return {
                ...state,
                ...DEFAULT,
                list: action.list,
                completed: true
            };
            break;
        case SCRIPTS_SINGLE_FETCH_COMPLETED:
            return {
                ...state,
                ...DEFAULT,
                data: action.data,
                completed: true
            };
            break;
        default:
            return state;
            break;
    }
}