
import React, { useState } from 'react'

const RRSO = parseFloat(import.meta.env.VITE_RRSO) || 8.5

export default function App() {
  const [price, setPrice] = useState(220000)
  const [initial, setInitial] = useState(20)
  const [months, setMonths] = useState(35)
  const [buyout, setBuyout] = useState(10)
  const [warning, setWarning] = useState("")

  const monthlyRate = Math.pow(1 + RRSO / 100, 1 / 12) - 1
  const initialPayment = (price * initial) / 100
  const buyoutValue = (price * buyout) / 100
  const financedAmount = price - initialPayment - buyoutValue
  const buyoutInterest = buyout > 1 ? buyoutValue * monthlyRate * months : 0
  const totalFinanced = financedAmount + buyoutInterest

  const leaseInstallment = totalFinanced * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)

  const totalCost = leaseInstallment * months + initialPayment + buyoutValue
  const costPercent = (totalCost / price) * 100

  const validateBuyout = (mies, val) => {
    const rules = {
      24: [18, 60],
      35: [1, 50],
      47: [1, 40],
      59: [1, 30],
    }
    const [min, max] = rules[mies] || [1, 60]
    return val >= min && val <= max
  }

  const formatPLN = val => val.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })

  const handleBuyoutChange = val => {
    const v = parseFloat(val)
    setBuyout(v)
    setWarning(validateBuyout(months, v) ? "" : "⚠️ Wartość wykupu poza zakresem")
  }

  return (
    <div className="container">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h1>Kalkulator Leasingu</h1>

      <label>Cena brutto: {formatPLN(price)}</label>
      <input type="range" min="100000" max="500000" step="1000" value={price}
        onChange={(e) => setPrice(Number(e.target.value))} />

      <label>Wkład własny: {initial}%</label>
      <input type="range" min="0" max="45" step="1" value={initial}
        onChange={(e) => setInitial(Number(e.target.value))} />

      <label>Okres leasingu:</label>
      <select value={months} onChange={(e) => setMonths(parseInt(e.target.value))}>
        <option value="24">24 miesiące</option>
        <option value="35">35 miesięcy</option>
        <option value="47">47 miesięcy</option>
        <option value="59">59 miesięcy</option>
      </select>

      <label>Wykup: {buyout}%</label>
      <input type="range" min="1" max="60" step="1" value={buyout}
        onChange={(e) => handleBuyoutChange(e.target.value)} />
      {warning && <p className="warning">{warning}</p>}

      <div className="result">💳 Rata brutto: {formatPLN(leaseInstallment)}</div>
      <div className="result">📦 Suma kosztów leasingu: {formatPLN(totalCost)}</div>
      <div className="result">📊 Całkowity koszt: {costPercent.toFixed(2)}%</div>
    </div>
  )
}
