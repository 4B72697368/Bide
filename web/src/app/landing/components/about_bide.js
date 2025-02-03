'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code, Zap, BrainCircuit, Github, Rss, Users } from 'lucide-react'

const features = [
  { icon: Code, title: 'Intelligent Code Completion', description: 'By using the Monaco editor, Bide shares the same intillisense features as VSC.' },
  { icon: Zap, title: 'Lightning-Fast Performance', description: 'Optimized for speed, Bide ensures smooth coding even in large projects.' },
  { icon: Github, title: 'Github Integration', description: 'Effortlessly sync your projects through bi-directional github support.' },
  { icon: BrainCircuit, title: 'AI Chatbot', description: 'Bide has an incorporated AI chatbot to assist you in development.' },
  { icon: Rss, title: 'Web Based', description: 'Setup and work seamlessy across devices, fast.' },
  { icon: Users, title: 'Collaborative Editing', description: 'Coming Soon!' },
]

const AboutBide = () => {
  return (
    <section className='min-h-screen w-full bg-gradient-to-b from-[#070707] to-[#1a1a1a] text-white overflow-hidden'>
      <div className='container mx-auto px-4 py-16'>
        <motion.h1
          className='text-4xl md:text-6xl xl:text-7xl font-bold text-center mb-8'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About <span className='text-blue-500'>Bide</span>
        </motion.h1>

        <motion.p
          className='text-xl md:text-2xl text-center mb-16 text-gray-300'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          The next-generation IDE that empowers developers to code smarter, faster, and more collaboratively.
        </motion.p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className='bg-[#1e1e1e] p-6 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <feature.icon className='w-12 h-12 text-blue-500 mb-4' />
              <h2 className='text-xl font-semibold mb-2'>{feature.title}</h2>
              <p className='text-gray-400'>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a
            href="/login"
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300'
          >
            Try Bide Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutBide