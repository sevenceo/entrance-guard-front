import fetch from 'utils/fetch';
import axios from 'axios'

//links

export function GetExternalLinksList(page) {


    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            account: page.account,
            viewMode: page.viewMode,
            name:page.name
        }
    }
    return fetch({
        url: '/material/api/we-chat-material-links',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("外链 列表 接口")
        console.log(result)
        return result
    })
}
export function CreateExternalLinks(data) {
    return fetch({
        url: '/material/api/we-chat-material-links',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("创建 外链 接口")
        console.log(result)
        return result
    })
}
export function UpdateExternalLinks(data) {
    return fetch({
        url: '/material/api/we-chat-material-links',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("更新 外链 接口")
        console.log(result)
        return result
    })
}
export function DeleteExternalLinks(id,account) {
    let params = {
        account: account
    }

    return fetch({
        url: '/material/api/we-chat-material-links/' + id,
        method: 'delete',
        params: params
    }).then(function (result) {
        console.log("删除 外链 接口")
        console.log(result)
        return result
    })
}
export function DownloadExternalLinks(data) {

    return fetch({
        url: '/material/api/we-chat-material-links/import',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("下载 文本 接口")
        console.log(result)
        return result
    })
}



export function AvatarUpload(file) {
    let formData = new FormData();
    formData.append("file", file)
    return axios({
        method: 'post',
        url: process.env.BASE_API + '/material/api/file/upload',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
        .then(function (result) {
            console.log("上传 头像接口")
            console.log(result)
            return result
        })
}




//text

export function GetTextList(page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            account:page.account,
            viewMode: page.viewMode,
            name:page.name
        }
    }
    return fetch({
        url: '/material/api/we-chat-material-texts',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("text列表接口")
        console.log(result)
        return result
    })
}

export function CreateText(data) {
    return fetch({
        url: '/material/api/we-chat-material-texts',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("新建text 接口")
        console.log(result)
        return result
    })
}

export function UpdateText(data) {
    return fetch({
        url: '/material/api/we-chat-material-texts',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("更新text 接口")
        console.log(result)
        return result
    })
}

export function DeleteText(id,account) {
    let params = {
        account: account
    }

    return fetch({
        url: '/material/api/we-chat-material-texts/' + id,
        method: 'delete',
        params: params
    }).then(function (result) {
        console.log("删除 文本 接口")
        console.log(result)
        return result
    })
}
export function DownloadText(data) {

    return fetch({
        url: '/material/api/we-chat-material-texts/import',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("下载 文本 接口")
        console.log(result)
        return result
    })
}



//images

export function GetImageList(page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            account:page.account,
            viewMode: page.viewMode,
            name:page.name
        }
    }
    return fetch({
        url: '/material/api/we-chat-material-images',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("获取 image列表接口")
        console.log(result)
        return result
    })
}

export function CreateImage(data) {
    return fetch({
        url: '/material/api/we-chat-material-images',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("创建 image 列表接口")
        console.log(result)
        return result
    })
}

export function UpdateImage(data) {
    return fetch({
        url: '/material/api/we-chat-material-images',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("更新 image 列表接口")
        console.log(result)
        return result
    })
}

export function DeleteImage(id,account) {
    let params = {
        account: account
    }
    return fetch({
        url: '/material/api/we-chat-material-images/' + id,
        method: 'delete',
        params: params
    }).then(function (result) {
        console.log("删除 image 列表接口")
        console.log(result)
        return result
    })
}
export function DownloadImage(data) {

    return fetch({
        url: '/material/api/we-chat-material-images/import',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("下载 images 接口")
        console.log(result)
        return result
    })
}


//video

export function GetVideoList(page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            account:page.account,
            viewMode: page.viewMode,
            name:page.name
        }
    }
    return fetch({
        url: '/material/api/we-chat-material-videos',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("获取 video列表接口")
        console.log(result)
        return result
    })
}

export function CreateVideo(data) {
    return fetch({
        url: '/material/api/we-chat-material-videos',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("创建 video列表接口")
        console.log(result)
        return result
    })
}

export function UpdateVideo(data) {
    return fetch({
        url: '/material/api/we-chat-material-videos',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("更新 video列表接口")
        console.log(result)
        return result
    })
}

export function DeleteVideo(id,account) {
    let params = {
        account: account
    }
    return fetch({
        url: '/material/api/we-chat-material-videos/' + id,
        method: 'delete',
        params: params
    }).then(function (result) {
        console.log("删除 video列表接口")
        console.log(result)
        return result
    })
}
export function DownloadVideo(data) {

    return fetch({
        url: '/material/api/we-chat-material-videos/import',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("下载 videos 接口")
        console.log(result)
        return result
    })
}
//voice

export function GetVoiceList(page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            account:page.account,
            viewMode: page.viewMode,
            name:page.name
        }
    }
    return fetch({
        url: '/material/api/we-chat-material-voices',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("获取 video列表接口")
        console.log(result)
        return result
    })
}

export function CreateVoice(data) {
    return fetch({
        url: '/material/api/we-chat-material-voices',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("创建 video列表接口")
        console.log(result)
        return result
    })
}

export function UpdateVoice(data) {
    return fetch({
        url: '/material/api/we-chat-material-voices',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("更新 video列表接口")
        console.log(result)
        return result
    })
}

export function DeleteVoice(id,account) {
    let params = {
        account: account
    }
    return fetch({
        url: '/material/api/we-chat-material-voices/' + id,
        method: 'delete',
        params: params
    }).then(function (result) {
        console.log("删除 video列表接口")
        console.log(result)
        return result
    })
}
export function DownloadVoice(data) {

    return fetch({
        url: '/material/api/we-chat-material-voices/import',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("下载 voices 接口")
        console.log(result)
        return result
    })
}

//news

export function GetArticlePhotoList(page) {
    let params;

    if(page){
        params = {
            page:page.page - 1,
            size: page.size,
            viewMode: page.viewMode,
            name:page.name,
            account:page.account
            // name: page.name,
            // type: page.type
        }
    }

    return fetch({
        url: '/material/api/we-chat-material-newss',
        method: 'get',
        params: params,
    }).then(function (response) {
        console.log("获取 共享 图文素材列表接口")
        console.log(response)
        return response
    })
}
export function DownloadArticlePhotoList(data) {

    return fetch({
        url: '/material/api/we-chat-material-newss/import',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("下载 图文 接口")
        console.log(result)
        return result
    })
}

