/**
 * light react-redux
 * @author acky.guo
 */

/**
 * 基本思路就是通过 context 和 store.subscribe()，每次store更新，触发subscribe的函数，然后update，
 * 因为update回导致自组件都update，然后自组件就能重新调用store.getState()得到最新的state
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

// 定义store的shape
const getStoreShape = (PropTypes) => {
	return PropTypes.shape({
		subscribe: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired,
		getState: PropTypes.func.isRequired,		
	})
}

// Provider 
export class Provider extends Component {
	state = {
		store: this.props.store
	}

	static childContextTypes = {
		store: getStoreShape(PropTypes)
    }
   
	getChildContext() {
		return {
			store: this.state.store
		}
	} 
    
    componentDidMount() {
        const { store } = this.props
        this.unsubscribe = store.subscribe(() => {
            /**
             * 因为在react，一个组件update，所有的子组件都会update，
             * 所以这边在每次store发生变化之后update
             */ 
            this.forceUpdate()
        })
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

	render() {
		return this.props.children
	}	
}

// connect
export const connect = (mapStateToProps, mapDispatchToProps) => (WrapComponent) => {
	return class extends Component {
		static contextTypes = {
			store: getStoreShape(PropTypes)
		}

		render() {
			const { store } = this.context
			const props = this.handleMapStateToProps()
			const actions =this.handleMapDispatchToProps()
			return <WrapComponent
						{...props}
						{...actions}
					/>
		}

		handleMapStateToProps = () => {
            const { store } = this.context
			return mapStateToProps(store.getState(), this.props)
		}

		handleMapDispatchToProps = () => {
			const { store } = this.context
			if (Object.prototype.toString.call(mapDispatchToProps) === `[object Object]`) {
				return store.bindActionCreator(mapDispatchToProps, store.dispatch)
			}
			if (typeof mapDispatchToProps === `function`) {
				return mapDispatchToProps(store.dispatch, this.props)
            }
            return { dispatch: store.dispatch }
		}
	}
}