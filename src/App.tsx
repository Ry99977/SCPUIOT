import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { useUserStore } from '@/store/userStore'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Projects } from '@/components/Projects'
import { BaseConverter } from '@/components/BaseConverter'
import { BubbleSort } from '@/components/BubbleSort'
import { Draw } from '@/components/Draw'
import { Activities } from '@/components/Activities'
import { Login } from '@/components/Login'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { ParticleBg } from '@/components/ParticleBg'

function Home() {
  return (
    <>
      <ParticleBg />
      <div className="scan-line" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <BaseConverter />
        <BubbleSort />
        <Draw />
        <Activities />
        <Login />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function App() {
  const initUsers = useUserStore((s) => s.initUsers)
  useEffect(() => { initUsers() }, [initUsers])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyber-bg dark:bg-cyber-bg light:bg-cyber-bg-light text-cyber-text dark:text-cyber-text light:text-cyber-text-light transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
