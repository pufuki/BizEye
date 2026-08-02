interface DoodlesProps {
  className?: string;
}

const DOODLES = [
  { id: 'chart', x: '6%', y: '16%', size: 32, delay: '0s', duration: '3.5s', rotate: -8 },
  { id: 'dollar', x: '88%', y: '10%', size: 30, delay: '0.4s', duration: '3s', rotate: 12 },
  { id: 'cart', x: '74%', y: '62%', size: 34, delay: '0.8s', duration: '3.8s', rotate: -5 },
  { id: 'briefcase', x: '12%', y: '70%', size: 36, delay: '0.2s', duration: '3.2s', rotate: 8 },
  { id: 'target', x: '92%', y: '38%', size: 32, delay: '1s', duration: '3.6s', rotate: 0 },
  { id: 'trending', x: '22%', y: '38%', size: 34, delay: '0.6s', duration: '3.3s', rotate: -12 },
  { id: 'package', x: '58%', y: '12%', size: 30, delay: '1.2s', duration: '3.7s', rotate: 6 },
  { id: 'users', x: '42%', y: '78%', size: 32, delay: '0.3s', duration: '3.1s', rotate: -4 },
  { id: 'lightbulb', x: '80%', y: '82%', size: 30, delay: '1.4s', duration: '3.4s', rotate: 10 },
  { id: 'graph', x: '34%', y: '8%', size: 28, delay: '0.7s', duration: '3.5s', rotate: -6 },
  { id: 'percent', x: '96%', y: '68%', size: 30, delay: '1.1s', duration: '3.2s', rotate: 4 },
  { id: 'building', x: '48%', y: '28%', size: 32, delay: '0.5s', duration: '3.6s', rotate: 0 },
  { id: 'coin', x: '16%', y: '50%', size: 28, delay: '1.3s', duration: '3.3s', rotate: -10 },
  { id: 'globe', x: '66%', y: '30%', size: 30, delay: '0.9s', duration: '3.8s', rotate: 8 },
  { id: 'rocket', x: '28%', y: '60%', size: 32, delay: '0.1s', duration: '3s', rotate: 15 },
];

function DoodleShape({ id }: { id: string }) {
  const stroke = 'currentColor';
  const sw = 1.6;

  switch (id) {
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3 L3 20 L21 20" />
          <rect x="6" y="12" width="3" height="6" rx="0.5" />
          <rect x="11" y="8" width="3" height="10" rx="0.5" />
          <rect x="16" y="5" width="3" height="13" rx="0.5" />
        </svg>
      );
    case 'dollar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 L12 22" />
          <path d="M17 6 C17 4 14.5 3 12 3 C9.5 3 7 4 7 6.5 C7 9 9 10 12 10.5 C15 11 17 12 17 14.5 C17 17 14.5 18 12 18 C9.5 18 7 17 7 15" />
        </svg>
      );
    case 'cart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4 L5 4 L7 16 L19 16 L21 8 L7 8" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="7" width="18" height="13" rx="1.5" />
          <path d="M9 7 L9 5 C9 4 10 3 12 3 C14 3 15 4 15 5 L15 7" />
          <path d="M3 12 L21 12" />
          <rect x="10" y="11" width="4" height="2.5" rx="0.5" />
        </svg>
      );
    case 'target':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5.5" />
          <circle cx="12" cy="12" r="2" fill={stroke} />
        </svg>
      );
    case 'trending':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17 L9 11 L13 15 L21 7" />
          <path d="M15 7 L21 7 L21 13" />
        </svg>
      );
    case 'package':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 L21 7.5 L21 16.5 L12 21 L3 16.5 L3 7.5 Z" />
          <path d="M3 7.5 L12 12 L21 7.5 M12 12 L12 21" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20 C3 16 6 14 9 14 C12 14 15 16 15 20" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M16 14 C19 14 21 16 21 19" />
        </svg>
      );
    case 'lightbulb':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18 L15 18 M10 21 L14 21" />
          <path d="M12 3 C8 3 5 6 5 10 C5 13 7 15 9 16 L9 18 L15 18 L15 16 C17 15 19 13 19 10 C19 6 16 3 12 3 Z" />
        </svg>
      );
    case 'graph':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3 L3 20 L21 20" />
          <path d="M5 16 L9 12 L12 14 L18 7" />
          <circle cx="9" cy="12" r="1.2" fill={stroke} />
          <circle cx="12" cy="14" r="1.2" fill={stroke} />
          <circle cx="18" cy="7" r="1.2" fill={stroke} />
        </svg>
      );
    case 'percent':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19 L19 5" />
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="17" cy="17" r="2.5" />
        </svg>
      );
    case 'building':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="3" width="14" height="18" rx="0.5" />
          <path d="M9 7 L9 8 M12 7 L12 8 M15 7 L15 8" />
          <path d="M9 11 L9 12 M12 11 L12 12 M15 11 L15 12" />
          <path d="M9 15 L9 16 M12 15 L12 16 M15 15 L15 16" />
          <rect x="10" y="18" width="4" height="3" rx="0.3" />
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6 L4 12 C4 13.5 7.5 15 12 15 C16.5 15 20 13.5 20 12 L20 6" />
          <path d="M4 12 L4 18 C4 19.5 7.5 21 12 21 C16.5 21 20 19.5 20 18 L20 12" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12 L21 12" />
          <path d="M12 3 C15 6 16 9 16 12 C16 15 15 18 12 21 C9 18 8 15 8 12 C8 9 9 6 12 3 Z" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 C16 5 18 9 18 14 L18 18 L12 21 L6 18 L6 14 C6 9 8 5 12 3 Z" />
          <circle cx="12" cy="11" r="2" />
          <path d="M8 18 L6 21 M16 18 L18 21" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Doodles({ className = '' }: DoodlesProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {DOODLES.map((d) => (
        <div
          key={d.id}
          className="absolute text-sky-400/20 animate-float"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            transform: `rotate(${d.rotate}deg)`,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        >
          <DoodleShape id={d.id} />
        </div>
      ))}
    </div>
  );
}
