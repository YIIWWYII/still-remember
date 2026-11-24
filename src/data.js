import { publicRecords, eras } from './public-records.js';
export { eras } from './public-records.js';

export const districts = [
  { id: 'space', title: '星海与远行', categories: ['cosmos', 'exploration'], paper: '#eef1f7', ink: '#303b55', accent: '#465b86' },
  { id: 'land', title: '地球与山川', categories: ['earth', 'nature'], paper: '#eef5f4', ink: '#2d4948', accent: '#356d70' },
  { id: 'life', title: '生命与共生', categories: ['species', 'ecology'], paper: '#f0f4ed', ink: '#394b35', accent: '#587344' },
  { id: 'together', title: '日常与相伴', categories: ['people', 'daily', 'companions'], paper: '#faf1ef', ink: '#59433f', accent: '#956256' },
  { id: 'civilization', title: '文明与故土', categories: ['history', 'places', 'crafts'], paper: '#f5f2e9', ink: '#514b35', accent: '#7b693b' },
  { id: 'culture', title: '文化与表达', categories: ['arts', 'objects'], paper: '#f5eff4', ink: '#51424e', accent: '#835c79' },
  { id: 'discovery', title: '科学与创造', categories: ['science', 'technology'], paper: '#edf4f8', ink: '#334c5b', accent: '#3d738e' },
  { id: 'digital', title: '数字往事', categories: ['internet', 'games'], paper: '#f0f2f5', ink: '#404954', accent: '#606d86' },
];
export const districtOf = (category) => districts.find((district) => district.categories.includes(category));
export const themeOf = (district) => district ? { '--paper': district.paper, '--ink': district.ink, '--green': district.accent, '--line': `${district.accent}35` } : {};
export const needsSupport = (category) => ['people', 'daily', 'companions'].includes(category);

export const categories = [
  { id: 'all', label: '全部', title: '时间里的万物' },
  { id: 'exploration', label: '太空探索', title: '向星空出发', subtitle: '探测器、航天任务与远行的足迹', image: 'apollo' },
  { id: 'ecology', label: '生态保护', title: '守护共生', subtitle: '栖息地的变化，和为生命留下的努力', image: 'forest' },
  { id: 'companions', label: '动物伙伴', title: '记得陪伴', subtitle: '一起生活过的伙伴，有它们自己的故事', image: 'window' },
  { id: 'daily', label: '日常相聚', title: '平常的一天', subtitle: '一顿饭、一次散步和那些寻常的相聚', image: 'lake' },
  { id: 'crafts', label: '手艺与民俗', title: '手中的传承', subtitle: '手艺、节日与一代代流传的习惯', image: 'town' },
  { id: 'arts', label: '文学与艺术', title: '作品的回声', subtitle: '文字、音乐、影像与创作留下的痕迹', image: 'letters' },
  { id: 'science', label: '科学与发现', title: '求知的足迹', subtitle: '发现、实验和逐渐改变的认识', image: 'curie' },
  { id: 'technology', label: '技术与发明', title: '改变生活的发明', subtitle: '工具、机器与它们走进日常的过程', image: 'camera' },
  { id: 'internet', label: '互联网往事', title: '曾经在线', subtitle: '网站、论坛与屏幕另一端的相遇', image: 'letters' },
  { id: 'games', label: '游戏与虚拟世界', title: '另一个世界', subtitle: '游戏、虚拟家园与共同经历的时光', image: 'cosmos' },
  { id: 'cosmos', label: '宇宙', title: '记得星辰', subtitle: '光走过的路，留下宇宙的往事', image: 'cosmos' },
  { id: 'earth', label: '地球', title: '记得世界', subtitle: '我们的家园，和它漫长的过去', image: 'earthrise' },
  { id: 'species', label: '物种', title: '记得生命', subtitle: '那些存在过，或仍与我们同行的生命', image: 'martha' },
  { id: 'people', label: '人物', title: '记得他们', subtitle: '那些认真生活过的人', image: 'window' },
  { id: 'history', label: '历史', title: '记得往日', subtitle: '改变世界的时刻，有据可循的往事', image: 'apollo' },
  { id: 'places', label: '地方', title: '记得这里', subtitle: '有些地方，离开以后仍是故乡', image: 'town' },
  { id: 'objects', label: '旧物', title: '记得它们', subtitle: '日常的物件，也收着一段时光', image: 'camera' },
  { id: 'nature', label: '自然', title: '记得天地', subtitle: '山川、草木，以及漫长的时间', image: 'forest' },

];


