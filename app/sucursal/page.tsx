'use client';

import axios from 'axios';
import { H1, P, DataBox, AccentTable, QuantityInput, KeyValuePair } from '@components';
import { useEffect, useState } from 'react';
import { API_URL } from '@service';

type Transaction = {
  header: string;
  value: number;
};

type Currency = {
  Serie: string | number;
  Cantidad: number;
  Saldo: number;
  warning?: string; // In case of discrepancy.
};

// Fetch transaction data from the API
async function fetchTransactionData(): Promise<Transaction[]> {
  try {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction data: ", error);
    return [];
  }
}

// Fetch currency data from the API and check for discrepancies
async function fetchCurrencyData(): Promise<{ pesos: Currency[]; dolares: Currency[] }> {
  try {
    const response = await axios.get(`${API_URL}/cash`);
    const data = response.data;
    const cashData = data[0]?.cash;

    if (!cashData) {
      throw new Error("Invalid currency data");
    }

    // Check discrepancies
    const checkDiscrepancies = (currencyList: Currency[], tableName: string): Currency[] => {
      return currencyList.map((currency) => {
        const validSerie = isNaN(Number(currency.Serie)) ? 1 : Number(currency.Serie);
        const computedSaldo = validSerie * currency.Cantidad;
        if (computedSaldo !== currency.Saldo) {
          return {
            ...currency,
            warning: `Discrepancia en caja de ${tableName}: el saldo calculado (${computedSaldo}) no equivale al saldo recuperado (${currency.Saldo}).`
          };
        }
        return currency;
      });
    };

    return {
      pesos: checkDiscrepancies(cashData.pesos || [], 'pesos'),
      dolares: checkDiscrepancies(cashData.dolares || [], 'dolares'),
    };
  } catch (error) {
    console.error("Error fetching currency data: ", error);
    return { pesos: [], dolares: [] };
  }
}

