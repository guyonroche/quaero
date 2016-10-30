
const modal = (state = {}, action) => {
  switch (action.type) {
    case 'OPEN_SIGNUP_MODAL':
      return {
        name: 'sign-up'
      };
    
    case 'SET_MODAL_DATA':
      return {
        ...state,
        data: action.data
      };

    case 'ADD_MODAL_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data
        }
      };

    case 'CLOSE_MODAL':
      return {};

    default:
      return state;
  }
};

export default modal;