// Source-backed records come first; fictional editorial examples follow.
export const memories = [
  ...publicRecords,
  {
    id: 'summer-letter', title: '外婆的窗边，总有阳光', category: 'people', date: '2026-09-18',
    image: 'window', format: '一封信', author: '小禾', location: '留给家人，也留给世界',
    excerpt: '后来我才知道，那些平常的下午，就是我一直想回去的地方。',
    body: ['外婆总喜欢坐在窗边。上午十点，阳光刚好落到她手边的那张小桌上。她会把刚洗好的水果摆在盘子里，等我放学。', '那时我觉得日子很长。长到可以慢慢吃一个苹果，长到她讲过的故事，还能再讲一遍。', '我想记下的不是告别，是她开门时的那句“回来啦”，是针线盒里颜色不一的纽扣，是夏天冰在井水里的西瓜。', '如果你也有这样一个平常的下午，希望你能多坐一会儿。'],
  },
  {
    id: 'way-home', title: '那条回家的路', category: 'places', date: '1996-06-21',
    image: 'town', format: '地方记忆', author: '阿远', location: '一座海边小镇',
    excerpt: '巷子很窄，傍晚的饭香却装得下整个童年。',
    body: ['走过最后一个转角，就能看见家门口的灯。那时候没有导航，我认得每一扇窗，也认得晚饭前从窗里飘出的声音。', '这些年，小镇的路修宽了，有的店换了招牌。我仍记得旧时的走法：经过面包店，再向有花的阳台走。', '留一张照片在这里。也许有人会认出，自己曾在相似的地方长大。'],
  },
  {
    id: 'old-camera', title: '父亲的第一台相机', category: 'objects', date: '1986-05-04',
    image: 'camera', format: '一件旧物', author: '林间', location: '家中的旧木柜',
    excerpt: '它留下了很多照片，父亲却很少出现在照片里。',
    body: ['这台相机被父亲收在木柜的第二层。每次拿出来，他都会先把肩带绕在手腕上，再认真擦一遍镜头。', '相册里有生日、有旅行、有我第一次骑自行车。父亲总在镜头后面，只偶尔留下一道影子。', '现在我把相机放在自己的书架上。快门还能按下去，那一声轻响，和小时候听到的一样。'],
  },
  {
    id: 'forest-rain', title: '雨停之后，森林还在呼吸', category: 'nature', date: '2026-09-18',
    image: 'forest', format: '自然手记', author: '山野', location: '一次林间散步',
    excerpt: '树叶接住了最后一滴雨，我们在这里站了很久。',
    body: ['这场雨下了一整个上午。雨停时，山路上几乎没有人，只有鞋底踩在落叶上的声音。', '我不知道这片森林里的每一棵树叫什么。但那天我开始想知道，想知道它们在这里多久，春天又会是什么样子。', '记下这一天，记下潮湿的空气。明年再来时，想看看同一个地方。'],
  },
  {
    id: 'lake-morning', title: '湖边的第一个清晨', category: 'nature', date: '2008-10-02',
    image: 'lake', format: '旅途片刻', author: '简宁', location: '山间的一座湖',
    excerpt: '我们谁也没有说话，只是看着雾一点点散去。',
    body: ['天刚亮的时候，我们沿着湖岸走了很远。山的倒影映在水里，偶尔被一阵风打散。', '这不是一次特别的旅行。没有庆祝什么，也没有决定什么，只是一起度过了一个清晨。', '很多细节已经模糊了，水的颜色却一直记得。'],
  },
  {
    id: 'postcard', title: '邮戳上的那个夏天', category: 'objects', date: '1969-07-20',
    image: 'letters', format: '一张明信片', author: '见山', location: '一本旧相册里',
    excerpt: '“这里一切都好，等我回家。”背面只写了这一句。',
    body: ['整理相册时，一张明信片从夹页里滑了出来。地址写得很认真，字迹在纸的边缘渐渐淡了。', '我们不知道寄信的人那天见到了什么，只知道他惦记着回家。', '把这句简单的话存下来。许多很远的路，都是为了走回某个人身边。'],
  },
  {
    id: 'old-book', title: '书页里的一片叶子', category: 'objects', date: '1920-04-12',
    image: 'letters', format: '旧物随想', author: '南枝', location: '旧书店',
    excerpt: '书的主人已经无从寻找，那片叶子还在。',
    body: ['扉页上留下了一个年份。书页中间夹着一片已经失去颜色的叶子，叶脉却清楚得像刚刚摘下。', '也许这是某次散步的纪念，也许只是随手做成的书签。它的故事，我们只能想象。', '日期取自扉页题记；关于叶子的这段文字，是后来者的随想。'],
  },
  {
    id: 'spring-table', title: '春天，一起吃顿饭', category: 'people', date: '2026-03-15',
    image: 'window', format: '生活片刻', author: '小满', location: '留给朋友',
    excerpt: '那天没有什么特别的事，所有人刚好都有空。',
    body: ['我们把桌子搬到了窗边。每个人带了一道菜，吃到最后，也没分清谁做的哪一道。', '这张照片里有人在笑，有人在给别人盛汤。留住它，是因为这样的相聚应该被记得。'],
  },
  {
    id: 'late-summer', title: '夏末的最后一封信', category: 'people', date: '2026-08-30',
    image: 'letters', format: '一封信', author: '知夏', location: '写给未来的自己',
    excerpt: '别忘了这个夏天，你曾经很认真地喜欢过生活。',
    body: ['窗外的蝉声渐渐少了。整理桌子的时候，我想给以后的自己写几句话。', '记得按时吃饭，记得去看海。也记得，不是每一天都需要发生值得讲述的事情。'],
  },
];

export const categoryOf = (id) => categories.find((category) => category.id === id) || categories[0];
export const imageOf = (name) => `/images/${name || 'lake'}.jpg`;
export const formatDate = (date) => date.replaceAll('-', '.');
export const memoryDate = (memory) => memory.dateLabel || formatDate(memory.date);
export const timeKey = (memory) => memory.era || memory.date.slice(0, 4);
export const chronologicalValue = (memory) => memory.sortYear ?? Number(memory.date.replaceAll('-', '')) / 10000;
export const matchesTime = (memory, parts) => !parts.length || (eras[parts[0]] ? memory.era === parts[0] : !memory.era && memory.date.startsWith(parts.join('-')));
