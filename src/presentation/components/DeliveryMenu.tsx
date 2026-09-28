import React, { useState } from 'react';
import type { DeliveryManager } from '../../domain/supply/DeliveryManager';

interface DeliveryMenuProps {
  deliveryManager: DeliveryManager | null;
  onClose: () => void;
  currentTick: number;
  onOrderPlaced?: () => void;
}

const SUPPLY_ITEMS = [
  { id: 'item.fodder', name: 'Geviş Getiren Yemi', unitCostAtoms: 100 }, // 1 kredi
  { id: 'item.salt', name: 'Kaya Tuzu', unitCostAtoms: 50 }, // 0.5 kredi
];

export const DeliveryMenu: React.FC<DeliveryMenuProps> = ({
  deliveryManager,
  onClose,
  currentTick,
  onOrderPlaced
}) => {
  const [selectedItem, setSelectedItem] = useState(SUPPLY_ITEMS[0].id);
  const [quantity, setQuantity] = useState(10);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedDef = SUPPLY_ITEMS.find((s) => s.id === selectedItem);
  const totalCost = selectedDef ? (selectedDef.unitCostAtoms * quantity) / 100 : 0;

  const handleOrder = () => {
    if (!deliveryManager || !selectedDef) return;
    
    try {
      deliveryManager.placeOrder(
        selectedItem as any, 
        quantity, 
        selectedDef.unitCostAtoms, 
        currentTick, 
        200 // 20 saniye (tick=100ms * 200 = 20s)
      );
      if (onOrderPlaced) onOrderPlaced();
      onClose(); // Sipariş başarılı, kapat
    } catch (err: any) {
      setErrorMsg(err.message || 'Bakiye yetersiz veya bir hata oluştu');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white border-4 border-black p-6 w-96 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white font-bold px-3 py-1 border-2 border-black hover:bg-red-600 transition-colors"
        >
          X
        </button>
        
        <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter border-b-4 border-black pb-2">Tedarik Siparişi</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Ürün Seçimi</label>
            <div className="flex flex-col gap-2">
              {SUPPLY_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`border-2 border-black px-4 py-2 text-left font-bold transition-all ${
                    selectedItem === item.id 
                      ? 'bg-blue-400 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-gray-100 hover:bg-gray-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1'
                  }`}
                >
                  {item.name} - {(item.unitCostAtoms / 100).toFixed(2)} KR
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block font-bold mb-1">Miktar</label>
            <div className="flex border-2 border-black">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 5))}
                className="bg-gray-200 px-4 py-2 font-black border-r-2 border-black hover:bg-gray-300"
              >
                -
              </button>
              <div className="flex-1 text-center font-bold text-xl py-2 bg-white">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(quantity + 5)}
                className="bg-gray-200 px-4 py-2 font-black border-l-2 border-black hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-200 border-2 border-black p-3 my-4">
            <div className="flex justify-between font-black text-lg">
              <span>TOPLAM TUTAR:</span>
              <span>{totalCost.toFixed(2)} KREDİ</span>
            </div>
          </div>
          
          {errorMsg && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-2 font-bold text-sm">
              ! {errorMsg}
            </div>
          )}
          
          <button
            onClick={handleOrder}
            className="w-full bg-green-400 border-2 border-black py-4 font-black text-xl hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            SİPARİŞİ ONAYLA
          </button>
        </div>
      </div>
    </div>
  );
};
