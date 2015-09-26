# js-takarakuji-sim-vuejs
宝くじシミュレーター vueJS版

jQuery版を書き直すシリーズです
https://github.com/ryownet/js-takarakuji-sim

### ルール
- public/js/setting.json は変更しない
- それ以外はOK
- judge関数でくじ番号の当たり外れを照会します。ここを変えた場合はテストを通し、全てパスすること！



## とりあえず打つべきコマンド

```
css,js compile all
$ npm run dest

css, js, test all
$ npm run make
```


## 必要に応じて打つコマンド

```
css compile(scss -> css)
$ npm run css
```


```
js compile(webpack)
$ npm run js
```

```
js test
$ npm run test
```


## その他
- watchタスクは設定していません
- ビルドしたcss,jsはリポジトリに入れていません。コマンド打って生成してね



