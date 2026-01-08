import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import { GridViewIcon, ListViewIcon } from '@/_components/icons';
import { useTranslations } from 'next-intl';

export default function SortView({ handleChangeParams, paramsState, toggleDrawer }) {
  const t = useTranslations('ShopPage');
  return (
    <Box
      sx={{
        display: 'flex',
        width: { xs: '100%', sm: '100%', md: 'auto' },
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' }, flexGrow: 1 }}>
        <Box onClick={() => toggleDrawer(true)} sx={{ display: 'flex' }}>
          <TuneIcon sx={{ color: '#8a8c8dff' }} />
          <Typography sx={{ color: '#262b2eff', fontSize: '14px', ml: '10px' }}>{t('filters')}</Typography>
        </Box>
      </Box>

      {/* <div
        onClick={() => handleChangeParams('view', 'list')}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: paramsState.view === 'list' ? '#807d7d48' : '',
          borderRadius: '5px',
          marginRight: '10px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <ListViewIcon />
      </div>
      <div
        onClick={() => handleChangeParams('view', 'grid')}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: paramsState.view === 'grid' ? '#807d7d48' : '',
          borderRadius: '5px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <GridViewIcon />
      </div> */}

      <FormControl
        size="small"
        sx={{
          minWidth: 130,
          maxWidth: 160,

          '& .MuiInputBase-root': { height: '30px', borderRadius: '10px' },
          '& .MuiInputLabel-root': {
            top: '15px',
            transform: 'translateY(-50%)',
            // fontSize: '14px',
            left: '5px',
          },
          '& .MuiInputLabel-shrink': { top: '0px', fontSize: '11px', left: '13px' },
          // '& .MuiSelect-select': { paddingTop: '8px', paddingBottom: '4px' },
        }}
      >
        <InputLabel sx={{ fontSize: '14px' }}>{t('sortBy')}</InputLabel>

        <Select
          label={t('sortBy')}
          value={paramsState.orderBy}
          onChange={(event) => handleChangeParams('orderBy', event.target.value)}
          IconComponent={ExpandMoreIcon}
        >
          <MenuItem value={'price_asc'}>{t('priceLowHigh')}</MenuItem>
          <MenuItem value={'price_desc'}>{t('priceHighLow')}</MenuItem>
          <MenuItem value={'default'}>{t('default')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
