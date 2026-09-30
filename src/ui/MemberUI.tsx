import React from 'react';
import {BRAND, CHANNEL, CHAT, MEMBER_VIDEOS, PERKS, TIERS, SELECTED_TIER, VIEWER} from '../config/channel';
import {clamp, EASE} from '../lib/motion';
import {FONT, YT} from '../theme/tokens';
import {REAL} from './assets';
import {BADGE_LABELS, ChannelAvatar, LetterAvatar, MemberBadge} from './Brand';
import {Pill} from './Button';
import {VideoCard} from './ChannelPage';
import {CustomEmoji, type EmojiName} from './Emoji';
import {Icon, type IconName} from './Icon';

const PERK_ICON: Record<string, IconName> = {badge: 'badge', emoji: 'emoji', video: 'video', bolt: 'bolt'};
const PERK_TINT = [BRAND.cyan, BRAND.sky, BRAND.violet, '#fbbf24'];

// ───────────────────────────── Welcome dialog ─────────────────────────────

export const WELCOME = {w: 600, h: 560};

export const WelcomeDialog: React.FC<{appear: number; badgeIn?: number; gotItHover?: number; gotItPress?: number; frame: number}> = ({
  appear,
  badgeIn = 1,
  gotItHover = 0,
  gotItPress = 0,
  frame,
}) => {
  const tier = TIERS[SELECTED_TIER];
  const item = (k: number) => {
    const p = EASE.out(clamp(appear * 2.2 - 0.5 - k * 0.14));
    return {opacity: p, transform: `translateY(${(1 - p) * 18}px)`};
  };
  return (
    <div
      style={{
        position: 'relative',
        width: WELCOME.w,
        height: WELCOME.h,
        borderRadius: 16,
        background: YT.raised,
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        fontFamily: FONT.ui,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 150,
          background: `radial-gradient(circle at 50% 120%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%), ${BRAND.gradient}`,
          overflow: 'hidden',
        }}
      >
        {Array.from({length: 26}).map((_, i) => {
          const x = (i * 97) % 600;
          const y = ((i * 53 + frame * (0.6 + (i % 5) * 0.2)) % 170) - 20;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: i % 3 === 0 ? 6 : 4,
                height: i % 3 === 0 ? 10 : 4,
                borderRadius: i % 3 === 0 ? 1 : 2,
                background: 'rgba(255,255,255,0.55)',
                transform: `rotate(${i * 37 + frame * 3}deg)`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 86,
          marginLeft: -52,
          transform: `scale(${0.5 + EASE.outBack(clamp(appear * 2)) * 0.5})`,
        }}
      >
        <ChannelAvatar size={104} style={{boxShadow: `0 0 0 5px ${YT.raised}`}} />
        <div
          style={{
            position: 'absolute',
            right: -10,
            bottom: -6,
            transform: `scale(${EASE.outBack(clamp(badgeIn))}) rotate(${(1 - clamp(badgeIn)) * -90}deg)`,
          }}
        >
          <div style={{borderRadius: 12, background: YT.raised, padding: 3}}>
            <MemberBadge size={40} level={tier.level} id="welcome" />
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 206, textAlign: 'center', ...item(0)}}>
        <div style={{fontSize: 24, fontWeight: 700, color: YT.text}}>Welcome to the {CHANNEL.name} membership!</div>
        <div style={{fontSize: 14, color: YT.text2, marginTop: 6}}>
          You're now a <span style={{color: YT.text, fontWeight: 500}}>{tier.name}</span> member · Your perks are ready
        </div>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 282}}>
        {PERKS.map((p, i) => (
          <div key={p.title} style={{display: 'flex', alignItems: 'center', gap: 14, height: 50, ...item(i + 1)}}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: `${PERK_TINT[i]}26`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={PERK_ICON[p.icon]} size={20} color={PERK_TINT[i]} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 15, fontWeight: 500, color: YT.text}}>{p.title}</div>
              <div style={{fontSize: 13, color: YT.text2}}>{p.text}</div>
            </div>
            {i === 0 ? <MemberBadge size={26} level={tier.level} id="welcomeperk" /> : null}
            {i === 1 ? (
              <div style={{display: 'flex', gap: 4}}>
                {(['cloudHappy', 'rocket', 'codeHeart'] as EmojiName[]).map((e) => (
                  <CustomEmoji key={e} name={e} size={24} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', right: 32, bottom: 26, ...item(5)}}>
        <Pill label="Got it" variant="cta" height={40} padX={24} hover={gotItHover} press={gotItPress} />
      </div>
    </div>
  );
};

// ───────────────────────────── Live chat ─────────────────────────────

export const CHAT_PANEL = {w: 420, h: 660};

type ChatLine =
  | {kind: 'msg'; name: string; color: string; text: string; member?: boolean; owner?: boolean; emoji?: EmojiName[]}
  | {kind: 'newMember'};

const LINES: ChatLine[] = [
  ...CHAT.slice(0, 3).map((c) => ({kind: 'msg' as const, ...c})),
  {kind: 'newMember'},
  {kind: 'msg', name: VIEWER.name, color: VIEWER.color, text: 'Just joined! Love the LLM series', member: true, emoji: ['cloudHappy', 'rocket']},
  {kind: 'msg', name: CHANNEL.name, color: BRAND.blue, text: 'Welcome to the crew, Alex!', owner: true, emoji: ['codeHeart']},
  {kind: 'msg', name: CHAT[3].name, color: CHAT[3].color, text: 'welcome!!', emoji: ['fire']},
  {kind: 'msg', name: CHAT[4].name, color: CHAT[4].color, text: 'lets gooo', emoji: ['lgtm']},
];

const LINE_H = (l: ChatLine) => (l.kind === 'newMember' ? 96 : 44);

/** YouTube live chat panel. `revealed` = number of lines shown (fractional animates the newest). */
export const LiveChat: React.FC<{revealed: number; frame: number; highlight?: number}> = ({revealed, frame, highlight = 0}) => {
  const shown = LINES.slice(0, Math.ceil(revealed));
  const total = shown.reduce((acc, l, i) => {
    const frac = i === shown.length - 1 ? clamp(revealed - i) : 1;
    return acc + LINE_H(l) * EASE.out(frac);
  }, 0);
  const areaH = CHAT_PANEL.h - 52 - 76;
  return (
    <div
      style={{
        width: CHAT_PANEL.w,
        height: CHAT_PANEL.h,
        borderRadius: 14,
        background: YT.base,
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: FONT.ui,
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{height: 52, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
        <span style={{fontSize: 16, color: YT.text}}>Top chat</span>
        <Icon name="chevronDown" size={20} color={YT.text} />
        <div style={{flex: 1}} />
        <div
          style={{
            background: YT.red,
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 4,
            padding: '2px 6px',
            marginRight: 10,
            opacity: 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.08)),
          }}
        >
          LIVE
        </div>
        <Icon name="more" size={22} color={YT.text} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 52, height: areaH, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: areaH - total - 8}}>
          {shown.map((l, i) => {
            const frac = i === shown.length - 1 ? clamp(revealed - i) : 1;
            const a = EASE.out(frac);
            if (l.kind === 'newMember') {
              return (
                <div key={i} style={{padding: '4px 12px', height: LINE_H(l), boxSizing: 'border-box', opacity: a, transform: `scale(${0.9 + a * 0.1})`}}>
                  <div
                    style={{
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: YT.memberBanner,
                      boxShadow: `0 0 ${30 * highlight}px rgba(15,157,88,${0.7 * highlight})`,
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px'}}>
                      <LetterAvatar size={40} letter={VIEWER.initial} color={VIEWER.color} />
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#fff'}}>
                          {VIEWER.name} <MemberBadge size={16} level={0} id="chatnew" />
                        </div>
                        <div style={{fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2}}>
                          New member · Welcome to {TIERS[SELECTED_TIER].name}!
                        </div>
                      </div>
                      <Icon name="star" size={22} color="#fff" />
                    </div>
                  </div>
                </div>
              );
            }
            const nameColor = l.owner ? '#0f0f0f' : l.member ? YT.member : YT.text2;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '8px 16px',
                  height: LINE_H(l),
                  boxSizing: 'border-box',
                  opacity: a,
                  transform: `translateY(${(1 - a) * 14}px)`,
                  background: l.member ? `rgba(43,166,64,${0.08 + highlight * 0.1})` : undefined,
                }}
              >
                {l.owner ? <ChannelAvatar size={24} /> : <LetterAvatar size={24} letter={l.name[0].toUpperCase()} color={l.color} />}
                <div style={{fontSize: 13, lineHeight: '24px', color: YT.text, whiteSpace: 'nowrap'}}>
                  <span
                    style={{
                      color: nameColor,
                      fontWeight: 500,
                      background: l.owner ? YT.owner : undefined,
                      borderRadius: 2,
                      padding: l.owner ? '1px 4px' : undefined,
                      marginRight: 6,
                    }}
                  >
                    {l.name}
                  </span>
                  {l.member ? (
                    <span style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 6, marginTop: -3}}>
                      <MemberBadge size={16} level={TIERS[SELECTED_TIER].level} id="chatmsg" />
                    </span>
                  ) : null}
                  {l.text}
                  {l.emoji?.map((e) => (
                    <CustomEmoji key={e} name={e} size={22} style={{marginLeft: 4, marginTop: -3}} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 76,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
        }}
      >
        <LetterAvatar size={24} letter={VIEWER.initial} color={VIEWER.color} />
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: YT.member, fontWeight: 500}}>
            {VIEWER.name} <MemberBadge size={14} level={TIERS[SELECTED_TIER].level} id="chatinput" />
          </div>
          <div style={{fontSize: 14, color: YT.text2, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 4, marginTop: 2}}>
            Chat publicly as {VIEWER.handle}...
          </div>
        </div>
        <Icon name="emoji" size={24} color={YT.text2} />
        <Icon name="send" size={22} color={YT.text3} />
      </div>
    </div>
  );
};

// ───────────────────────────── Members-only shelf ─────────────────────────────

export const SHELF = {w: 940, h: 440};

const LockGlyph: React.FC<{open: number; size?: number}> = ({open, size = 56}) => (
  <svg viewBox="0 0 48 48" width={size} height={size} style={{overflow: 'visible'}}>
    <g transform={`translate(${open * 9} ${-open * 7}) rotate(${open * 28} 33 20)`}>
      <path d="M15 22v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
    </g>
    <rect x="9" y="21" width="30" height="22" rx="6" fill="#fff" />
    <circle cx="24" cy="31" r="3.2" fill="#0f0f0f" />
    <rect x="22.6" y="32" width="2.8" height="6" rx="1.2" fill="#0f0f0f" />
  </svg>
);

export const MembersShelf: React.FC<{unlock: number[]; appear: number}> = ({unlock, appear}) => {
  const w = 290;
  return (
    <div
      style={{
        width: SHELF.w,
        height: SHELF.h,
        borderRadius: 16,
        background: YT.base,
        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT.ui,
        padding: '26px 30px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20}}>
        <MemberBadge size={30} level={TIERS[SELECTED_TIER].level} id="shelf" />
        <div>
          <div style={{fontSize: 20, fontWeight: 700, color: YT.text}}>Members-only videos</div>
          <div style={{fontSize: 13, color: YT.text2}}>Unlocked with your {TIERS[SELECTED_TIER].name} membership</div>
        </div>
        <div style={{flex: 1}} />
        <Pill label="Play all" icon="play" variant="white" height={36} />
      </div>
      <div style={{display: 'flex', gap: 16}}>
        {MEMBER_VIDEOS.map((v, i) => {
          const u = clamp(unlock[i] ?? 0);
          const a = EASE.out(clamp(appear * 2 - i * 0.25));
          return (
            <div key={v.title} style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
              <VideoCard
                v={v}
                index={i}
                width={w}
                src={REAL.memberThumb(i)}
                badge={
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: 'rgba(43,166,64,0.16)',
                      color: '#4ade80',
                      borderRadius: 4,
                      padding: '0 6px',
                      fontSize: 12,
                      fontWeight: 500,
                      height: 20,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon name="star" size={12} color="#4ade80" /> Members only
                  </span>
                }
                overlay={
                  u < 1 ? (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `rgba(10,10,14,${0.72 * (1 - u)})`,
                        backdropFilter: `blur(${10 * (1 - u)}px)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          opacity: 1 - clamp((u - 0.55) * 3),
                          transform: `scale(${1 + Math.sin(clamp(u * 2) * Math.PI) * 0.15 - clamp((u - 0.55) * 3) * 0.4})`,
                        }}
                      >
                        <LockGlyph open={EASE.outBack(clamp(u * 2))} />
                      </div>
                    </div>
                  ) : undefined
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────────────────────────── Loyalty badge ladder ─────────────────────────────

export const LADDER = {w: 520, h: 440};

export const BadgeLadder: React.FC<{progress: number; frame: number}> = ({progress, frame}) => {
  const level = Math.min(3, Math.floor(progress));
  return (
    <div
      style={{
        width: LADDER.w,
        height: LADDER.h,
        borderRadius: 16,
        background: YT.raised,
        boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT.ui,
        padding: 28,
        boxSizing: 'border-box',
      }}
    >
      <div style={{fontSize: 20, fontWeight: 700, color: YT.text}}>Loyalty badges</div>
      <div style={{fontSize: 13, color: YT.text2, marginTop: 4}}>Your badge levels up the longer you stay a member</div>
      <div style={{position: 'relative', height: 150, marginTop: 34}}>
        <div style={{position: 'absolute', left: 40, right: 40, top: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)'}} />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 40,
            height: 4,
            borderRadius: 2,
            width: `${(clamp(progress / 3) * (LADDER.w - 56 - 80))}px`,
            background: BRAND.gradient,
            boxShadow: '0 0 12px rgba(99,102,241,0.8)',
          }}
        />
        {BADGE_LABELS.map((label, i) => {
          const active = clamp(progress - i + 1);
          const pop = EASE.outBack(clamp((progress - i) * 2.5 + 1));
          const x = 40 + (i * (LADDER.w - 56 - 80)) / 3;
          return (
            <div key={label} style={{position: 'absolute', left: x - 36, top: 0, width: 72, textAlign: 'center'}}>
              <div
                style={{
                  width: 72,
                  height: 84,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${0.7 + 0.3 * Math.min(1, pop)})`,
                  filter: active > 0.5 ? `drop-shadow(0 0 ${i === level ? 16 : 6}px rgba(99,102,241,0.8))` : 'grayscale(1) brightness(0.55)',
                }}
              >
                <MemberBadge size={58} level={i} id={`ladder${i}`} shine={i === level ? (frame % 45) / 45 : undefined} />
              </div>
              <div style={{fontSize: 13, fontWeight: 500, color: active > 0.5 ? YT.text : YT.text3, marginTop: 8}}>{label}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 30,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.05)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <LetterAvatar size={36} letter={VIEWER.initial} color={VIEWER.color} />
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: YT.text}}>
            {VIEWER.handle}
            <MemberBadge size={16} level={level} id="laddercomment" />
            <span style={{color: YT.text3, fontWeight: 400}}>· 2 min ago</span>
          </div>
          <div style={{fontSize: 14, color: YT.text, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6}}>
            Members-only source code is worth it <CustomEmoji name="codeHeart" size={20} />
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4, color: YT.text2, fontSize: 12}}>
          <Icon name="like" size={18} color={YT.text2} /> 124
          <Icon name="heart" size={16} color="#ff4e45" style={{marginLeft: 8}} />
        </div>
      </div>
    </div>
  );
};
