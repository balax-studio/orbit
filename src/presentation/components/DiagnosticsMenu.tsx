import React from 'react';
import { CustomerManager } from '../../domain/customer/CustomerManager';
import { ProductionManager } from '../../domain/production/ProductionManager';

interface DiagnosticsMenuProps {
  customerManager: CustomerManager;
  productionManager: ProductionManager;
  onClose: () => void;
  onOpened: () => void;
}

export const DiagnosticsMenu: React.FC<DiagnosticsMenuProps> = ({ 
  customerManager, 
  productionManager, 
  onClose,
  onOpened
}) => {
  
  // Bileşen açıldığında tetikleyiciyi çalıştır
  React.useEffect(() => {
    onOpened();
  }, [onOpened]);

  const lostSales = customerManager.getLostSales();
  const outOfStockCount = lostSales.filter(l => l.reason === 'OUT_OF_STOCK').length;
  const patienceExhaustedCount = lostSales.filter(l => l.reason === 'PATIENCE_EXHAUSTED').length;
  const budgetRejectedCount = lostSales.filter(l => l.reason === 'BUDGET_REJECTED').length;
  
  // Üretim Makineleri Teşhisi
  const allMachines = productionManager.getAllMachines();
  const blockedMachines = allMachines.filter(m => m.status === 'BlockedOutput' || m.status === 'NoPower');
  const idleMachines = allMachines.filter(m => m.status === 'Idle' || m.status === 'NoInput' || m.status === 'Ready');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 pointer-events-auto">
      <div className="flex w-full max-w-md flex-col bg-[#F4F0E6] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#35D9E6] p-3">
          <h2 className="text-xl font-black uppercase text-black">İŞLETME TEŞHİSİ</h2>
          <button 
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border-2 border-black bg-white font-black hover:bg-gray-200"
          >
            X
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4 text-black">
          
          <div className="flex flex-col gap-1 border-2 border-black bg-white p-2">
            <h3 className="text-sm font-bold uppercase border-b-2 border-black pb-1">Satış & Raf (Son Kayıtlar)</h3>
            <div className="text-xs font-medium mt-1">
              <p>Stok Yetersizliği Nedeniyle Kaçan: <span className="font-bold text-red-600">{outOfStockCount}</span></p>
              <p>Sabrı Tükenen Müşteri: <span className="font-bold text-red-600">{patienceExhaustedCount}</span></p>
              <p>Bütçesi Uymayan Müşteri: <span className="font-bold text-stone-600">{budgetRejectedCount}</span></p>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-2 border-black bg-white p-2">
            <h3 className="text-sm font-bold uppercase border-b-2 border-black pb-1">Üretim Tesisleri</h3>
            <div className="text-xs font-medium mt-1">
              <p>Toplam Üretim Tesisi: <span className="font-bold">{allMachines.length}</span></p>
              <p>Boşta (İş Bekleyen): <span className="font-bold text-orange-500">{idleMachines.length}</span></p>
              <p>Tıkalı (Malzeme/Yer Yok): <span className="font-bold text-red-600">{blockedMachines.length}</span></p>
            </div>
            
            {blockedMachines.length > 0 && (
              <div className="mt-2 bg-red-100 border border-red-500 p-1 text-xs text-red-800">
                ⚠️ UYARI: Tıkalı üretim hatları var. Çıkış rafını boşaltın veya hammadde temin edin.
              </div>
            )}
            {outOfStockCount > 3 && (
               <div className="mt-2 bg-orange-100 border border-orange-500 p-1 text-xs text-orange-800">
                 💡 ÖNERİ: Raf sık sık boş kalıyor. Tedarik veya üretimi hızlandırın.
               </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
};
