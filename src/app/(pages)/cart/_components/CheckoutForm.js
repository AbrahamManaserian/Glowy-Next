import { Box, InputBase, Typography, Checkbox, FormControlLabel } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmRoundedIcon from '@mui/icons-material/LocalAtmRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';

const inputTextGroupObj = {
  fullName: 'Full name',
  phoneNumber: 'Phone number',
  address: 'Shipping address',
  email: 'Email address',
  note: 'Notes',
};

const shippingMethodObj = {
  free: {
    type: 'Free',
    deliveryDuration: '1-3 days delivery',
    icon: <DirectionsBikeIcon sx={{ fontSize: '20px', mr: '8px' }} />,
    price: '֏0',
    description:
      "Your order will be delivered by our partner 'EcoMove Logistics'. We ensure safe handling of your items. Delivery typically takes 1-3 business days. You will receive an SMS notification on the morning of the delivery.",
  },
  standart: {
    type: 'Standart',
    deliveryDuration: '1-3 days delivery',
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: '20px', mr: '8px' }} />,
    price: '֏1000',
    description:
      "Standard delivery is handled by 'CityExpress'. Reliable service with tracking available. Expect your package within 1-3 business days. Our couriers will contact you before arrival.",
  },
  express: {
    type: 'Express',
    deliveryDuration: '1 day delivery',
    icon: <RocketLaunchOutlinedIcon sx={{ fontSize: '20px', mr: '8px' }} />,
    price: '֏3000',
    description:
      "Premium express service via 'RocketShip Couriers'. Guaranteed next-day delivery for orders placed before 2 PM. Perfect for urgent gifts or last-minute needs. Priority handling included.",
  },
};

