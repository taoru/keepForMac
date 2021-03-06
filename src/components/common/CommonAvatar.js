import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Utils from '../../js/Utils.js'
import $http from '../../js/HttpRequest.js'
import UserWindow from './UserWindow.js'

class CommonAvatar extends Component{
    constructor(props){
        super(props)
    }

    // 查看用户个人信息
    @autobind
    handleClick(){
        $http.getUserData(this.props.userid).then((response) => {
            if(response.ok) {
                Utils.storage.set('userInfo', response.data)
                UserWindow.show('keeper - '+ response.data.user.username)
            }
        })
    }

    @autobind
    handleError(e){
        console.info(e.target.src)
        e.target.src = require('../../assets/images/default-avatar.png')
    }


    render(){
        return(
            <img onError={this.handleError} className="user-avatar" onClick={this.handleClick} src={this.props.avatar ? `${this.props.avatar}?imageMogr2/thumbnail/!100x100r` : require('../../assets/images/default-avatar.png')} alt=""/>
        )
    }
}

export default CommonAvatar