import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from '@/providers/WagmiProvider'
import Home from '@pages/Home'
import Dashboard from '@pages/Dashboard'
import Referral from '@pages/Referral'
import Transaction from '@pages/Transaction'
import './App.css'

function App() {
  return (
    <WagmiProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/transactions" element={<Transaction />} />
        </Routes>
      </Router>
    </WagmiProvider>
  )
}

export default App