const ShippingMethod = ({ checked, icon, type, duration, price, disabled }) => {
  return (
    <Box
      sx={{
        borderRadius: '10px',
        display: 'flex',
        border: 'solid 0.5px #c5c7cc91',
        boxSizing: 'border-box',
        p: '15px',
        m: 0,
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <Box
        sx={{
          bgcolor: checked ? '#e65100' : 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: !checked ? 'solid 1px #c5c7cc8a' : 'solid 1px #f8f8f8',
          mr: '15px',
        }}
      >
        <DoneIcon sx={{ fontSize: '12px', color: 'white' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex' }}>
          {icon}
          <Typography>{type}</Typography>
        </Box>
        <Typography>{price}</Typography>
        <Typography sx={{ width: '100%', color: '#666a72ff', fontSize: '14px', fontWeight: 300 }}>
          {duration}
        </Typography>
      </Box>
    </Box>
  );
};

export default function CheckoutForm({
  cartState,
  setCartState,
  handleInputChange,
  isFreeShippingAvailable,
}) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '30px' }}>
        <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            bgcolor: '#e65100',
            width: '30px',
            height: '30px',
            color: 'white',
            mr: '15px',
          }}
        >
          1
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>Personal details</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {Object.keys(inputTextGroupObj).map((key, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: key === 'note' ? '100%' : { xs: '100%', sm: 'calc(50% - 8px)' },
                mr: key === 'note' ? 0 : { xs: 0, sm: index % 2 !== 0 ? 0 : '8px' },
                ml: key === 'note' ? 0 : { xs: 0, sm: index % 2 == 0 ? 0 : '8px' },
                mb: '20px',
                boxSizing: 'border-box',
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: '3px', ml: '3px', fontSize: '13px', fontWeight: 500, color: '#333' }}
              >
                {inputTextGroupObj[key]}
                {(key === 'fullName' || key === 'phoneNumber' || key === 'address') && (
                  <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
                )}
              </Typography>
              <InputBase
                value={cartState[key]}
                onChange={(e) => handleInputChange(e)}
                name={key}
                required={key === 'fullName' || key === 'phoneNumber' || key === 'address'}
                sx={{
                  minHeight: '50px',
                  fontSize: '14px',

                  bgcolor: '#d2cccc17',
                  borderRadius: '8px',
                  p: '4px 20px',
                  border: 'solid 1px #ffffffff',
                  '&.Mui-focused': {
                    border: 'solid 1px #030303dd',
                  },
                  flexGrow: 1,
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                    {
                      WebkitAppearance: 'none', // Chrome, Safari, Edge
                    },
                }}
                type={key === 'phoneNumber' ? 'number' : ''}
                onKeyDown={(e) => {
                  if (key === 'phoneNumber' && ['e', 'E', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                multiline={key === 'note' ? true : false}
              />
            </Box>
          );
        })}
      </Box>
      <Box sx={{ mt: '20px' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={cartState.saveUserInfo}
              onChange={(e) => setCartState({ ...cartState, saveUserInfo: e.target.checked })}
              color="primary"
            />
          }
          label="Save this information for future orders"
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '35px', mb: '15px' }}>
        <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            bgcolor: '#e65100',
            width: '30px',
            height: '30px',
            color: 'white',
            mr: '15px',
          }}
        >
          2
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>Shipping method</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {Object.keys(shippingMethodObj).map((key, index) => {
          const isDisabled =
            key === 'free'
              ? !isFreeShippingAvailable
              : key === 'standart'
              ? isFreeShippingAvailable
              : key === 'express'
              ? true
              : false;

          return (
            <Box
              key={index}
              onClick={() => {
                if (!isDisabled) {
                  setCartState({ ...cartState, shippingMethod: key });
                }
              }}
              sx={{
                borderRadius: '11px',
                width: { xs: '100%', sm: 'calc(50% - 5px)' },
                my: '10px',
                p: 0,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                border: key === cartState.shippingMethod ? 'solid 1.5px #3c3e448a' : 'solid 1.5px #c5c7cc08',
                boxSizing: 'border-box',
                mr: { xs: 0, sm: index % 2 !== 0 ? 0 : '5px' },
                ml: { xs: 0, sm: index % 2 == 0 ? 0 : '5px' },
                transition: ' all 0.2s ease',
                WebkitTapHighlightColor: 'transparent',
                opacity: isDisabled ? 0.5 : 1,
              }}
            >
              <ShippingMethod
                icon={shippingMethodObj[key].icon}
                type={shippingMethodObj[key].type}
                duration={shippingMethodObj[key].deliveryDuration}
                price={shippingMethodObj[key].price}
                checked={key === cartState.shippingMethod}
                disabled={isDisabled}
              />
            </Box>
          );
        })}
      </Box>
      <Box sx={{ mt: '15px', ml: '5px', p: '15px', bgcolor: '#f9f9f9', borderRadius: '8px' }}>
        <Typography sx={{ fontSize: '14px', color: '#333', mb: '8px', fontWeight: 600 }}>
          Delivery Information:
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#555', lineHeight: 1.6 }}>
          {shippingMethodObj[cartState.shippingMethod]?.description}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: '35px', mb: '15px' }}>
        <Typography
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            bgcolor: '#e65100',
            width: '30px',
            height: '30px',
            color: 'white',
            mr: '15px',
          }}
        >
          3
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: '18px' }}>Payment method</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box
          onClick={() => setCartState({ ...cartState, paymentMethod: 'card' })}
          sx={{
            borderRadius: '11px',
            width: { xs: '100%', sm: 'calc(50% - 5px)' },
            my: '10px',
            p: 0,
            cursor: 'pointer',
            border: cartState.paymentMethod === 'card' ? 'solid 1.5px #3c3e448a' : 'solid 1.5px #c5c7cc08',
            boxSizing: 'border-box',
            mr: { xs: 0, sm: '5px' },

            transition: ' all 0.2s ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Box
            sx={{
              borderRadius: '10px',
              display: 'flex',
              border: 'solid 0.5px #c5c7cc91',
              boxSizing: 'border-box',
              p: '15px',
              m: 0,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                bgcolor: cartState.paymentMethod === 'card' ? '#e65100' : 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: cartState.paymentMethod !== 'card' ? 'solid 1px #c5c7cc8a' : 'solid 1px #f8f8f8',
                mr: '15px',
              }}
            >
              <DoneIcon sx={{ fontSize: '12px', color: 'white' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, flexWrap: 'wrap' }}>
              <Typography>With bank card</Typography>
              <CreditCardIcon sx={{ mr: '8px' }} />
              <Typography sx={{ width: '100%', color: '#666a72ff', fontSize: '14px', fontWeight: 300 }}>
                Secure checkout
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          onClick={() => setCartState({ ...cartState, paymentMethod: 'cash' })}
          sx={{
            borderRadius: '11px',
            width: { xs: '100%', sm: 'calc(50% - 5px)' },
            my: '10px',
            p: 0,
            cursor: 'pointer',
            border: cartState.paymentMethod === 'cash' ? 'solid 1.5px #3c3e448a' : 'solid 1.5px #c5c7cc08',
            boxSizing: 'border-box',
            ml: { xs: 0, sm: '5px' },

            transition: ' all 0.2s ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <Box
            sx={{
              borderRadius: '10px',
              display: 'flex',
              border: 'solid 0.5px #c5c7cc91',
              boxSizing: 'border-box',
              p: '15px',
              m: 0,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                bgcolor: cartState.paymentMethod === 'cash' ? '#e65100' : 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: cartState.paymentMethod !== 'cash' ? 'solid 1px #c5c7cc8a' : 'solid 1px #f8f8f8',
                mr: '15px',
              }}
            >
              <DoneIcon sx={{ fontSize: '12px', color: 'white' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, flexWrap: 'wrap' }}>
              <Typography>Pay by cash</Typography>
              <LocalAtmRoundedIcon sx={{ mr: '8px' }} />
              <Typography sx={{ width: '100%', color: '#666a72ff', fontSize: '14px', fontWeight: 300 }}>
                Secure checkout
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
