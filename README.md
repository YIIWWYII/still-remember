# 仍然记得

让这个世界仍然记得。

以时间为入口的纪念档案网页原型。React + Vite + anime.js，摄影、字体均保存在本地项目中。

## 运行

```sh
npm install
npm run dev
```

生产构建：`npm run build`。预览构建：`npm run preview`。

## 本版内容

- 时间档案：年份 → 月份 → 日期，逐层聚焦，面包屑返回。
- 人物、地方、旧物、自然四个专题入口。
- 分类、日期排序、搜索、记忆详情、珍藏。
- 本机草稿：创建、编辑、删除、刷新恢复、文字导出；公开或私人发布意愿选择。
- 手机与桌面响应式布局、可关闭的缓慢镜头移动、尊重系统减少动态效果设置。

当前没有后端、账户系统、云端同步或真正的发布及访问授权。选择公开不会将草稿发布；所有草稿都只在当前浏览器保存。请导出重要记录，勿将此原型作为唯一备份。

## 公开资料档案

新增 10 条公开资料档案，覆盖宇宙、地球、物种、人物和历史。资料来自 NASA、史密森尼国家自然历史博物馆、伦敦自然历史博物馆、诺贝尔奖官网与 CERN，详情中附原始来源及影像说明。内容是中文整理摘要，不是历史人物原话。

宇宙初期、地球形成、白垩纪末期采用近似年代分组；有确切日期的事件继续支持年、月、日浏览。人物以出生日期归档，详情注明生卒年。事实数据与来源见 `src/public-records.js`。

原有 9 篇虚构故事保留并单独标注。历史影像与科学配图来自 NASA 或 Wikimedia Commons 的公开资料，每条详情均标注影像来源；艺术想象图和意境配图不冒充实拍记录。

## 设计

雾白 `#F6F7F3`、墨绿 `#405B50`、灰银 `#DCE0D8`，配合真实摄影中的天空灰、湖水绿和小镇色彩。中文标题使用思源宋体风格的 Noto Serif SC 字体子集；正文使用系统字体；数字刻度使用 Georgia。

视觉参考：

- [Kinfolk](https://www.kinfolk.com/)：摄影与留白、标题层级。
- [Online Museum Archive / Awwwards](https://www.awwwards.com/inspiration/collections-hover-online-museum-archive)：藏品浏览思路。

## 素材来源

摄影来自 Unsplash，本地存于 `public/images/`：

- 湖泊：`https://images.unsplash.com/photo-1470770841072-f978cf4d019e`
- 窗边：Peter Herrmann，[Grandma's attic](https://unsplash.com/photos/grayscale-photo-of-wooden-chair-near-window-XnoOrTIjgjw)
- 海边小镇：`https://images.unsplash.com/photo-1516483638261-f4dbaf036963`
- 相机：Zero，[Vintage camera collection](https://unsplash.com/photos/collection-of-vintage-cameras-displayed-on-shelves-and-tables-uDjDdH5KfdI)
- 森林：`https://images.unsplash.com/photo-1473448912268-2022ce9509d8`
- 书写：`https://images.unsplash.com/photo-1455390582262-044cdead277a`

字体为 Google Fonts 的 Noto Serif SC 字体子集，遵循 SIL Open Font License。图标为 Lucide。上线前应将意境配图替换为获授权的真实记录素材，并完成账户与权限实现。
