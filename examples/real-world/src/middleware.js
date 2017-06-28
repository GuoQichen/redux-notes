const callApiMiddleware = ({ dispatch, getstate }) => next => action => {
    if (Array.isArray(action.types) && action.types.length === 3 && action.types.every(item => typeof item === 'string')) {
        const {
            types,
            shouldCallApi = () => true,
            callApi,
            payload = {}
        } = action
        const [ request, success, failure ] = types
        dispatch({
            type: request,
            payload,
        })
        if (!shouldCallApi()) {
            return
        }
        return callApi().then(response => 
            response.json().then(result => 
                dispatch({
                    type: success,
                    response: result,
                    payload,
                })
            )
        ).catch(error => 
            dispatch({
                type: failure,
                error
            })
        )
    }

    return next(action)
}

export default callApiMiddleware