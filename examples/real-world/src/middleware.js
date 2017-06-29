const callApiMiddleware = ({ dispatch, getState }) => next => action => {
    const {
        types,
        shouldCallApi = () => true,
        callApi,
        payload = {}
    } = action
    if (!types) {
      return next(action)
    }
    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.')
    }
    if (typeof callApi !== 'function') {
      throw new Error('Expected callApi to be a function.')
    }
    if (!shouldCallApi(getState())) {
        return
    }
    const [ request, success, failure ] = types
    dispatch({
        type: request,
        ...payload,
    })
    return callApi()
            .then(response => response.json())
            .then(result => 
                dispatch({
                    type: success,
                    response: result,
                    ...payload,
                })
            )
            .catch(error => 
                dispatch({
                    type: failure,
                    error,
                    ...payload
                })
            )
}

export default callApiMiddleware