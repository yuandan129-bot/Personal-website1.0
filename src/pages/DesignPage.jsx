import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import InfiniteCanvas from '../components/InfiniteCanvas'
import DesignModal from '../components/DesignModal'

export default function DesignPage() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <PageTransition className="bg-white">
      <BackButton variant="light" />

      <InfiniteCanvas onCardClick={setSelectedProject} />

      <AnimatePresence>
        {selectedProject && (
          <DesignModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
