import request from '@/boot/request'

export function signData(reportId,datas,md5,testbed) {
    return request({
      url: '/sign_data',
      method: 'post',
      header:{

        'Content-Type':'application/x-www-form-urlencoded'
        
        },
      data: {
        data:datas,
        md5:md5,
        testbed:testbed
      },
      params:{
          reportId
      }
    })
  }
  
  export function signData1(start,len,dataType) {
    return request({
      url: '/pump/templet',
      method: 'post',
      params:{
          start,
          len,
          dataType
      }
    })
  }