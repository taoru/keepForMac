import Utils from './Utils.js'
import moment from 'moment'
import autobind from 'autobind-decorator'

const hostname = 'https://api.gotokeep.com'

const serializeJSON = (data) => {
    return Object.keys(data).map((keyName) => {
        return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
    }).join('&');
}

export default {

    getToken() {
        const authentication = Utils.storage.get('authentication') || {}
        return 'Bearer '+ authentication.token
    },

    httpGet(url, options = {}){
        if(!url){
            return false
        }

        options = Object.assign({
            method: 'GET',
            headers: {
                'Authorization': this.getToken()
            }
        }, options)

        return fetch(hostname + url, options).then((res) => res.json())
    },

    httpPost(url, options = {}){
        if(!url){
            return false
        }
        options = Object.assign({
            method: 'POST',
            headers: {
                'Authorization': this.getToken()
            }
        }, options)

        return fetch(hostname + url, options).then((res) => {
            if(res.status == 200)
                return res.json()
            return res
        })
    }

    /* 全局搜索 ***/
    ,getGlobalSearch(keyword){
        return this.httpGet('/search/v3/global?keyword='+ keyword +'&trainer_gender=m')
    }


    /* Dashboard *********************************************************************/

    // Plans
    ,getDashboardTraining() {
        return this.httpGet('/training/v2/home')
    }

    ,getDashboardWorkouts() {
        return this.httpGet('/v2/home/dashboard/pwData')
    }

    // Statistics
    ,getDashboardStatistics() {
        return this.httpGet('/v1.1/home/dashboard/statistics')
    }
    // User
    ,getDashboardUser() {
        return this.httpGet('/v1.1/home/dashboard/user')
    }
    ,getRankingData() {
        const para = serializeJSON({
            date: moment().format('YYYYMMDD')
        })
        return this.httpGet('/social/v2/rankinglist/brief?'+para)
    }

    // user login
    ,login(data) {
        return this.httpPost('/v1.1/users/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            body: serializeJSON(data)
        })
    }

    // 用户个人信息
    ,getUserData(userID) {
        return this.httpGet('/v2/people/'+ userID)
    }


    // workouts content
    //getExploreContent() {
    //    return fetch('https://show.gotokeep.com/explore/', {
    //        method: 'GET',
    //        headers: {
    //            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    //            'Authorization': this.getToken()
    //        }
    //    })
    //}


    /* 训练 *********************************************************************/

    // workout plan
    ,getPlansContent(workoutsId, gender = 'm'){
        return this.httpGet('/v2/plans/'+ workoutsId +'?trainer_gender='+ gender)
    }
    // 获取训练内容计划[以及同类推荐]
    ,getWorkoutsPlans(planId){
        return this.httpGet('/training/v2/plans/'+ planId +'/dynamic?tLimit=3&tSlimWorkout=true')
    }
    // 获取 总打卡数量/训练评论/完成用户/座右铭
    ,getWorkoutsWorks(workoutId){
        return this.httpGet('/training/v2/workouts/'+ workoutId +'/dynamic?tLimit=3')
    }

    // 完成训练
    ,completeExercise(){
        return this.httpGet('/now')
    }

    // 完成训练提交训练状态
    ,commitTrainingLog(json){
        return this.httpPost('/v1.1/home/saveTrainingLog', Object.assign({
            'serverEndTime': new Date().toISOString(),
            'doneDate': new Date().toISOString(),
        }))
    }

    // 完成训练查询是否获得新成就
    ,checkAchievements(json){
        return this.httpPost('/v1.1/home/achievements/new')
    }


    /* 动态 *********************************************************************/

    /**
     * 获取关注动态列表
     * @ lastId = 列表开始索引id（空值为最新处开始）
     */
    ,getFollowTimeline(lastId = ''){
        return this.httpGet('/social/v2/follow/timeline?lastId='+ lastId)
    }

    // 动态点赞
    ,setArticleLike(artId){
        return this.httpPost(`/v1.1/entries/${artId}/likes`)
    }

    // 动态详情
    ,getFollowDetail(artId){
        return this.httpGet(`/v1.1/entries/${artId}?limit=20&reverse=true`)
    }
    // 动态详情评论
    ,getFollowComments(artId, lastId = ''){
        return this.httpGet(`/v1.1/entries/${artId}/comments?lastId=${lastId}&limit=20&reverse=true`)
    }
    // 动态详情精彩评论
    ,getFollowHotComments(artId){
        return this.httpGet(`/v1.1/entries/${artId}/comments/hot`)
    }


    /* 好友 *********************************************************************/

    ,addUserFollow(userId){
        return this.httpPost(`/v1.1/people/${userId}/follow`)
    }
    ,removeUserFollow(userId){
        return this.httpPost(`/v1.1/people/${userId}/unfollow`)
    }


    // 获取城市列表
    ,getCityJson(){
        return this.httpGet('/v1.1/home/cities')
    }

}

