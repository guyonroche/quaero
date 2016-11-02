
const modal = (state = {name: null, data: {}}, action) => {
  switch (action.type) {
    case 'OPEN_SIGNUP_MODAL':
      return {
        name: 'sign-up',
        data: {},
      };
    
    case 'SET_MODAL_DATA':
      return {
        ...state,
        data: action.data,
      };

    case 'ADD_MODAL_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        }
      };

    case 'CLOSE_MODAL':
      return {data: {}};

    default:
      return state;
  }
};

export default modal;