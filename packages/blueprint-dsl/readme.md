```ts
//ui上的每个节点都要提供增删改查的
{
    node:'[alert_table[0]]'
    event:'touch[table_head]',
    prop:''
    task:['update[remote][*],add-[popup_alert_[number]']
},{
   node:'[alert_table[1]]'
    event:'touch[[(table_head),传给句柄的参数].[(payload),2,发了一个2]]',
    task:['update[[(find),self].[(remote),payload[发了一个2]]],create[[(nodeBy),popup_alert].[(position),3,4].[(scale),1,1].[(color),red]]']
},{
   node:['alert_table[number]']
    event:'timer[0][2000]',
    payload:['arron_date[YYYY-MM-DD]',
    'alert_table[id]',
    'alert_table_[system_info_user[userId]]'],
    task:['update_remote_alert_table,add-[popup_alert[number]']
}

```

```ts
变量使用[]来标记
注意不符合如下规则的一律不执行并且跳过（会警告但不会抛出错误），所以debugger需要注意下


task一定是同步执行的，如存在竞态，就别拆成多个task，放一个里用，竞态如存在则warn，最新的使用并覆盖，但不抛出错误

event一定是依附于node的，生效的主体也是node

event提供的方法，实际上是订阅
touch 点击
touch[table_head]:点击节点提供的table_head句柄时出发。句柄由组件提供，可自定义，并且允许发送参数
如：
touch[[(table_head),2]]:点击table_head句柄后传递一个2进入 payload里

系统提供全局级别的变量：
arron_timer:定时器
arron_timer[0][2000]:0ms以后每2000ms执行一次task，如下
arron_timer[delay][interval]:字面意思。可以实现延时器或定时器

组建不以arron开头，如告警列表
alert_table
没生成一个会后面加一串id，默认数字递增。每个组件都需要实现crud
即：
update 更新

update[[*].[(remote),payload[name]]] 更新所有的remote，传递的参数是payload的【name】的值
update[(remote)] 更新数据接口


update[[(find),self].[(remote)].[(repeat),4,'switch']]:更新自己4次，switch表示更新策略，switch是覆盖，concat是队列，不写默认concat。注意任务都存在repeat的方法。如果空调用repeat，则无效。

remove
create




arron_date : 时间
arron_date[(format),YYYY-MM-DD] : 获取时间 YYYY-MM-DD 结构生成时间字符串
arron_date[dayjs]:获取时间 Dayjs
arron_date[(add)2,day]:获取时间当前时间往后加两天

支持链式
arron_date[[(add),2,day].[(format),YYYY-MM-DD]] :连天后转化为yyymmdd的字符串。.表示返回值传递

arron_date[[(add),2,day],[(format),YYYY-MM-DD]] :逗号表示上一个的值不传递下去

支持数据匹配，比如第三个的参数是第一个的返回值，第四个是第二个的返回值，如下
arron_date[[(add),2,day],[(format),YYYY-MM-DD],
[(format),arg[0]],
[(format),arg[1].[(toString)]]
]
一定是数据处理完传递，而不是在arg里修改，如：
arron_date[[(add),2,day].[
    (format),YYYY-MM-DD
],[(format),YYYY-MM-DD],
[(Number),arg[0]],
[(format),arg[1].[(toString)]]
]
而不是
arron_date[[(add),2,day],[(format),YYYY-MM-DD],
[(Number),arg[0][(format),YYYY-MM-DD]],
[(format),arg[1].[(toString)]]
]

如果节点名称后有[number] 表示所有满足条件的后缀是数字的节点；
[*]表示所有

```

实际引申出来的是另外一套dsl
 
```js
{
    source:{
        id:'id-xx',
         match:'*',
    },
    event:{
        name:'touch',
        //作用于
        actingUpon:'table_head',
        task:[{
            action:'update',
            payload:[
                {
                    fn:'find',
                    params:{
                        //作用于当前节点
                         target:['selfNode','*']
                    },
                    next:{
                        fn:'remote',
                        params:{
                            input:2,
                            timer:[0,2000]
                        }
                    }
                    },
            ]
        }]
    },

}
```
