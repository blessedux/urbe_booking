"use client"

import { Header } from "@/components/header"
import { RoomBooking } from "@/components/room-showcase"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Header />
      <main>
        <RoomBooking />
      </main>
    </motion.div>
  )
}
