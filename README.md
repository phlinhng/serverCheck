# 檢查服務器是否被牆 Telegram BOT
使用<www.toolsdaquan.com>提供的API接口製作的Telegram BOT，可檢測服務器在大陸有無被牆並自動發送檢測結果到指定的TG帳戶中。

# Requirements
+ node
+ axios
+ bluebird
+ crontab

# 用法
使用`crontab`每天固定時間檢查一次。
```
# check server availability evrey day at 8am
# m h dom mon dow  command
0 8 * * * ~/serverCheck/daily.sh
```
