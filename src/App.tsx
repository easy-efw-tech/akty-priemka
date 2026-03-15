import React, { useState } from 'react';
import { AdminPanel } from './pages/AdminPanel';
import { DiagnosticsForm } from './pages/DiagnosticsForm';
import { AvrForm } from './pages/AvrForm';
import type { RepairOrder } from './types';

type Page = 'admin' | 'form' | 'avr';

function App() {
  const [page, setPage] = useState<Page>('admin');
  const [editOrder, setEditOrder] = useState<RepairOrder | null>(null);
  const [avrOrder, setAvrOrder] = useState<RepairOrder | null>(null);

  const handleNewOrder = () => {
    setEditOrder(null);
    setPage('form');
  };

  const handleEditOrder = (order: RepairOrder) => {
    setEditOrder(order);
    setPage('form');
  };

  const handleBack = () => {
    setEditOrder(null);
    setPage('admin');
  };

  const handleOpenAvr = (order: RepairOrder) => {
    setAvrOrder(order);
    setPage('avr');
  };

  const handleAvrBack = () => {
    setAvrOrder(null);
    setPage('admin');
  };

  if (page === 'avr' && avrOrder) {
    return <AvrForm order={avrOrder} onBack={handleAvrBack} />;
  }

  if (page === 'form') {
    return (
      <DiagnosticsForm
        onBack={handleBack}
        editOrder={editOrder}
        onOpenAvr={handleOpenAvr}
      />
    );
  }

  return (
    <AdminPanel
      onNewOrder={handleNewOrder}
      onEditOrder={handleEditOrder}
      onOpenAvr={handleOpenAvr}
    />
  );
}

export default App;
