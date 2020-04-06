# 并不是assets下的文件都会转为base64格式 #

· vue-webpack模板的默认设置限制了转码的文件大小为10000B（差不多9.76KB）以下，如果要修改这个限制，需要修改webpack中的url-loader配置
