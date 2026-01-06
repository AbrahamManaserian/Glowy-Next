'use client';
import { InputBase } from '@mui/material';
import { SearchIcon } from '../icons';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SearchComponent() {
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const t = useTranslations('Categories');
  useEffect(() => {
    setSearch('');
  }, [pathname]);
  return (
    <InputBase
      value={search}
      onChange={(event) => {
        setSearch(event.target.value);
      }}
      sx={{
        height: '40px',
        fontSize: '14px',
        bgcolor: '#d2cccc17',
        borderRadius: '8px',
        p: '0 20px',
        border: 'solid 1px #ffffffff',
        '&.Mui-focused': {
          border: 'solid 1px #030303dd',
        },
        flexGrow: 1,
      }}
      placeholder={t('searchingFor')}
      endAdornment={<SearchIcon />}
    />
  );
}
