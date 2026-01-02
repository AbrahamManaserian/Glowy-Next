import { useTranslations } from 'next-intl';

export default function HelpPage() {
  const t = useTranslations('HelpPage');
  return <div>{t('title')}</div>;
}
