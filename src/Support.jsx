import React, { useState } from 'react';
import { HeartHandshake, Phone, Copy, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

const messages = {
  low: '我最近有些难过，想找一个信任的人聊聊。你今天方便陪我说一会儿话，或者一起待一会儿吗？',
  urgent: '我现在担心自己会伤害自己，需要有人陪着。请现在给我打电话，或者来陪我一起寻求紧急帮助。',
  other: '我注意到你最近很难受，有些担心你。你现在安全吗？有没有想过伤害自己？我愿意听你说，也可以陪你一起找专业帮助。',
};

export default function Support({ compact = false }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('low');
  const [region, setRegion] = useState('');
  const [message, setMessage] = useState(messages.low);
  const [feedback, setFeedback] = useState('');
  function changeMode(value) { setMode(value); setMessage(messages[value]); setFeedback(''); }
  async function copyMessage() {
    try { await navigator.clipboard.writeText(message); setFeedback('已复制。请自行发送给可信任的人；网站不会代发。'); }
    catch { setFeedback('未能自动复制，可以选中上方文字手动复制。'); }
  }
  return <aside className={`support-section ${compact ? 'support-compact' : ''}`} aria-label="关怀与求助">
    <div className="support-intro"><HeartHandshake size={24} strokeWidth={1.5} /><div><h2>也照顾此刻的你</h2><p>{compact ? '不必现在写完，也可以先找个人陪一会儿。' : '如果这些回忆让你难受，可以先停一停。你可以在这里找到支持。'}</p></div><button type="button" className="text-button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '收起支持' : '找一份支持'}{open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}</button></div>
    {open && <div className="support-content">
      <p className="support-urgent-note">如果你已经受伤、服用了可能有害的东西，或可能马上伤害自己，请立即联系当地急救或去最近的急诊。尽可能请身边的人陪同，不要独处或等待网上回复。</p>
      <label className="support-field">此刻更接近哪种情况？<select value={mode} onChange={(event) => changeMode(event.target.value)}><option value="low">我有些难过，想找人聊聊</option><option value="urgent">我担心自己会伤害自己</option><option value="other">我担心身边的人</option></select></label>
      <section className="support-guidance" aria-live="polite">
        <h3>{mode === 'urgent' ? '先让接下来的这一刻安全一些' : mode === 'other' ? '陪伴，也一起找到专业帮助' : '可以先做一件小事'}</h3>
        {mode === 'urgent' ? <><p>先暂停伤害自己的行动，走到有人、相对安全的地方。与可能伤害自己的物品保持距离，请可信任的人帮助保管，并告诉对方你需要陪伴。</p><p>如果一时联系不上这个人，继续联系另一位可信任的人、心理援助热线或急救。你不需要独自处理眼前的危险。</p></> : mode === 'other' ? <><p>可以直接、平静地询问对方是否想到自杀、现在是否安全。认真听，不责备、不争辩，也不要要求对方“想开点”。</p><p>有迫近危险时，在确保你自身安全的前提下陪着对方，并联系急救或可信任的成年人。不要承诺为迫近的危险保密，也不必独自承担救助责任。</p></> : <><p>暂时离开让你难受的内容，喝一点水，感受脚踩在地上的支撑。准备好时，可以联系一位你信任的人，说说此刻的感受。</p><p>如果低落持续，或已经影响睡眠、饮食和生活，可以预约心理咨询或精神心理科。无需等到情况非常严重才寻求帮助。</p></>}
      </section>
      <section className="support-contact"><h3>联系身边的人</h3><label className="support-field">想对对方说的话<textarea rows={3} value={message} onChange={(event) => { setMessage(event.target.value); setFeedback(''); }} /></label><button type="button" className="text-button" onClick={copyMessage} disabled={!message.trim()}><Copy size={16} />复制求助信息</button><p role="status" className="support-status">{feedback}</p></section>
      <section className="support-resources"><h3>寻求专业与紧急支持</h3><label className="support-field">你所在的地区<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="">请选择，不会自动定位</option><option value="cn">中国大陆</option><option value="other">其他地区</option></select></label>
        {region === 'cn' && <><div className="support-phone-links"><a href="tel:120"><Phone size={17} />120 · 医疗急救</a><a href="tel:12356"><Phone size={17} />12356 · 心理援助</a></div><p>12356 不是急救电话。服务时段及接通情况以当地为准；若有眼前危险，请拨打 120 或前往急诊，不要等待热线接通。</p><a className="support-source" href="https://www.nhc.gov.cn/yzygj/c100068/202412/49a1a65386cd4be582d4702fd0926ee8.shtml" target="_blank" rel="noreferrer">国家卫健委 · 12356 热线通知<ArrowUpRight size={14} /></a></>}
        {region === 'other' && <><p>有眼前危险时，请拨打所在地急救电话或前往最近的急诊。非紧急情况下，可按国家或地区查找援助资源。</p><a className="text-button" href="https://findahelpline.com/" target="_blank" rel="noreferrer">查找当地援助热线（外部网站）<ArrowUpRight size={16} /></a></>}
      </section>
      <p className="support-privacy">这里没有实时值守、自动报警或在线互助匹配。所选状态和求助文字不上传、不保存；复制后由你决定是否发送。此入口不作诊断，也不能替代专业支持。</p>
    </div>}
  </aside>;
}