export default function Page() {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [currencyData, setCurrencyData] = useState<{ pesos: Currency[]; dolares: Currency[] }>({ pesos: [], dolares: [] });
  const [warnings, setWarnings] = useState<string[]>([]);

  const accentColors = ['#FD0000', '#26AB35', '#16BFD6', '#F765A3'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactions, currencies] = await Promise.all([
          fetchTransactionData(),
          fetchCurrencyData(),
        ]);

        setTransactionData(transactions);
        setCurrencyData(currencies);

        // Set warnings if any discrepancies are found
        const newWarnings = [...currencies.pesos, ...currencies.dolares]
          .filter((currency) => currency.warning)
          .map((currency) => currency.warning as string);
        setWarnings(newWarnings);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const handleCantidadChange = (index: number, newCantidad: number | undefined, currencyType: 'pesos' | 'dolares') => {
    setCurrencyData((prevCurrencyData) => {
      const updatedCurrencies = [...prevCurrencyData[currencyType]];
      const updatedCurrency = { ...updatedCurrencies[index] };

      updatedCurrency.Cantidad = newCantidad ?? 0;

      const validSerie = isNaN(Number(updatedCurrency.Serie)) ? 1 : Number(updatedCurrency.Serie);

      // Update the `Saldo` based on the new `Cantidad`
      updatedCurrency.Saldo = validSerie * updatedCurrency.Cantidad;

      updatedCurrencies[index] = updatedCurrency;

      return {
        ...prevCurrencyData,
        [currencyType]: updatedCurrencies,
      }
    })
  };

  const removeWarning = (index: number) => {
    setWarnings((prevWarnings) => prevWarnings.filter((_, i) => i !== index));
  }

  // Calculate the total `Saldo` dynamically based on the updated data
  const totalPesos = currencyData.pesos.reduce((total, item) => total + item.Saldo, 0);
  const totalDolares = currencyData.dolares.reduce((total, item) => total + item.Saldo, 0);

  return (
    <div className='flex bg-qt_light min-h-screen'>
      <div className='p-5 w-full max-w-full overflow-x-auto'>
        <H1 className='text-left tracking-tight mb-1'>Resumen de operaciones</H1>
        <P className='text-sm mb-4'>Revisa aquí los datos de la sucursal.</P>
        {/* Alertas */}
        {warnings.length > 0 && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            <H1 className="text-base font-bold mb-2">Alertas</H1>
            {warnings.map((warning, index) => (
              <P key={index} className="text-sm cursor-pointer" onClick={() => removeWarning(index)}>
                {warning}
              </P>
            ))}
          </div>
        )}

        {/* Tarjetas Operaciones */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'> {/* Adjusted layout here */}
          {transactionData.map((item, index) => (
            <DataBox
              key={index}
              header={item.header}
              value={item.value.toLocaleString()}
              subtitle="actualmente"
              accent={accentColors[index]}
              className="w-full"
            />
          ))}
        </div>

        {/* Cajas */}
        <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto mb-4'>
          {/* PESOS */}
          <AccentTable
            header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Caja de <span className='text-qt_blue inline'>pesos (MXN)</span></H1>}
            columns={[
              { header: 'Serie', key: 'Serie' },
              {
                header: 'Cantidad', key: 'Cantidad',
                render: (row: Currency) => (
                  <QuantityInput
                    initialValue={row.Cantidad}
                    max={999}
                    onChange={(newCantidad) => handleCantidadChange(currencyData.pesos.indexOf(row), newCantidad, 'pesos')}
                  />)
              },
              { header: 'Saldo', key: 'Saldo', render: (row: Currency) => ((row.Saldo)) }
            ]}
            rows={currencyData.pesos}
            footer={
              <div className='flex justify-between'>
                <KeyValuePair keyName='Diferencia' value='0' />
                <KeyValuePair keyName='Total' value={totalPesos.toLocaleString()} />
              </div>
            }
            className='w-full'
          />
          {/* DÓLARES */}
          <AccentTable
            header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Caja de <span className='text-qt_blue inline'>dólares (USD)</span></H1>}
            columns={[
              { header: 'Serie', key: 'Serie' },
              {
                header: 'Cantidad', key: 'Cantidad',
                render: (row: Currency) => (
                  <QuantityInput
                    initialValue={row.Cantidad}
                    max={999}
                    onChange={(newCantidad) => handleCantidadChange(currencyData.dolares.indexOf(row), newCantidad, 'dolares')}
                  />)
              },
              { header: 'Saldo', key: 'Saldo', render: (row: Currency) => ((row.Saldo))}
            ]}
            rows={currencyData.dolares}
            footer={
              <div className='flex justify-between'>
                <KeyValuePair keyName='Diferencia' value='0' />
                <KeyValuePair keyName='Total' value={totalDolares.toLocaleString()} />
              </div>
            }
            className='w-full'
          />
        </div>

        {/* Saldos */}
        <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto mb-4'> {/* Adjusted for vertical alignment */}
          <AccentTable
            header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Saldo de <span className='text-qt_blue inline'>divisas</span></H1>}
            columns={[
              { header: 'Divisa', key: 'Divisa' },
              { header: 'Saldo', key: 'Saldo' },
              { header: 'Compra', key: 'Compra' },
              { header: 'Venta', key: 'Venta' },
            ]}
            rows={[
              { Divisa: 'EURO', Saldo: 250, Compra: 350, Venta: 100 },
              { Divisa: 'CAN', Saldo: 0, Compra: 0, Venta: 0 },
              { Divisa: 'LIBRA', Saldo: 0, Compra: 0, Venta: 0 },
              { Divisa: 'FRANCO', Saldo: 0, Compra: 0, Venta: 0 },
            ]}
            className='w-full'
          />
          <AccentTable
            header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Saldo de <span className='text-qt_blue inline'>monedas</span></H1>}
            columns={[
              { header: 'Moneda', key: 'Moneda' },
              { header: 'Saldo', key: 'Saldo' },
              { header: 'Compra', key: 'Compra' },
              { header: 'Venta', key: 'Venta' },
            ]}
            rows={[
              { Moneda: 'Cente', Saldo: 0, Compra: 0, Venta: 0 },
              { Moneda: 'Mon. Oro', Saldo: 0, Compra: 0, Venta: 0 },
              { Moneda: 'Onza. Lib', Saldo: 0, Compra: 0, Venta: 0 },
              { Moneda: 'Mon. Plata', Saldo: 0, Compra: 0, Venta: 0 },
            ]}
            className='w-full'
          />
        </div>

        {/* Morrallas */}
        <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto mb-4'> {/* Adjusted for vertical alignment */}
          <AccentTable
            header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Morralla <span className='text-qt_blue inline'>caja fuerte</span></H1>}
            columns={[
              { header: 'Denominación', key: 'Denominación' },
              { header: 'Cantidad', key: 'Cantidad', render: (row) => (<div className='text-qt_dark'>{row['Denominación']}</div>) },
              { header: 'Monto', key: 'Monto' },
            ]}
            rows={[
              { Denominación: '0.5', Cantidad: 15, Monto: 7.5 },
              { Denominación: '1', Cantidad: 20, Monto: 20 },
              { Denominación: '2', Cantidad: 10, Monto: 20 },
              { Denominación: '5', Cantidad: 5, Monto: 25 },
              { Denominación: '10', Cantidad: 10, Monto: 100 },
              { Denominación: '20', Cantidad: 5, Monto: 100 },
            ]}
            className='w-full'
            footer={
              <div className='flex justify-end'>
                <KeyValuePair keyName='Subtotal' value={2515} />
              </div>
            }
          />
          <AccentTable
            header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Morralla <span className='text-qt_blue inline'>cajón</span></H1>}
            columns={[
              { header: 'Denominación', key: 'Denominación' },
              { header: 'Cantidad', key: 'Cantidad' },
              { header: 'Monto', key: 'Monto' },
            ]}
            rows={[
              { Denominación: '0.5', Cantidad: 15, Monto: 7.5 },
              { Denominación: '1', Cantidad: 20, Monto: 20 },
              { Denominación: '2', Cantidad: 10, Monto: 20 },
              { Denominación: '5', Cantidad: 5, Monto: 25 },
              { Denominación: '10', Cantidad: 10, Monto: 100 },
              { Denominación: '20', Cantidad: 5, Monto: 100 },
            ]}
            className='w-full'
            footer={
              <div className='flex justify-end'>
                <KeyValuePair keyName='Subtotal' value={2515} />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
