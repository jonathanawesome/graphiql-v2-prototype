import { theme } from '../../../theme';

export const Chevron = ({ active }: { active: boolean }) => {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 30.1019L3.8981 10L0 13.8981L24 37.8981L48 13.8981L44.1019 10L24 30.1019Z"
        fill={theme.colors.scale600.value}
        style={{
          transformOrigin: 'center center',
          transform: active ? undefined : 'rotate(180deg)',
        }}
      />
    </svg>
  );
};
