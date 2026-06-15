import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import InfiniteCanvas from '../components/InfiniteCanvas'
import DesignModal from '../components/DesignModal'

export default function DesignPage() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [originRect, setOriginRect] = useState(null)

  return (
    <PageTransition className="bg-white">
      <BackButton variant="light" />

      <InfiniteCanvas
        onCardClick={(item, rect) => {
          setSelectedProject(item)
          setOriginRect(rect)
        }}
      />

      <AnimatePresence>
        {selectedProject && (
          <DesignModal
            project={selectedProject}
            originRect={originRect}
            onClose={() => {
              setSelectedProject(null)
              setOriginRect(null)
            }}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
