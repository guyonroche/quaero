
const modal = (state = {name: null, data: {}}, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        name: action.name,
        data: {},
      };

    case 'CLOSE_MODAL':
      return {data: {}};

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

    default:
      return state;
  }
};

export default modal;