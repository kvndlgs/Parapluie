import localFont from 'next/font/local';

export const monumentNormal = localFont({
  src: [
    {
      path: './PPMonumentNormal-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './PPMonumentNormal-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-monument-normal',
});

export const monumentWide = localFont({
  src: [
    {
      path: './PPMonumentWide-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './PPMonumentWide-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-monument-wide',
});
