'use client';
import { useGlobalContext } from '@/app/GlobalContext';
import OrdersTab from '../_components/OrdersTab';

export default function OrdersPage() {
  const { orders } = useGlobalContext();

  return <OrdersTab orders={orders} />;
}
